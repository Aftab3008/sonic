import { theme } from "@/constants/theme";
import { moderateFontScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PlayerMetadataProps {
  title?: string;
  artist?: string;
}

export const PlayerMetadata: FC<PlayerMetadataProps> = ({ title, artist }) => {
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
          size={28}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
    width: "100%",
  },
  metadataText: {
    flex: 1,
    paddingRight: 16,
  },
  trackTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(28),
    fontWeight: "800",
    color: theme.colors.onSurface,
    marginBottom: 6,
    letterSpacing: -1,
  },
  trackArtist: {
    fontSize: moderateFontScale(16),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
  },
  favoriteButton: {
    marginBottom: 6,
  },
});
