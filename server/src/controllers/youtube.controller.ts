import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/api-response.js";
import {
  detectYoutubeUrlType,
  extractPlaylistId,
  getPlaylistMetadata,
  formatPlaylistMetadata,
  getPlaylistVideos,
  formatPlaylistVideos,
  getVideoDetails,
  mergeVideoDetails,
  calculateTotalDuration,
  importCourse
} from "../services/youtube.service.js";

export const previewYoutubeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { url } = req.body;
    const type = detectYoutubeUrlType(url);

    let data = null;

    if (type === "playlist") {
      const playlistId = extractPlaylistId(url)!;

      const rawMetadata = await getPlaylistMetadata(playlistId);
      const rawVideos = await getPlaylistVideos(playlistId);

      type PlaylistVideo = {
        videoId: string;
        title: string;
        thumbnail: string;
        position: number;
        };

      const videos: PlaylistVideo[] = formatPlaylistVideos(rawVideos);

      const details = await getVideoDetails(
        videos.map((v) => v.videoId)
      );

      const completeVideos = mergeVideoDetails(videos, details);

      data = {
        ...formatPlaylistMetadata(rawMetadata),
        videos: completeVideos,
      };
    }

    return successResponse(
      res,
      "Preview fetched successfully",
      {
        type,
        data,
      }
    );
  }
);

export const importYoutubeController = asyncHandler(
  async (req: Request, res: Response) => {
    const { url } = req.body;

    const userCourse = await importCourse(
      req.user.userId,
      url
    );

    return successResponse(
      res,
      "Course imported successfully",
      userCourse
    );
  }
);