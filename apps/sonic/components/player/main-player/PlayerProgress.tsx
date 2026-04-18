import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale } from "@/lib/scaling";
import { formatTime } from "@/utils/utils";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import Animated, { useDerivedValue, useSharedValue } from "react-native-reanimated";
import TrackPlayer from "react-native-track-player";
import { ReText } from "react-native-redash";

interface PlayerProgressProps {
  position: number;
  duration: number;
}

export const PlayerProgress: FC<PlayerProgressProps> = ({
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
  }, [duration]);

  useEffect(() => {
    if (!isSliding.value && !isSeeking.current && duration > 0) {
      progress.value = position;
    }
  }, [position, duration]);

  const onSlidingStart = () => {
    isSliding.value = true;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const onSeekEnd = async (value: number) => {
    isSeeking.current = true;
    await TrackPlayer.seekTo(value);
    setTimeout(() => {
      isSeeking.current = false;
      isSliding.value = false;
    }, 500);

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const timeLabel = useDerivedValue(() => {
    return formatTime(progress.value);
  });

  return (
    <View style={styles.seekerContainer}>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onSlidingStart={onSlidingStart}
        onSlidingComplete={onSeekEnd}
        thumbWidth={20}
        sliderHeight={6}
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
                borderRadius: 4,
                backgroundColor: withAlpha(theme.colors.onSurface, 0.1),
              },
            ]}
          >
            <Animated.View style={[seekStyle, { borderRadius: 4 }]}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>
        )}
        onTap={() => Haptics.selectionAsync()}
      />

      <View style={styles.timeRow}>
        <ReText text={timeLabel} style={styles.timeText} />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seekerContainer: {
    marginBottom: 36,
    width: "100%",
  },
  sliderContainer: {
    height: 6,
    borderRadius: 4,
  },
  thumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  timeText: {
    fontSize: moderateFontScale(12),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    opacity: 0.7,
  },
});
