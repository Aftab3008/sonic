import { theme } from "@/constants/theme";
import { useLocalFiles } from "@/hooks/useLocalFiles";
import { assetToTrack } from "@/lib/player/local-track.adapter";
import type { LocalTrackMetadata } from "@/lib/player/local-metadata";
import { usePlayerStore } from "@/lib/player/store";
import { scale, verticalScale, moderateFontScale } from "@/lib/scaling";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import type { Asset } from "expo-media-library";
import LocalTrackItem from "@/components/library/ui/LocalTrackItem";
import { LocalSearchBar } from "../ui/LocalSearchBar";
import { ViewModeChip, ViewMode } from "../ui/ViewModeChip";

interface LocalFilesScreenContentProps {
  scrollY: SharedValue<number>;
}

export const LocalFilesScreenContent: React.FC<
  LocalFilesScreenContentProps
> = ({ scrollY }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("songs");
  const { filteredTracks, isLoading, searchQuery, setSearchQuery } =
    useLocalFiles();
  const playTrack = usePlayerStore((s) => s.playTrack);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleTrackPress = useCallback(
    (asset: Asset, metadata: LocalTrackMetadata | null) => {
      playTrack(assetToTrack(asset, metadata));
    },
    [playTrack],
  );

  return (
    <Animated.FlatList
      data={filteredTracks}
      keyExtractor={(item) => item.id}
      onScroll={onScroll}
      scrollEventThrottle={16}
      contentContainerStyle={styles.scrollContent}
      initialNumToRender={12}
      windowSize={7}
      removeClippedSubviews
      ListHeaderComponent={
        <View style={styles.listHeader}>
          <LocalSearchBar value={searchQuery} onChangeText={setSearchQuery} />
          <View style={styles.chipRow}>
            <ViewModeChip
              label="All Songs"
              mode="songs"
              active={viewMode}
              onPress={setViewMode}
            />
            <ViewModeChip
              label="Folders"
              mode="folders"
              active={viewMode}
              onPress={setViewMode}
            />
          </View>
        </View>
      }
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.centred}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <View style={styles.centred}>
            <Text style={styles.emptyText}>No audio files found</Text>
          </View>
        )
      }
      renderItem={({ item }) => (
        <LocalTrackItem
          assetId={item.id}
          uri={item.uri}
          filename={item.filename}
          duration={item.duration}
          onPress={(metadata) => handleTrackPress(item, metadata)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: verticalScale(120),
    paddingBottom: verticalScale(100),
  },
  listHeader: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(12),
  },
  chipRow: {
    flexDirection: "row",
    gap: scale(8),
  },
  centred: {
    alignItems: "center",
    paddingTop: verticalScale(60),
  },
  emptyText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(14),
  },
});
