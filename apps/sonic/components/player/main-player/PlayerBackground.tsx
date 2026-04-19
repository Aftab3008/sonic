import { theme, withAlpha } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { FC, memo } from "react";
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeIn } from "react-native-reanimated";

interface PlayerBackgroundProps {
  artwork?: string;
  bgColors: string[];
  mountPhase?: number;
}

export const PlayerBackground: FC<PlayerBackgroundProps> = memo(({
  artwork,
  bgColors,
  mountPhase = 0,
}) => {
  const showBlurredImage = mountPhase >= 1;

  return (
    <View style={StyleSheet.absoluteFillObject}>
      {showBlurredImage && artwork && (
        <Animated.View style={StyleSheet.absoluteFillObject} entering={FadeIn.duration(300)}>
          <Image
            source={{ uri: artwork }}
            style={styles.bgImage}
            blurRadius={70}
            contentFit="cover"
            cachePolicy="memory-disk"
          />
        </Animated.View>
      )}
      <LinearGradient
        colors={[
          withAlpha(bgColors[0], 0.4),
          withAlpha(bgColors[1], 0.8),
          withAlpha(theme.colors.background, 0.98),
        ]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  bgImage: {
    width: "120%",
    height: "120%",
    top: "-10%",
    left: "-10%",
    opacity: 0.5,
  },
});
