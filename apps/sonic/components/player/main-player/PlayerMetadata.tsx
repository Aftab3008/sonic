import { theme } from "@/constants/theme";
import { moderateFontScale, moderateScale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { FC, memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PlayerMetadataProps {
  title?: string;
  artist?: string;
}

export const PlayerMetadata: FC<PlayerMetadataProps> = memo(({
  title,
  artist,
}) => {
  return (
    <View style={styles.metadataRow}>
      <View style={styles.metadataText}>
        <Text
          allowFontScaling={true}
          maxFontSizeMultiplier={1.2}
          style={styles.trackTitle}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          allowFontScaling={true}
          maxFontSizeMultiplier={1.2}
          style={styles.trackArtist}
          numberOfLines={1}
        >
          {artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
        <Ionicons
          name="heart-outline"
          size={moderateScale(26)}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  metadataRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  metadataText: {
    alignItems: "center",
    paddingHorizontal: moderateScale(40),
  },
  trackTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(30),
    fontWeight: "900",
    color: theme.colors.onSurface,
    marginBottom: verticalScale(2),
    letterSpacing: -0.5,
    textAlign: "center",
  },
  trackArtist: {
    fontSize: moderateFontScale(17),
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
    textAlign: "center",
  },
  favoriteButton: {
    position: "absolute",
    right: 0,
    padding: moderateScale(4),
  },
});
