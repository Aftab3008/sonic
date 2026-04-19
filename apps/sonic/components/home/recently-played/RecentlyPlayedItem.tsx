import { FC } from "react";
import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ThemedText } from "@/components/themed-text";
import { Track } from "@/lib/schema/player.schema";
import { styles } from "./styles";

export type ListTrack =
  | Track
  | {
      id?: string;
      title: string;
      artist: string;
      image: string;
      recording?: never;
    };

interface RecentlyPlayedItemProps {
  item: ListTrack;
  onPress: (track: Track) => void;
}

export const RecentlyPlayedItem: FC<RecentlyPlayedItemProps> = ({ item, onPress }) => {
  const isRealTrack = (i: ListTrack): i is Track =>
    "recording" in i && !!i.recording;

  const itemTitle = isRealTrack(item)
    ? item.overrideTitle || item.recording.title
    : item.title;
    
  const itemArtist = isRealTrack(item)
    ? item.recording.artists?.[0]?.artist?.name || "Unknown Artist"
    : item.artist;
    
  const itemImage = isRealTrack(item)
    ? item.coverImageUrl || item.album?.coverImageUrl || ""
    : item.image;

  return (
    <TouchableOpacity
      style={styles.trackCard}
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isRealTrack(item)) {
          onPress(item);
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
};
