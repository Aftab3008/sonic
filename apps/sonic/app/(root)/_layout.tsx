import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="player/index"
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen name="account/index" />
      <Stack.Screen
        name="account/personal-info"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/privacy"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/audio-quality"
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="account/theme"
        options={{
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}
