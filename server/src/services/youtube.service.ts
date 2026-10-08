import axios from "axios";
import { env } from "../config/env.js";
import Course from "../models/course.model.js";
import Video from "../models/video.model.js";
import UserCourse from "../models/userCourse.model.js";
import { BadRequestError } from "../utils/errors.js";

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

/**
 * One API key is a single point of failure: when it exhausts its daily quota
 * every import for every user fails until midnight Pacific. Supporting a
 * comma-separated list in YOUTUBE_API_KEY lets a deployment carry spares, and
 * the rotator below moves to the next key the moment one reports quotaExceeded.
 */
const apiKeys = env.YOUTUBE_API_KEY
  .split(",")
  .map((key) => key.trim())
  .filter(Boolean);

if (apiKeys.length === 0) {
  console.warn(
    "⚠️  YOUTUBE_API_KEY is not set. Previewing and importing courses will fail."
  );
}

let activeKeyIndex = 0;

const currentKey = () => apiKeys[activeKeyIndex % apiKeys.length];

/**
 * Advances to the next key. Returns false when there is only one key, which
 * means the caller must surface the quota error instead of retrying forever.
 */
const rotateKey = () => {
  if (apiKeys.length < 2) {
    return false;
  }

  activeKeyIndex = (activeKeyIndex + 1) % apiKeys.length;

  return true;
};

// The YouTube Data API charges 1 unit per list call but up to 100 per search,
// and a playlist import fans out into several calls. Repeating the same import
// is by far the easiest way to burn through the daily quota, so every response
// is cached for a while: a playlist's metadata and video list rarely change
// within a session.
const CACHE_TTL_MS = 30 * 60 * 1000;

// How long an existing course is trusted before an import re-reads the
// playlist from YouTube.
const RESYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

type CacheEntry = {
  expiresAt: number;
  value: unknown;
};

const responseCache = new Map<string, CacheEntry>();

/**
 * Same-endpoint requests issued in the same instant (two tabs importing the
 * same playlist) share one upstream call instead of racing.
 */
const inFlight = new Map<string, Promise<unknown>>();

const isQuotaError = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  if (status !== 403) {
    return false;
  }

  const reason = (
    error.response?.data as { error?: { errors?: { reason?: string }[] } }
  )?.error?.errors?.[0]?.reason;

  return reason === "quotaExceeded" || reason === "dailyLimitExceeded";
};

const shouldRetry = (error: unknown) => {
  if (!axios.isAxiosError(error)) {
    return false;
  }

  const status = error.response?.status;

  // Rate limited / server-side hiccup / no response at all - all worth one
  // more try. A 4xx that is not 429 is a bad request and will not improve.
  return (
    status === undefined ||
    status === 429 ||
    status === 500 ||
    status === 502 ||
    status === 503 ||
    status === 504
  );
};

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

type YoutubeRequestOptions = {
  /** How long the response may be reused. Pass 0 to always hit the network. */
  ttlMs?: number;
};

/**
 * The single door to the YouTube Data API.
 *
 * Every call goes through here so that caching, de-duplication, key rotation
 * and backoff apply uniformly - there is no way to accidentally issue an
 * unguarded request from elsewhere in the service.
 */
const fetchYoutube = async <T>(
  endpoint: string,
  params: Record<string, string | number | undefined>,
  { ttlMs = CACHE_TTL_MS }: YoutubeRequestOptions = {}
): Promise<T> => {
  if (apiKeys.length === 0) {
    throw new BadRequestError(
      "YouTube is not configured on this server."
    );
  }

  // The key is deliberately excluded from the cache key: the same query should
  // hit the cache no matter which key is currently active.
  const cacheKey = `${endpoint}?${JSON.stringify(params)}`;

  const cached = responseCache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return cached.value as T;
  }

  const pending = inFlight.get(cacheKey);

  if (pending) {
    return pending as Promise<T>;
  }

  const request = (async () => {
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await axios.get<T>(`${YOUTUBE_API_BASE}/${endpoint}`, {
          params: {
            ...params,
            key: currentKey(),
          },
          timeout: 15_000,
        });

        responseCache.set(cacheKey, {
          expiresAt: Date.now() + ttlMs,
          value: response.data,
        });

        return response.data;
      } catch (error) {
        // Rotating on quota errors is what keeps a busy deployment alive: one
        // exhausted key must not take the whole import path down with it.
        if (isQuotaError(error) && rotateKey()) {
          continue;
        }

        const isLastAttempt = attempt === maxAttempts - 1;

        if (isLastAttempt || !shouldRetry(error)) {
          throw error;
        }

        // 200ms, 400ms - short enough that a user does not notice, long
        // enough to clear a momentary rate limit.
        await sleep(200 * 2 ** attempt);
      }
    }

    // Unreachable: the loop either returns or throws.
    throw new BadRequestError("YouTube request failed");
  })();

  inFlight.set(cacheKey, request);

  try {
    return await request;
  } finally {
    inFlight.delete(cacheKey);
  }
};

