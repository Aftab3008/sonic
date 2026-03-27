import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../../constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

interface ScreenWrapperProps {
  children: React.ReactNode;
  useScroll?: boolean;
  backgroundColors?: [string, string, ...string[]];
  containerStyle?: object;
  contentContainerStyle?: object;
}

export function ScreenWrapper({
  children,
  useScroll = false,
  backgroundColors = [
    theme.colors.surfaceContainerLowest,
    theme.colors.surface,
    theme.colors.surfaceContainerLowest,
  ],
  containerStyle,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const Container = useScroll ? ScrollView : View;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={backgroundColors}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      {/* Ambient glow - top left (primary) */}
      <View style={styles.glowTopLeft} />
      {/* Ambient glow - bottom right (secondary) */}
      <View style={styles.glowBottomRight} />
      {/* Ambient glow - center subtle (primary faint) */}
      <View style={styles.glowCenter} />

      <Container
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
          containerStyle,
        ]}
        contentContainerStyle={
          useScroll
            ? [styles.scrollContent, contentContainerStyle]
            : contentContainerStyle
        }
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  glowTopLeft: {
    position: "absolute",
    top: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.colors.primaryContainer,
    opacity: 0.06,
    transform: [{ scale: 1.8 }],
  },
  glowBottomRight: {
    position: "absolute",
    bottom: -60,
    right: -60,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: theme.colors.secondaryContainer,
    opacity: 0.05,
    transform: [{ scale: 1.6 }],
  },
  glowCenter: {
    position: "absolute",
    top: "40%",
    left: "30%",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    opacity: 0.02,
    transform: [{ scale: 2 }],
  },
});
