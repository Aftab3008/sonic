import { authClient } from "@/lib/auth/auth-client";
import ky from "ky";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

export const kyInstance = ky.create({
  prefix: `${API_URL}/api`,
  timeout: 10000,
  credentials: "include",
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        const cookie = authClient.getCookie();
        if (cookie) {
          request.headers.set("Cookie", cookie);
          return new Request(request, { credentials: "omit" });
        }
      },
    ],
  },
});
