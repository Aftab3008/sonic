import { FC } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Image } from "expo-image";
import { theme } from "@/constants/theme";
import { Track } from "@/lib/schema/player.schema";

interface QuickAccessGridProps {
  tracks: Track[];
  onTrackPress: (track: Track) => void;
}

export const QuickAccessGrid: FC<QuickAccessGridProps> = ({ tracks, onTrackPress }) => {
  // Use first 6 items
  const displayTracks = tracks.slice(0, 6);

  return (
    <View style={styles.container}>
      {displayTracks.map((track) => (
        <TouchableOpacity
          key={track.id}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => onTrackPress(track)}
        >
          <Image
            source={track.coverImageUrl || track.album?.coverImageUrl}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <Text style={styles.title} numberOfLines={2}>
            {track.overrideTitle || track.recording.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const { width } = Dimensions.get("window");
const GUTTER = 24;
const CARD_GAP = 12;
const CARD_WIDTH = (width - GUTTER * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: GUTTER,
    gap: CARD_GAP,
    marginTop: 8,
  },
  card: {
    width: CARD_WIDTH,
    height: 56,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  image: {
    width: 56,
    height: 56,
  },
  title: {
    flex: 1,
    fontFamily: theme.typography.body,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSurface,
    paddingHorizontal: 10,
    lineHeight: 16,
  },
});
