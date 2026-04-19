import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale, moderateScale, verticalScale } from "@/lib/scaling";
import { formatTime } from "@/utils/utils";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { FC, memo, useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { ReText } from "react-native-redash";
import TrackPlayer from "react-native-track-player";

interface PlayerProgressProps {
  position: number;
  duration: number;
}

export const PlayerProgress: FC<PlayerProgressProps> = memo(({
  position,
  duration,
}) => {
  const isSliding = useSharedValue(false);
  const isSeeking = useRef(false);

  const progress = useSharedValue(0);
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  useEffect(() => {
    if (duration > 0) max.value = duration;
  }, [duration, max]);

  useEffect(() => {
    if (!isSliding.value && !isSeeking.current && duration > 0) {
      progress.value = position;
    }
  }, [position, duration, progress, isSliding]);

  const onSlidingStart = useCallback(() => {
    isSliding.value = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isSliding]);

  const onSeekEnd = useCallback(async (value: number) => {
    isSeeking.current = true;
    await TrackPlayer.seekTo(value);
    setTimeout(() => {
      isSeeking.current = false;
      isSliding.value = false;
    }, 500);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [isSliding]);

  const timeLabel = useDerivedValue(() => {
    return formatTime(progress.value);
  });

  const onTap = useCallback(() => {
    Haptics.selectionAsync();
  }, []);

  return (
    <View style={styles.seekerContainer}>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSeekEnd}
        thumbWidth={moderateScale(20)}
        sliderHeight={verticalScale(6)}
        theme={{
          minimumTrackTintColor: theme.colors.primary,
          maximumTrackTintColor: withAlpha(theme.colors.onSurface, 0.1),
          bubbleBackgroundColor: theme.colors.surfaceContainerHigh,
          bubbleTextColor: theme.colors.onSurface,
        }}
        renderThumb={() => <View style={styles.thumb} />}
        renderContainer={({ style, seekStyle }) => (
          <View
            style={[
              style,
              {
                borderRadius: moderateScale(4),
                backgroundColor: withAlpha(theme.colors.onSurface, 0.1),
              },
            ]}
          >
            <Animated.View
              style={[seekStyle, { borderRadius: moderateScale(4) }]}
            >
              <LinearGradient
                colors={[theme.colors.primaryContainer, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        )}
        onTap={onTap}
        bubble={formatTime}
      />

      <View style={styles.timeRow}>
        <ReText text={timeLabel} style={styles.timeText} />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  seekerContainer: {
    width: "100%",
  },
  sliderContainer: {
    height: verticalScale(6),
    borderRadius: moderateScale(4),
  },
  thumb: {
    width: moderateScale(14),
    height: moderateScale(14),
    borderRadius: moderateScale(7),
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: verticalScale(12),
  },
  timeText: {
    fontSize: moderateFontScale(12),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    opacity: 0.7,
  },
});
