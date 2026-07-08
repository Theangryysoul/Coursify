import axios from "axios";
import { env } from "../config/env.js";
import Course from "../models/course.model.js";
import Video from "../models/video.model.js";
import UserCourse from "../models/userCourse.model.js";

export const detectYoutubeUrlType = (url: string) => {
  const parsedUrl = new URL(url);

  if (parsedUrl.searchParams.has("list")) {
    return "playlist";
  }

  if (parsedUrl.searchParams.has("v")) {
    return "single-video";
  }

  throw new Error("Invalid YouTube URL");
};

export const extractPlaylistId = (url: string) => {
  const parsedUrl = new URL(url);

  return parsedUrl.searchParams.get("list");
};

export const getPlaylistMetadata = async (playlistId: string) => {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/playlists",
    {
      params: {
        part: "snippet,contentDetails",
        id: playlistId,
        key: env.YOUTUBE_API_KEY,
      },
    }
  );

  return response.data;
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
    const response = await axios.get<PlaylistItemsResponse>(
      "https://www.googleapis.com/youtube/v3/playlistItems",
      {
        params: {
          part: "snippet,contentDetails",
          playlistId,
          maxResults: 50,
          pageToken: nextPageToken,
          key: env.YOUTUBE_API_KEY,
        },
      }
    );

    allVideos.push(...response.data.items);
    nextPageToken = response.data.nextPageToken;
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

      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "contentDetails",
            id: chunk.join(","),
            key: env.YOUTUBE_API_KEY,
          },
        }
      );

      allItems.push(...response.data.items);
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

  if (type !== "playlist") {
    throw new Error("Only playlist import is supported currently.");
  }

  const playlistId = extractPlaylistId(url)!;

  let course = await Course.findOne({
    playlistId,
  });

  // Existing Course
  if (course) {
    const existingUserCourse = await UserCourse.findOne({
      owner: userId,
      course: course._id,
    });

    if (existingUserCourse) {
      throw new Error("Course already exists in your library.");
    }

    const userCourse = await UserCourse.create({
      owner: userId,
      course: course._id,
    });

    return userCourse;
  }

  // New Course
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
  );

    course = await Course.create({
    type: "playlist",
    title: metadata.title,
    description: metadata.description,
    thumbnail: metadata.thumbnail,
    channelName: metadata.channelName,
    playlistId: metadata.playlistId,
    playlistUrl: url,
    videoCount: metadata.videoCount,
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

  const userCourse = await UserCourse.create({
    owner: userId,
    course: course._id,
  });

  return userCourse;
};

export const calculateTotalDuration = (videos: { duration: string }[]) => {
  let totalSeconds = 0;

  for (const video of videos) {
    const match = video.duration.match(
      /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
    );

    if (!match) continue;

    const hours = Number(match[1] || 0);
    const minutes = Number(match[2] || 0);
    const seconds = Number(match[3] || 0);

    totalSeconds += hours * 3600 + minutes * 60 + seconds;
  }

  return totalSeconds;
};