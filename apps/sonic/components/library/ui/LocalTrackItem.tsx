import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FC, memo, useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/constants/theme";
import { scale, verticalScale, moderateFontScale } from "@/lib/scaling";
import type { LocalTrackMetadata } from "@/lib/player/local-metadata";
import { formatTime } from "@/utils/utils";

import type { Asset } from "expo-media-library";

export interface LocalTrackItemProps {
  item: Asset;
  metadata?: LocalTrackMetadata | null;
  onPress: (asset: Asset, metadata: LocalTrackMetadata | null) => void;
}

const LocalTrackItem: FC<LocalTrackItemProps> = ({
  item,
  metadata,
  onPress,
}) => {
  const { filename, duration } = item;
  const handlePress = useCallback(() => {
    onPress(item, metadata || null);
  }, [item, metadata, onPress]);

  const displayTitle = metadata?.title ?? filename;
  const displayArtist = metadata?.artist ?? "Unknown Artist";

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.artworkContainer}>
        {metadata?.artworkDataUri ? (
          <Image
            source={{ uri: metadata.artworkDataUri }}
            style={styles.artwork}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <Ionicons
            name="musical-note"
            size={scale(22)}
            color={theme.colors.onSurfaceVariant}
          />
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {displayTitle}
        </Text>
        <View style={styles.subtitleRow}>
          <Text style={styles.subtitle} numberOfLines={1}>
            {displayArtist}
          </Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.subtitle}>{formatTime(duration)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.moreButton} hitSlop={8}>
        <Ionicons
          name="ellipsis-vertical"
          size={scale(18)}
          color={theme.colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(20),
    height: verticalScale(72),
  },
  artworkContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(8),
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
    overflow: "hidden",
  },
  artwork: {
    width: "100%",
    height: "100%",
  },
  info: {
    flex: 1,
    gap: verticalScale(3),
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(15),
    fontWeight: "600",
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(4),
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(12),
    fontWeight: "500",
    flexShrink: 1,
  },
  dot: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(10),
  },
  moreButton: {
    padding: scale(8),
  },
});

export default memo(LocalTrackItem);
