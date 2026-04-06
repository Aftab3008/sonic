/**
 * React-Query key factory for content resources (albums, artists, genres, tracks).
 * Follows the factory pattern for precise cache invalidation.
 */
export const contentKeys = {
  all: ["content"] as const,

  lists: () => [...contentKeys.all, "list"] as const,
  list: (resource: string, params: Record<string, unknown>) =>
    [...contentKeys.lists(), resource, params] as const,

  details: () => [...contentKeys.all, "detail"] as const,
  detail: (resource: string, id: string) =>
    [...contentKeys.details(), resource, id] as const,
};
