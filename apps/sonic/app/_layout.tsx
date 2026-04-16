import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import {
  Stack,
  useNavigationContainerRef,
  useRouter,
  useSegments,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { authClient } from "@/lib/auth/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

SplashScreen.setOptions({
  duration: 400,
  fade: true,
});

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const segments = useSegments();
  const router = useRouter();
  const navigationRef = useNavigationContainerRef();

  const { data: session, isPending } = authClient.useSession();

  const [appIsReady, setAppIsReady] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  useEffect(() => {
    if (navigationRef?.current) {
      setNavigationReady(true);
    }
  }, [navigationRef?.current]);

  useEffect(() => {
    if (!isPending) {
      setAppIsReady(true);
    }
  }, [isPending]);

  useEffect(() => {
    if (!appIsReady || !navigationReady) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inRootGroup = segments[0] === "(root)";

    if (session) {
      if (!inRootGroup) {
        router.replace("/(root)/(tabs)");
      }
    } else {
      if (!inAuthGroup) {
        router.replace("/(auth)/login");
      }
    }

    SplashScreen.hideAsync();
  }, [appIsReady, navigationReady, session, segments, router]);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
