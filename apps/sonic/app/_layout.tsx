import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authClient } from "@/lib/auth/auth-client";

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export const unstable_settings = {
  initialRouteName: "(root)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  useEffect(() => {
    if (!isPending) {
      setAppIsReady(true);
    }
  }, [isPending]);

  useEffect(() => {
    if (!appIsReady) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const currentSegment = segments[0] as string | undefined;
    const onIndexSplash =
      currentSegment === undefined || currentSegment === "index";

    if (onIndexSplash) {
      SplashScreen.hideAsync();
      return;
    }

    if (!isPending && !session && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (!isPending && session && inAuthGroup) {
      router.replace("/(root)/(tabs)");
    }

    SplashScreen.hideAsync();
  }, [appIsReady, session, segments, router, isPending]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar hidden />
    </ThemeProvider>
  );
}
