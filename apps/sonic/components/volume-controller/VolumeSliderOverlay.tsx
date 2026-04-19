import { theme, withAlpha } from "@/constants/theme";
import { moderateScale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { Slider } from "react-native-awesome-slider";
import Animated, {
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const SLIDER_HEIGHT = verticalScale(320);
const SLIDER_WIDTH = moderateScale(100);

interface VolumeSliderOverlayProps {
  volume: SharedValue<number>;
  isVisible: boolean;
  onVolumeChange: (val: number) => void;
  onClose: () => void;
}

export const VolumeSliderOverlay: FC<VolumeSliderOverlayProps> = ({
  volume,
  isVisible,
  onVolumeChange,
  onClose,
}) => {
  const min = useSharedValue(0);
  const max = useSharedValue(1);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isVisible ? 1 : 0),
  }));

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isVisible ? 1 : 0.8) }],
  }));

  const animatedIconProps = useAnimatedProps(() => {
    let name: "volume-mute" | "volume-low" | "volume-medium" | "volume-high" =
      "volume-medium";
    if (volume.value > 0.5) name = "volume-high";
    else if (volume.value > 0.1) name = "volume-medium";
    else if (volume.value > 0) name = "volume-low";
    else name = "volume-mute";

    return {
      name,
    };
  });

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents={isVisible ? "auto" : "none"}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={StyleSheet.absoluteFill}>
          <BlurView
            intensity={60}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        </View>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sliderWrapper, sliderStyle]}>
        <View style={styles.sliderContainer}>
          <Slider
            progress={volume}
            minimumValue={min}
            maximumValue={max}
            onValueChange={(val) => {
              scheduleOnRN(onVolumeChange, val);
              if (Math.round(val * 100) % 5 === 0) {
                Haptics.selectionAsync();
              }
            }}
            renderBubble={() => null}
            thumbWidth={0}
            sliderHeight={SLIDER_WIDTH}
            style={styles.awesomeSlider}
            containerStyle={styles.sliderTrack}
            renderContainer={({ style, seekStyle }) => (
              <View
                style={[
                  style,
                  {
                    backgroundColor: withAlpha(theme.colors.white, 0.1),
                    borderRadius: moderateScale(35),
                  },
                ]}
              >
                <Animated.View
                  style={[seekStyle, { borderRadius: moderateScale(35) }]}
                >
                  <LinearGradient
                    colors={[
                      theme.colors.primary,
                      theme.colors.primaryContainer,
                    ]}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>
              </View>
            )}
          />
        </View>
        <View style={styles.iconOverlay}>
          <AnimatedIonicons
            name="volume-medium"
            animatedProps={animatedIconProps}
            size={moderateScale(32)}
            color={withAlpha(theme.colors.white, 0.4)}
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2000,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sliderWrapper: {
    width: SLIDER_WIDTH,
    height: SLIDER_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  sliderContainer: {
    width: SLIDER_HEIGHT,
    height: SLIDER_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ rotate: "-90deg" }],
  },
  awesomeSlider: {
    width: SLIDER_HEIGHT,
    height: SLIDER_WIDTH,
  },
  sliderTrack: {
    borderRadius: moderateScale(35),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.2),
  },
  iconOverlay: {
    position: "absolute",
    bottom: verticalScale(20),
    width: "100%",
    alignItems: "center",
    pointerEvents: "none",
  },
});
