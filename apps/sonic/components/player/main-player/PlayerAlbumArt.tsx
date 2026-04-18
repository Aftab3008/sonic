import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { FC } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface PlayerAlbumArtProps {
  artwork?: string;
}

export const PlayerAlbumArt: FC<PlayerAlbumArtProps> = ({ artwork }) => {
  return (
    <View style={styles.albumArtContainer}>
      <Image source={{ uri: artwork }} style={styles.albumArt} />
      <BlurView intensity={60} tint="dark" style={styles.hiResBadge}>
        <Ionicons name="aperture" size={12} color={theme.colors.secondary} />
        <Text
          allowFontScaling={true}
          maxFontSizeMultiplier={1.2}
          style={styles.hiResText}
        >
          HI-RES
        </Text>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  albumArtContainer: {
    width: "90%",
    aspectRatio: 1,
    position: "relative",
    marginBottom: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  hiResBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(theme.colors.white, 0.2),
  },
  hiResText: {
    fontSize: moderateFontScale(10),
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: 1.5,
  },
});
