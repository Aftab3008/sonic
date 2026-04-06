import type { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth/auth-client";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: {
            name: "LoginError",
            message: error.message || "Invalid email or password",
          },
        };
      }

      if (data?.user?.role !== "admin") {
        await authClient.signOut();
        return {
          success: false,
          error: {
            name: "LoginError",
            message: "Access denied. Admin privileges required.",
          },
        };
      }

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err: any) {
      return {
        success: false,
        error: {
          name: "LoginError",
          message: err.message || "An unexpected error occurred",
        },
      };
    }
  },

  logout: async () => {
    try {
      await authClient.signOut();
    } catch {
      // ignore logout errors
    }
    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.session && data?.user?.role === "admin") {
        return { authenticated: true };
      }
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    } catch {
      return {
        authenticated: false,
        redirectTo: "/login",
      };
    }
  },

  getPermissions: async () => {
    try {
      const { data } = await authClient.getSession();
      return data?.user?.role ?? null;
    } catch {
      return null;
    }
  },

  getIdentity: async () => {
    try {
      const { data } = await authClient.getSession();
      if (data?.user) {
        return {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          avatar: data.user.image,
        };
      }
      return null;
    } catch {
      return null;
    }
  },

  onError: async (error) => {
    if (error?.statusCode === 401 || error?.statusCode === 403) {
      return {
        logout: true,
        redirectTo: "/login",
        error,
      };
    }
    return { error };
  },
};
