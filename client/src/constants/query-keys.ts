export const QUERY_KEYS = {
  CURRENT_USER: ["current-user"],

  COURSES: ["courses"],

  COURSE: (id: string) => ["course", id],

  PLAYLISTS: ["playlists"],

  PROFILE: ["profile"],
} as const;

queryKey: QUERY_KEYS.CURRENT_USER