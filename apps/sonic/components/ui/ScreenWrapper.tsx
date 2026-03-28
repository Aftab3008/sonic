import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { scale } from "../../lib/scaling";

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
    top: scale(-80),
    left: scale(-80),
    width: scale(300),
    height: scale(300),
    borderRadius: scale(150),
    backgroundColor: theme.colors.primaryContainer,
    opacity: 0.06,
    transform: [{ scale: 1.8 }],
  },
  glowBottomRight: {
    position: "absolute",
    bottom: scale(-60),
    right: scale(-60),
    width: scale(250),
    height: scale(250),
    borderRadius: scale(125),
    backgroundColor: theme.colors.secondaryContainer,
    opacity: 0.05,
    transform: [{ scale: 1.6 }],
  },
  glowCenter: {
    position: "absolute",
    top: "40%",
    left: "30%",
    width: scale(200),
    height: scale(200),
    borderRadius: scale(100),
    backgroundColor: theme.colors.primary,
    opacity: 0.02,
    transform: [{ scale: 2 }],
  },
});
