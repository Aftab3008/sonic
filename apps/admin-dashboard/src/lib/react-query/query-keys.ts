export const adminKeys = {
  all: ["admin"] as const,
  users: () => [...adminKeys.all, "users"] as const,
  userList: (filters: Record<string, any>) =>
    [...adminKeys.users(), "list", filters] as const,
  sessions: () => [...adminKeys.all, "sessions"] as const,
  userSessions: (userId: string) => [...adminKeys.sessions(), userId] as const,
  user: (userId: string) => [...adminKeys.all, "user", userId] as const,
};
