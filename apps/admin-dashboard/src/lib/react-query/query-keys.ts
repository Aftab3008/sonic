export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  userList: (filters: Record<string, any>) =>
    [...adminKeys.users(), "list", filters] as const,
  sessions: () => [...adminKeys.all, "sessions"] as const,
  userSessions: (userId: string) => [...adminKeys.sessions(), userId] as const,
  user: (userId: string) => [...adminKeys.all, "user", userId] as const,
  stats: () => [...adminKeys.all, "stats"] as const,
};

export const artistKeys = {
  all: ["artists"] as const,
  details: (artistId: string) =>
    [...artistKeys.all, "details", artistId] as const,
  list: (search?: string) => [...artistKeys.all, "list", search || ""] as const,
  lists: () => [...artistKeys.all, "list"] as const,
};

export const albumKeys = {
  all: ["album"] as const,
  details: (albumId: string) => [...albumKeys.all, "details", albumId] as const,
  list: (search?: string) => [...albumKeys.all, "list", search || ""] as const,
  lists: () => [...albumKeys.all, "list"] as const,
  artists: (albumId: string) => [...albumKeys.all, "artists", albumId] as const,
};

export const recordingKeys = {
  all: ["recordings"] as const,
  allList: () => [...recordingKeys.all, "all"] as const,
  details: (recordingId: string) =>
    [...recordingKeys.all, "details", recordingId] as const,
  list: (search?: string) =>
    [...recordingKeys.all, "list", search || ""] as const,
  search: (query: string) => [...recordingKeys.all, "search", query] as const,
  lists: () => [...recordingKeys.all, "list"] as const,
};

export const genreKeys = {
  all: ["genres"] as const,
  lists: () => [...genreKeys.all, "list"] as const,
  details: (genreId: string) => [...genreKeys.all, "details", genreId] as const,
};

export const uploadKeys = {
  all: ["upload"] as const,
  presignedUrl: (type: string, id: string) =>
    [...uploadKeys.all, type, id] as const,
};

export const trackKeys = {
  all: ["tracks"] as const,
  details: (trackId: string) => [...trackKeys.all, "details", trackId] as const,
  list: (search?: string) => [...trackKeys.all, "list", search || ""] as const,
  lists: () => [...trackKeys.all, "list"] as const,
};
