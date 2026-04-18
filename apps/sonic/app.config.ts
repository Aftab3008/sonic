import type { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Sonic",
  slug: "sonic",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/resso-logo.png",
  scheme: "sonic",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.aftab3008.sonic",
    infoPlist: {
      UIBackgroundModes: ["audio"],
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#131313",
      foregroundImage: "./assets/resso-logo.png",
      backgroundImage: "./assets/resso-logo.png",
      monochromeImage: "./assets/resso-logo.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: "com.aftab3008.sonic",
    permissions: [
      "android.permission.FOREGROUND_SERVICE",
      "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK",
      "android.permission.WAKE_LOCK",
    ],
  },
  web: {
    output: "static",
    favicon: "./assets/resso-logo.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/resso-logo.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#131313",
      },
    ],
    [
      "expo-navigation-bar",
      {
        visibility: "hidden",
      },
    ],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission: "Allow Sonic to access your Face ID biometric data.",
      },
    ]
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    eas: {
      projectId: "138c1cc4-60f7-4220-a164-79318520c9d2",
    },
  },
  owner: "aftab3008",
});
