export interface CourseItem {
  _id: string;

  favorite: boolean;
  pinned: boolean;
  archived: boolean;
  status: string;

  progress: {
  percentage: number;
  watchedDuration: number;
  totalDuration: number;
};

  course: {
    _id: string;
    title: string;
    thumbnail: string;
    totalVideos: number;
    completedVideos: number;
  };
}