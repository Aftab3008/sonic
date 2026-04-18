import { authClient } from "@/lib/auth/auth-client";
import ky, { BeforeRequestHook } from "ky";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";

const authHook: BeforeRequestHook = async ({ request }) => {
  const cookie = authClient.getCookie();
  if (cookie) {
    request.headers.set("Cookie", cookie);
    return new Request(request, { credentials: "omit" });
  }
};

export const kyInstance = ky.create({
  prefix: `${API_URL}/api`,
  timeout: 10000,
  credentials: "include",
  hooks: {
    beforeRequest: [authHook],
  },
});


