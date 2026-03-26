import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import { theme } from "../constants/theme";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { ASSETS } from "@/constants/assets";

export default function SplashScreen() {
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      router.replace("/(auth)/login" as any);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pulseAnim, progressAnim, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircleWrapper}>
            <Animated.View
              style={[styles.glowBehind, { opacity: pulseAnim }]}
            />
            <LinearGradient
              colors={["rgba(208,188,255,0.1)", "rgba(76,215,246,0.1)"]}
              style={styles.logoCircle}
            >
              <Image
                source={ASSETS.appLogo}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          <Text style={styles.title}>SONIC</Text>
          <Text style={styles.subtitle}>EXPERIENCE THE WORLD OF MUSIC</Text>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.glassLoader}>
            <View style={styles.progressBarBg}>
              <Animated.View
                style={[styles.progressBar, { width: progressWidth }]}
              />
            </View>
          </View>
          <Text style={styles.loadingText}>ENTERING THE WORLD OF MUSIC</Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    zIndex: 10,
  },
  logoCircleWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  glowBehind: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.primary,
    opacity: 0.2,
    transform: [{ scale: 1.5 }],
    filter: "blur(30px)",
  },
  logoCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  title: {
    marginTop: 24,
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: 6,
    color: "#ffffff",
    textShadowColor: "rgba(139, 92, 246, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    fontFamily: theme.typography.headline,
  },
  subtitle: {
    marginTop: 32,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2.5,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.6,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  glassLoader: {
    width: "100%",
    maxWidth: 280,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(53, 53, 52, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.15)", // outline-variant with opacity
    paddingHorizontal: 24,
  },
  progressBarBg: {
    width: "100%",
    height: 2,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: 2,
    backgroundColor: theme.colors.primary,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  loadingText: {
    marginTop: 24,
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    color: theme.colors.onSurfaceVariant,
  },
});