export const detectYoutubeUrlType = (url: string) => {
  const parsedUrl = new URL(url);

  if (parsedUrl.searchParams.has("list")) {
    return "playlist";
  }

  if (
    parsedUrl.searchParams.has("v") ||
    parsedUrl.hostname === "youtu.be" ||
    parsedUrl.pathname.startsWith("/embed/")
  ) {
    return "single-video";
  }

  throw new BadRequestError("Invalid YouTube URL");
};

export const extractPlaylistId = (url: string) => {
  const parsedUrl = new URL(url);

  return parsedUrl.searchParams.get("list");
};

export const getPlaylistMetadata = async (playlistId: string) => {
  return fetchYoutube<any>("playlists", {
    part: "snippet,contentDetails",
    id: playlistId,
  });
};


export const formatPlaylistMetadata = (data: any) => {
  const playlist = data.items[0];

  return {
    title: playlist.snippet.title,
    description: playlist.snippet.description,
    thumbnail:
      playlist.snippet.thumbnails.maxres?.url ||
      playlist.snippet.thumbnails.high?.url ||
      playlist.snippet.thumbnails.medium?.url ||
      playlist.snippet.thumbnails.default?.url,
    channelName: playlist.snippet.channelTitle,
    playlistId: playlist.id,
    videoCount: playlist.contentDetails.itemCount,
  };
};

type PlaylistItemsResponse = {
  items: any[];
  nextPageToken?: string;
};

export const getPlaylistVideos = async (playlistId: string) => {
  const allVideos: any[] = [];
  let nextPageToken: string | undefined;

  do {
    const response = await fetchYoutube<PlaylistItemsResponse>(
      "playlistItems",
      {
        part: "snippet,contentDetails",
        playlistId,
        maxResults: 50,
        pageToken: nextPageToken,
      }
    );

    allVideos.push(...response.items);
    nextPageToken = response.nextPageToken;
  } while (nextPageToken);

  return {
    items: allVideos,
  };
};

export const formatPlaylistVideos = (data: any) => {
  return data.items.map((item: any, index: number) => ({
    videoId: item.contentDetails.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high?.url,
    position: index + 1,
  }));
};

export const getVideoDetails = async (videoIds: string[]) => {
    let allItems: any[] = [];

    for (let i = 0; i < videoIds.length; i += 50) {
      const chunk = videoIds.slice(i, i + 50);

      const response = await fetchYoutube<any>("videos", {
        part: "contentDetails",
        id: chunk.join(","),
      });

      allItems.push(...response.items);
    }

    return {
      items: allItems,
    };
};

export const mergeVideoDetails = (
  videos: any[],
  details: any
) => {
  const durationMap = new Map(
    details.items.map((item: any) => [
      item.id,
      item.contentDetails.duration,
    ])
  );

  return videos.map((video) => ({
    ...video,
    duration: durationMap.get(video.videoId),
  }));
};

type PlaylistVideo = {
  videoId: string;
  title: string;
  thumbnail: string;
  position: number;
};

export const importCourse = async (
  userId: string,
  url: string
) => {
  const type = detectYoutubeUrlType(url);

  switch (type) {
    case "playlist":
      return await importPlaylist(userId, url);

    case "single-video":
      return await importSingleVideo(userId, url);

    default:
      throw new BadRequestError("Invalid YouTube URL");
  }
};

const syncPlaylist = async (
  course: any,
  playlistId: string,
  url: string
) => {
  // Re-importing a playlist that was synced minutes ago would spend quota to
  // rediscover videos the database already holds. Reusing the recent sync is
  // the cheapest possible win against a daily quota.
  const lastSyncedAt = course.lastSyncedAt
    ? new Date(course.lastSyncedAt).getTime()
    : 0;

  if (Date.now() - lastSyncedAt < RESYNC_INTERVAL_MS) {
    return;
  }

  const rawMetadata =
    await getPlaylistMetadata(playlistId);

  const rawVideos =
    await getPlaylistVideos(playlistId);

  const metadata =
    formatPlaylistMetadata(rawMetadata);

  const videos: PlaylistVideo[] =
    formatPlaylistVideos(rawVideos);

  const details =
    await getVideoDetails(
      videos.map((v) => v.videoId)
    );

  const completeVideos =
    mergeVideoDetails(
      videos,
      details
    ).filter(
      (video) =>
        video.thumbnail &&
        video.duration
    );

  const existingVideos =
    await Video.find({
      course: course._id,
    }).select("videoId");

  const existingIds = new Set(
    existingVideos.map((v) => v.videoId)
  );

  const newVideos =
    completeVideos.filter(
      (video) =>
        !existingIds.has(
          video.videoId
        )
    );

  if (newVideos.length) {
    await Video.insertMany(
      newVideos.map((video) => ({
        course: course._id,
        videoId: video.videoId,
        youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
        title: video.title,
        thumbnail: video.thumbnail,
        duration: video.duration,
        position: video.position,
      }))
    );
  }

  course.title = metadata.title;
  course.description =
    metadata.description;
  course.thumbnail =
    metadata.thumbnail;
  course.channelName =
    metadata.channelName;
  course.playlistUrl = url;
  course.videoCount =
    completeVideos.length;
  course.totalDuration =
    calculateTotalDuration(
      completeVideos
    );
  course.lastSyncedAt =
    new Date();

  await course.save();
};

