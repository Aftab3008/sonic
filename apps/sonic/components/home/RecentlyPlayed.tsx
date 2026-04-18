import { ThemedText } from "@/components/themed-text";
import { theme } from "@/constants/theme";
import { Track } from "@/lib/schema/player.schema";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { FC } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { withAlpha } from "@/constants/theme";

type ListTrack =
  | Track
  | {
      id?: string;
      title: string;
      artist: string;
      image: string;
      recording?: never;
    };

interface RecentlyPlayedProps {
  tracks: ListTrack[];
  fallbackTracks: ListTrack[];
  onTrackPress: (track: Track) => void;
}

export const RecentlyPlayed: FC<RecentlyPlayedProps> = ({
  tracks,
  fallbackTracks,
  onTrackPress,
}) => {
  const data = tracks?.length > 0 ? tracks : fallbackTracks;

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recently Played</ThemedText>
        <TouchableOpacity activeOpacity={0.7}>
          <ThemedText style={styles.sectionAction}>View History</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => {
          const isRealTrack = (i: ListTrack): i is Track =>
            "recording" in i && !!i.recording;

          const itemTitle = isRealTrack(item)
            ? item.overrideTitle || item.recording.title
            : (item as any).title;
          const itemArtist = isRealTrack(item)
            ? item.recording.artists?.[0]?.artist?.name || "Unknown Artist"
            : (item as any).artist;
          const itemImage = isRealTrack(item)
            ? item.coverImageUrl || item.album?.coverImageUrl || ""
            : (item as any).image;

          return (
            <TouchableOpacity
              style={styles.trackCard}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (isRealTrack(item)) {
                  onTrackPress(item);
                }
              }}
            >
              <View style={styles.trackImageContainer}>
                <Image
                  source={itemImage}
                  style={styles.trackImage}
                  transition={300}
                  contentFit="cover"
                />
                <View style={styles.trackPlayOverlay}>
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                </View>
              </View>
              <ThemedText style={styles.trackTitle} numberOfLines={1}>
                {itemTitle}
              </ThemedText>
              <ThemedText style={styles.trackArtist} numberOfLines={1}>
                {itemArtist}
              </ThemedText>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  sectionAction: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  trackCard: {
    width: 140,
  },
  trackImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  trackImage: {
    width: "100%",
    height: "100%",
  },
  trackPlayOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: withAlpha(theme.colors.surfaceDim, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
  trackTitle: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  trackArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
  },
});
