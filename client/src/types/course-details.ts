import type { CourseItem } from "./course";

export interface Video {
  _id: string;
  videoId: string;
  youtubeUrl: string;
  title: string;
  thumbnail: string;
  duration: string;
  position: number;

  completed: boolean;
  currentTime: number;
}

export interface CourseDetails {
  userCourse: CourseItem;
  progress: number;
  videos: Video[];

  resume: {
    videoId: string;
    currentTime: number;
  } | null;
}