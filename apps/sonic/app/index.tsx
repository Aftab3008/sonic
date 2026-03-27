import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Animated, Easing } from "react-native";
import { theme } from "../constants/theme";
import { ScreenWrapper } from "../components/ui/ScreenWrapper";
import { ASSETS } from "@/constants/assets";
import { authClient } from "@/lib/auth/auth-client";

export default function SplashScreen() {
  const router = useRouter();

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const outerPulseAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(outerPulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(outerPulseAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 2800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pulseAnim, outerPulseAnim, progressAnim, fadeIn]);

  useEffect(() => {
    if (minTimeElapsed && !isPending) {
      if (session) {
        router.replace("/(root)/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [minTimeElapsed, isPending, session, router]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  const innerGlowScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.3, 1.6],
  });

  const outerGlowScale = outerPulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1.8, 2.2],
  });

  return (
    <ScreenWrapper>
      <Animated.View style={[styles.container, { opacity: fadeIn }]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircleWrapper}>
            {/* Outer glow ring */}
            <Animated.View
              style={[
                styles.outerGlow,
                {
                  opacity: outerPulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.04, 0.08],
                  }),
                  transform: [{ scale: outerGlowScale }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.glowBehind,
                {
                  opacity: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.08, 0.18],
                  }),
                  transform: [{ scale: innerGlowScale }],
                },
              ]}
            />
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={[
                  "rgba(124, 58, 237, 0.15)",
                  "rgba(103, 232, 249, 0.08)",
                ]}
                style={styles.logoGradient}
              >
                <Image
                  source={ASSETS.appLogo}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </LinearGradient>
            </View>
          </View>

          <Text style={styles.title}>SONIC</Text>
          <View style={styles.subtitleContainer}>
            <View style={styles.subtitleLine} />
            <Text style={styles.subtitle}>EXPERIENCE THE WORLD OF MUSIC</Text>
            <View style={styles.subtitleLine} />
          </View>
        </View>

        <View style={styles.loadingContainer}>
          <View style={styles.progressBarBg}>
            <Animated.View style={[styles.progressBarFill, { width: progressWidth }]}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>
          </View>
          <Text style={styles.loadingText}>ENTERING THE SONIC PRISM</Text>
        </View>
      </Animated.View>
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
    width: 200,
    height: 200,
  },
  outerGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: theme.colors.secondary,
  },
  glowBehind: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: theme.colors.primaryContainer,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(196, 181, 253, 0.12)",
  },
  logoGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    marginTop: 28,
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 8,
    color: "#FFFFFF",
    fontFamily: theme.typography.headline,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  subtitleLine: {
    width: 20,
    height: 1,
    backgroundColor: theme.colors.outlineVariant,
    opacity: 0.5,
  },
  subtitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.7,
  },
  loadingContainer: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 48,
  },
  progressBarBg: {
    width: "100%",
    maxWidth: 240,
    height: 3,
    backgroundColor: theme.colors.outlineVariant + "30",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
    overflow: "hidden",
  },
  loadingText: {
    marginTop: 20,
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2.5,
    color: theme.colors.onSurfaceVariant,
    opacity: 0.5,
  },
});
