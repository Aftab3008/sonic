import { FC } from "react";
import { View, FlatList } from "react-native";
import { Track } from "@/lib/schema/player.schema";
import { styles } from "./styles";
import { VanguardSectionHeader } from "../main/VanguardSectionHeader";
import { RecentlyPlayedItem, ListTrack } from "./RecentlyPlayedItem";

interface RecentlyPlayedProps {
  tracks: Track[];
  fallbackTracks: ListTrack[];
  onTrackPress: (track: Track) => void;
  onViewHistory?: () => void;
}

export const RecentlyPlayed: FC<RecentlyPlayedProps> = ({
  tracks,
  fallbackTracks,
  onTrackPress,
  onViewHistory,
}) => {
  const data = tracks?.length > 0 ? tracks : fallbackTracks;

  return (
    <View style={styles.sectionContainer}>
      <VanguardSectionHeader
        title="Recently Played"
        actionText="View History"
        onActionPress={onViewHistory}
      />

      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        keyExtractor={(item, index) => item.id || `fallback-${index}`}
        renderItem={({ item }) => (
          <RecentlyPlayedItem item={item} onPress={onTrackPress} />
        )}
      />
    </View>
  );
};

export { RecentlyPlayedItem };
export type { ListTrack };
