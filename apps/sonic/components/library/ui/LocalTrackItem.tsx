/**
 * @file LocalTrackItem.tsx
 * @description Presentational component for a single local audio track row.
 *
 * Responsibilities:
 *   - Lazy-load and cache embedded album artwork via the metadata service.
 *   - Display title, artist, and formatted duration.
 *   - Expose an `onPress` callback — no playback logic lives here.
 *
 * Design decisions:
 *   - Uses `expo-image` for hardware-accelerated, memory-managed rendering.
 *   - Artwork is fetched inside the component so each row manages its own state,
 *     keeping the parent list thin and enabling efficient FlatList recycling.
 *   - A cancellation flag prevents state updates on unmounted rows.
 */
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { FC, memo, useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/constants/theme";
import { scale, verticalScale, moderateFontScale } from "@/lib/scaling";
import {
  getLocalTrackMetadata,
  type LocalTrackMetadata,
} from "@/lib/player/local-metadata";
import { formatTime } from "@/utils/utils";

export interface LocalTrackItemProps {
  assetId: string;
  uri: string;
  filename: string;
  duration: number;
  onPress: (metadata: LocalTrackMetadata | null) => void;
}

const LocalTrackItem: FC<LocalTrackItemProps> = ({
  assetId,
  uri,
  filename,
  duration,
  onPress,
}) => {
  const [metadata, setMetadata] = useState<LocalTrackMetadata | null>(null);

  useEffect(() => {
    let mounted = true;
    getLocalTrackMetadata(assetId, uri).then((data) => {
      if (mounted) setMetadata(data);
    });
    return () => {
      mounted = false;
    };
  }, [assetId, uri]);

  const handlePress = useCallback(() => {
    onPress(metadata);
  }, [metadata, onPress]);

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
