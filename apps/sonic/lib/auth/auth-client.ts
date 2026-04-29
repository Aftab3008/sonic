import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { ServerAuthType } from "../../../backend/src/auth/auth.provider";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  plugins: [
    expoClient({
      scheme: "sonic",
      storagePrefix: "sonic",
      storage: SecureStore,
    }),
    inferAdditionalFields<ServerAuthType>(),
  ],
});
