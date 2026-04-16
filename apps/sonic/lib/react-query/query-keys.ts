export const albumKeys = {
  all: ["albums"] as const,
  lists: () => [...albumKeys.all, "list"] as const,
  list: (filters: string) => [...albumKeys.lists(), { filters }] as const,
  details: () => [...albumKeys.all, "detail"] as const,
  detail: (id: string) => [...albumKeys.details(), id] as const,
};

export const trackKeys = {
  all: ["tracks"] as const,
  lists: () => [...trackKeys.all, "list"] as const,
  list: (filters: string) => [...trackKeys.lists(), { filters }] as const,
  details: () => [...trackKeys.all, "detail"] as const,
  detail: (id: string) => [...trackKeys.details(), id] as const,
};