const importPlaylist = async (
  userId: string,
  url: string
) => {
  const playlistId = extractPlaylistId(url)!;

  let course = await Course.findOne({
    playlistId,
  });

  if (course) {
    await syncPlaylist(
      course,
      playlistId,
      url
    );

    const existingUserCourse =
      await UserCourse.findOne({
        owner: userId,
        course: course._id,
      });

    if (existingUserCourse) {
      return existingUserCourse;
    }

    return await UserCourse.create({
      owner: userId,
      course: course._id,
    });
  }

  const rawMetadata = await getPlaylistMetadata(playlistId);
  const rawVideos = await getPlaylistVideos(playlistId);

  const metadata = formatPlaylistMetadata(rawMetadata);

  const videos: PlaylistVideo[] = formatPlaylistVideos(rawVideos);

  const details = await getVideoDetails(
    videos.map((v) => v.videoId)
  );

const completeVideos = mergeVideoDetails(
  videos,
  details
).filter((video) => Boolean(video.thumbnail && video.duration));

  course = await Course.create({
    type: "playlist",
    title: metadata.title,
    description: metadata.description,
    thumbnail: metadata.thumbnail,
    channelName: metadata.channelName,
    playlistId: metadata.playlistId,
    playlistUrl: url,
    videoCount: completeVideos.length,
    totalDuration: calculateTotalDuration(completeVideos),
  });

  await Video.insertMany(
    completeVideos.map((video) => ({
      course: course._id,
      videoId: video.videoId,
      youtubeUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
      title: video.title,
      thumbnail: video.thumbnail,
      duration: video.duration,
      position: video.position,
    }))
  );

  return await UserCourse.create({
    owner: userId,
    course: course._id,
  });
};

const importSingleVideo = async (
  userId: string,
  url: string
) => {
  const videoId = extractVideoId(url)!;

  let course = await Course.findOne({
    videoId,
  });

  // Existing Course
  if (course) {
    const existingUserCourse = await UserCourse.findOne({
      owner: userId,
      course: course._id,
    });

    if (existingUserCourse) {
      throw new BadRequestError("Course already exists in your library.");
    }

    return await UserCourse.create({
      owner: userId,
      course: course._id,
    });
  }

  // Fetch metadata
  const rawVideo = await getVideoMetadata(videoId);
  const metadata = formatVideoMetadata(rawVideo);

  // Create Course
  course = await Course.create({
    type: "single-video",
    title: metadata.title,
    description: metadata.description,
    thumbnail: metadata.thumbnail,
    channelName: metadata.channelName,
    videoId: metadata.videoId,
    playlistUrl: url,
    videoCount: 1,
    totalDuration: calculateTotalDuration([
      {
        duration: metadata.duration,
      },
    ]),
  });

  // Create Video
  await Video.create({
    course: course._id,
    videoId: metadata.videoId,
    youtubeUrl: url,
    title: metadata.title,
    description: metadata.description,
    thumbnail: metadata.thumbnail,
    duration: metadata.duration,
    position: 1,
  });

  // Create UserCourse
  return await UserCourse.create({
    owner: userId,
    course: course._id,
  });
};

export const calculateTotalDuration = (
  videos: { duration?: string | null }[]
) => {
  let totalSeconds = 0;

  for (const video of videos) {
    if (!video.duration) continue;

    const match = video.duration.match(
      /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    if (!match) continue;

    const hours = Number(match[1] ?? 0);
    const minutes = Number(match[2] ?? 0);
    const seconds = Number(match[3] ?? 0);

    totalSeconds +=
      hours * 3600 +
      minutes * 60 +
      seconds;
  }

  return totalSeconds;
};

export const extractVideoId = (url: string) => {
  const parsedUrl = new URL(url);

  // youtube.com/watch?v=...
  if (parsedUrl.searchParams.has("v")) {
    return parsedUrl.searchParams.get("v");
  }

  // youtu.be/VIDEO_ID
  if (parsedUrl.hostname === "youtu.be") {
    return parsedUrl.pathname.slice(1);
  }

  // youtube.com/embed/VIDEO_ID
  if (parsedUrl.pathname.startsWith("/embed/")) {
    return parsedUrl.pathname.split("/")[2];
  }

  throw new BadRequestError("Invalid YouTube URL");
};

export const getVideoMetadata = async (videoId: string) => {
  return fetchYoutube<any>("videos", {
    part: "snippet,contentDetails",
    id: videoId,
  });
};

export const formatVideoMetadata = (data: any) => {
  const video = data.items[0];

  return {
    videoId: video.id,
    title: video.snippet.title,
    description: video.snippet.description,
    thumbnail:
      video.snippet.thumbnails.maxres?.url ||
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium?.url ||
      video.snippet.thumbnails.default?.url,
    channelName: video.snippet.channelTitle,
    duration: video.contentDetails.duration,
  };
};