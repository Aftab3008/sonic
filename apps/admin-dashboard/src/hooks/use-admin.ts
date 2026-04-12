import { kyInstance } from "@/providers/dataProvider";
import { HTTPError } from "ky";
import {
  useQuery,
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { adminKeys } from "@/lib/react-query/query-keys";
import type {
  ListUsersParams,
  ListUsersResponse,
  Session,
  BanUserPayload,
  UnbanUserPayload,
  RevokeSessionPayload,
  RevokeAllSessionsPayload,
  SetRolePayload,
  StandardResponse,
  User,
  DashboardStats,
} from "../types/admin.types";
import { toast } from "sonner";

async function getErrorMessage(
  error: unknown,
  defaultMsg: string,
): Promise<string> {
  if (error instanceof HTTPError) {
    try {
      const errorData = (await error.response.json()) as { message?: string };
      return errorData.message || defaultMsg;
    } catch {
      return defaultMsg;
    }
  }
  // Handle thrown response objects from mutations
  if (error && typeof error === "object" && "message" in error) {
    return String((error as any).message);
  }
  return error instanceof Error ? error.message : "An unknown error occurred";
}

export function useSuspenseListUsers(params: ListUsersParams) {
  return useSuspenseQuery({
    queryKey: adminKeys.userList(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.limit !== undefined)
        searchParams.set("limit", params.limit.toString());
      if (params.offset !== undefined)
        searchParams.set("offset", params.offset.toString());
      if (params.searchField)
        searchParams.set("searchField", params.searchField);
      if (params.searchValue)
        searchParams.set("searchValue", params.searchValue);
      if (params.sortBy) searchParams.set("sortBy", params.sortBy);
      if (params.sortDirection)
        searchParams.set("sortDirection", params.sortDirection);
      const res = await kyInstance
        .get("list-users", { searchParams })
        .json<StandardResponse<ListUsersResponse>>();
      return res.data;
    },
  });
}

export function useSuspenseUserSessions(userId: string) {
  return useSuspenseQuery({
    queryKey: adminKeys.userSessions(userId),
    queryFn: async () => {
      const res = await kyInstance
        .post("list-sessions", { json: { userId } })
        .json<StandardResponse<{ sessions: Session[] }>>();
      return res.data.sessions;
    },
  });
}

export function useBanUser() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: BanUserPayload) => {
      const res = await kyInstance
        .post("ban-user", { json: params })
        .json<StandardResponse<{ status: string }>>();

      if (!res.success) {
        throw res;
      }

      return res.data;
    },
    onSuccess: (_, params) => {
      toast.success("User banned successfully");
      qc.invalidateQueries({ queryKey: adminKeys.users() });
      qc.invalidateQueries({ queryKey: adminKeys.user(params.userId) });
    },
    onError: async (error) => {
      const message = await getErrorMessage(error, "Failed to ban user");
      toast.error(message);
    },
  });
}

export function useUnbanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: UnbanUserPayload) => {
      const res = await kyInstance
        .post("unban-user", { json: params })
        .json<StandardResponse<{ status: string }>>();

      if (!res.success) {
        throw res;
      }

      return res.data;
    },
    onSuccess: (_, params) => {
      toast.success("User unbanned successfully");
      qc.invalidateQueries({ queryKey: adminKeys.users() });
      qc.invalidateQueries({ queryKey: adminKeys.user(params.userId) });
    },
    onError: async (error) => {
      const message = await getErrorMessage(error, "Failed to unban user");
      toast.error(message);
    },
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: RevokeSessionPayload) => {
      const res = await kyInstance
        .post("revoke-session", { json: params })
        .json<StandardResponse<{ status: string }>>();

      if (!res.success) {
        throw res;
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("Session revoked successfully");
      qc.invalidateQueries({ queryKey: adminKeys.sessions() });
    },
    onError: async (error) => {
      const message = await getErrorMessage(error, "Failed to revoke session");
      toast.error(message);
    },
  });
}

export function useRevokeAllSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: RevokeAllSessionsPayload) => {
      const res = await kyInstance
        .post("revoke-all-sessions", { json: params })
        .json<StandardResponse<{ status: string }>>();

      if (!res.success) {
        throw res;
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success("All sessions revoked successfully");
      qc.invalidateQueries({ queryKey: adminKeys.sessions() });
    },
    onError: async (error) => {
      const message = await getErrorMessage(
        error,
        "Failed to revoke all sessions",
      );
      toast.error(message);
    },
  });
}

export function useSetRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: SetRolePayload) => {
      const res = await kyInstance
        .post("set-role", { json: params })
        .json<StandardResponse<{ status: string }>>();

      if (!res.success) {
        throw res;
      }

      return res.data;
    },
    onSuccess: (_, params) => {
      toast.success("User role updated successfully");
      qc.invalidateQueries({ queryKey: adminKeys.users() });
      qc.invalidateQueries({ queryKey: adminKeys.user(params.userId) });
    },
    onError: async (error) => {
      const message = await getErrorMessage(error, "Failed to set user role");
      toast.error(message);
    },
  });
}

export function useSuspenseUser(userId: string) {
  return useSuspenseQuery({
    queryKey: adminKeys.user(userId),
    queryFn: async () => {
      const res = await kyInstance
        .get(`user/${userId}`)
        .json<StandardResponse<User[]>>();
      return res.data[0];
    },
  });
}

export function useSuspenseDashboardStats() {
  return useSuspenseQuery({
    queryKey: adminKeys.stats(),
    queryFn: async () => {
      const res = await kyInstance
        .get("stats")
        .json<StandardResponse<DashboardStats>>();
      return res.data;
    },
  });
}
