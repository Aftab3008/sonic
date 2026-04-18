import { theme, withAlpha } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { Image, StyleSheet, View } from "react-native";

interface PlayerBackgroundProps {
  artwork?: string;
  bgColors: string[];
}

export const PlayerBackground: FC<PlayerBackgroundProps> = ({
  artwork,
  bgColors,
}) => {
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Image source={{ uri: artwork }} style={styles.bgImage} blurRadius={70} />
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
};

const styles = StyleSheet.create({
  bgImage: {
    width: "120%",
    height: "120%",
    top: "-10%",
    left: "-10%",
    opacity: 0.5,
  },
});
