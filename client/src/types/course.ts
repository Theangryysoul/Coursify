export interface CourseItem {
  _id: string;

  favorite: boolean;
  pinned: boolean;
  archived: boolean;
  status: string;

  // Which folder the course is filed under, or null for "Uncategorised".
  folder: string | null;

  progress: {
  percentage: number;
  watchedDuration: number;
  totalDuration: number;
  completedVideos: number;
};

  course: {
    _id: string;
    title: string;
    thumbnail: string;
    totalVideos: number;
    completedVideos: number;
  };
}
