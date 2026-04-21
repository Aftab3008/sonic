import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useCallback, memo } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Dimensions,
  Platform,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
  SharedValue,
  FadeIn,
} from "react-native-reanimated";
import { theme, withAlpha } from "../../constants/theme";
import { scale } from "../../lib/scaling";
import { ScreenWrapper } from "./ScreenWrapper";
import { usePerformanceTier } from "@/lib/performance";

const { width, height } = Dimensions.get("window");

interface PrismBackgroundProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  useScroll?: boolean;
}

const BLOB_COUNT = 3;

const blobColors = [
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
];

const ANIMATION_CONFIG = {
  duration: 15000,
  easing: Easing.inOut(Easing.sin),
};

const AnimatedBlob = memo(
  ({
    index,
    color,
    lowEndMode,
  }: {
    index: number;
    color: string;
    lowEndMode: boolean;
  }) => {
    const animX = useSharedValue(index * 0.3);
    const animY = useSharedValue(index * 0.2);
    const animScale = useSharedValue(0.5 + index * 0.1);

    useEffect(() => {
      if (lowEndMode) return;

      const duration = ANIMATION_CONFIG.duration + index * 2000;

      animX.value = withRepeat(
        withSequence(
          withTiming(1, { duration, easing: ANIMATION_CONFIG.easing }),
          withTiming(0, { duration, easing: ANIMATION_CONFIG.easing }),
        ),
        -1,
        true,
      );

      animY.value = withRepeat(
        withSequence(
          withTiming(1, { duration, easing: ANIMATION_CONFIG.easing }),
          withTiming(0, { duration, easing: ANIMATION_CONFIG.easing }),
        ),
        -1,
        true,
      );

      animScale.value = withRepeat(
        withSequence(
          withTiming(1, { duration, easing: ANIMATION_CONFIG.easing }),
          withTiming(0, { duration, easing: ANIMATION_CONFIG.easing }),
        ),
        -1,
        true,
      );
    }, [lowEndMode, index, animX, animY, animScale]);

    const blobStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              animX.value,
              [0, 1],
              [-width * 0.1, width * 0.6],
            ),
          },
          {
            translateY: interpolate(
              animY.value,
              [0, 1],
              [-height * 0.1, height * 0.6],
            ),
          },
          { scale: interpolate(animScale.value, [0, 1], [1, 2]) },
        ],
        opacity: lowEndMode
          ? 0.4
          : interpolate(animScale.value, [0, 1], [0.3, 0.5]),
      };
    }, [lowEndMode]);

    if (lowEndMode) {
      return (
        <View
          style={[
            styles.blob,
            {
              backgroundColor: color,
              left: width * (0.1 + index * 0.25),
              top: height * (0.1 + index * 0.15),
              opacity: 0.4,
              transform: [{ scale: 1.5 }],
            },
          ]}
        />
      );
    }

    return (
      <Animated.View
        entering={FadeIn.duration(1000).delay(index * 200)}
        style={[styles.blob, { backgroundColor: color }, blobStyle]}
      />
    );
  },
);

AnimatedBlob.displayName = "AnimatedBlob";

export function PrismBackground({
  children,
  style,
  contentContainerStyle,
  useScroll = true,
}: PrismBackgroundProps) {
  const performanceTier = usePerformanceTier();
  const lowEndMode = performanceTier === "low";
  const midTier = performanceTier === "mid";
  const effectiveBlobCount = lowEndMode ? 2 : midTier ? 3 : 3;

  return (
    <View style={[styles.container, style]}>
      <View style={StyleSheet.absoluteFill}>
        <View
          style={[StyleSheet.absoluteFill, { backgroundColor: "#050508" }]}
        />
        {blobColors.slice(0, effectiveBlobCount).map((color, i) => (
          <AnimatedBlob
            key={i}
            index={i}
            color={color}
            lowEndMode={lowEndMode}
          />
        ))}

        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: lowEndMode
                ? "rgba(5, 5, 8, 0.92)"
                : "rgba(5, 5, 8, 0.75)",
            },
          ]}
        />
        {!lowEndMode && !midTier && Platform.OS === "ios" && (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: "rgba(5, 5, 8, 0.2)" },
            ]}
          />
        )}

        <LinearGradient
          colors={["rgba(5, 5, 8, 0.7)", "transparent", "rgba(5, 5, 8, 0.85)"]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <ScreenWrapper
        useScroll={useScroll}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
        containerStyle={styles.wrapper}
      >
        {children}
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
  },
  blob: {
    position: "absolute",
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    ...(Platform.OS === "ios" && {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 40,
    }),
  },
});
