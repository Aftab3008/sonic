import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale, moderateScale, scale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { FC, memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  FadeIn,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { PerformanceTier } from "@/lib/performance";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

interface UnifiedPlayerHeaderProps {
  title?: string;
  volume: SharedValue<number>;
  topInset: number;
  onLongPress: () => void;
  onOptionsPress?: () => void;
  mountPhase?: number;
  performanceTier?: PerformanceTier;
}

export const UnifiedPlayerHeader: FC<UnifiedPlayerHeaderProps> = memo(
  ({
    title,
    volume,
    topInset,
    onLongPress,
    onOptionsPress,
    mountPhase = 0,
    performanceTier = "mid",
  }) => {
    const router = useRouter();
    const isShowingVol = useSharedValue(0);
    const scale = useSharedValue(1);

    const showBlur = mountPhase >= 1;
    const isLowEnd = performanceTier === "low";

    const animatedIconProps = useAnimatedProps(() => {
      let name: "volume-mute" | "volume-low" | "volume-medium" | "volume-high" =
        "volume-medium";
      if (volume.value === 0) name = "volume-mute";
      else if (volume.value < 0.4) name = "volume-low";
      else if (volume.value < 0.7) name = "volume-medium";
      else name = "volume-high";

      return { name };
    });

    const islandStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const hintStyle = useAnimatedStyle(() => ({
      opacity: isShowingVol.value,
      transform: [
        {
          translateX: isShowingVol.value ? 0 : moderateScale(10),
        },
      ],
    }));

    const titleStyle = useAnimatedStyle(() => ({
      opacity: withTiming(1 - isShowingVol.value),
      transform: [{ translateY: withTiming(isShowingVol.value ? -10 : 0) }],
    }));

    const volumeInfoStyle = useAnimatedStyle(() => ({
      opacity: withTiming(isShowingVol.value),
      transform: [{ translateY: withTiming(isShowingVol.value ? 0 : 10) }],
    }));

    const simpleTap = Gesture.Tap().onEnd(() => {
      isShowingVol.value = withTiming(1, { duration: 200 });
      setTimeout(() => {
        isShowingVol.value = withTiming(0, { duration: 300 });
      }, 2200);

      if (isLowEnd) {
        scheduleOnRN(Haptics.selectionAsync);
      } else {
        scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
      }
    });

    const springTap = Gesture.Tap().onEnd(() => {
      isShowingVol.value = withSequence(
        withTiming(1, { duration: 200 }),
        withDelay(2000, withTiming(0, { duration: 300 })),
      );
      scale.value = withSequence(
        withSpring(1.05, { damping: 10, stiffness: 100 }),
        withSpring(1.0, { damping: 10, stiffness: 100 }),
      );
      scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Light);
    });

    const longPress = Gesture.LongPress().onEnd(() => {
      scheduleOnRN(Haptics.impactAsync, Haptics.ImpactFeedbackStyle.Medium);
      scheduleOnRN(onLongPress);
    });

    const tapGesture = isLowEnd ? simpleTap : springTap;
    const centerGesture = Gesture.Exclusive(longPress, tapGesture);

    return (
      <View style={[styles.container, { paddingTop: topInset + 12 }]}>
        <Animated.View style={[styles.island, islandStyle]}>
          {showBlur && (
            <Animated.View
              style={StyleSheet.absoluteFillObject}
              entering={isLowEnd ? undefined : FadeIn.duration(300)}
            >
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    borderRadius: moderateScale(22),
                    overflow: "hidden",
                    backgroundColor: withAlpha(theme.colors.surface, 0.4),
                  },
                ]}
              />
            </Animated.View>
          )}
          <View style={styles.blur}>
            <TouchableOpacity
              style={styles.slot}
              onPress={() => router.back()}
              activeOpacity={0.6}
            >
              <Ionicons
                name="chevron-down"
                size={moderateScale(22)}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>

            <GestureDetector gesture={centerGesture}>
              <View style={styles.centerSlot}>
                <Animated.View style={[styles.contentAbsolute, titleStyle]}>
                  <Text style={styles.titleText} numberOfLines={1}>
                    {title || "Sonic Player"}
                  </Text>
                </Animated.View>
                <Animated.View
                  style={[styles.contentAbsolute, volumeInfoStyle]}
                >
                  <View style={styles.volumeRow}>
                    <AnimatedIonicons
                      name="volume-medium"
                      animatedProps={animatedIconProps}
                      size={moderateScale(14)}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.volumeText}>
                      {Math.round(volume.value * 100)}%
                    </Text>
                  </View>
                </Animated.View>
              </View>
            </GestureDetector>

            <TouchableOpacity
              style={styles.slot}
              onPress={onOptionsPress}
              activeOpacity={0.6}
            >
              <Ionicons
                name="ellipsis-horizontal"
                size={moderateScale(18)}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
          </View>

          {!isLowEnd && (
            <Animated.View style={[styles.hintContainer, hintStyle]}>
              <Ionicons
                name="chevron-back"
                size={moderateScale(12)}
                color={withAlpha(theme.colors.white, 0.5)}
              />
              <Text style={styles.hintText}>Long Press</Text>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
    zIndex: 100,
    paddingHorizontal: moderateScale(32),
  },
  island: {
    width: "100%",
    maxWidth: scale(500),
    height: verticalScale(44),
    borderRadius: moderateScale(22),
    overflow: "visible",
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.1),
    backgroundColor: withAlpha(theme.colors.surface, 0.4),
  },
  blur: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(22),
    overflow: "hidden",
  },
  slot: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
  },
  centerSlot: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  contentAbsolute: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  titleText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(11),
    fontFamily: theme.typography.headline,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: moderateScale(1.5),
  },
  volumeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
  },
  volumeText: {
    color: theme.colors.white,
    fontSize: moderateFontScale(14),
    fontFamily: theme.typography.headline,
    fontWeight: "800",
  },
  hintContainer: {
    position: "absolute",
    left: "100%",
    marginLeft: moderateScale(12),
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  hintText: {
    color: withAlpha(theme.colors.white, 0.6),
    fontSize: moderateFontScale(9),
    fontFamily: theme.typography.headline,
    fontWeight: "700",
    textTransform: "uppercase",
    marginLeft: moderateScale(4),
  },
});
