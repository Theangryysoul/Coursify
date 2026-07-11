export interface PreviewVideo {
  videoId: string;
  title: string;
  thumbnail: string;
  duration: string;
  position: number;
}

export interface YoutubePreviewData {
  title: string;
  description: string;
 thumbnail: string;
  channelName: string;
  playlistId?: string;
  videoCount: number;
  videos?: PreviewVideo[];
}

export interface YoutubePreviewResponse {
  type: "playlist" | "single-video";
  data: YoutubePreviewData;
}

export interface ImportedCourse {
  _id: string;
}