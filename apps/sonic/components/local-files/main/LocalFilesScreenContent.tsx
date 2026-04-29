import LocalTrackItem from "@/components/library/ui/LocalTrackItem";
import { theme } from "@/constants/theme";
import { useLocalFiles } from "@/hooks/useLocalFiles";
import type { LocalTrackMetadata } from "@/lib/player/local-metadata";
import { assetToTrack } from "@/lib/player/local-track.adapter";
import { usePlayerStore } from "@/lib/player/store";
import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import type { Asset } from "expo-media-library";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { LocalSearchBar } from "../ui/LocalSearchBar";
import { ViewMode, ViewModeChip } from "../ui/ViewModeChip";

const AnimatedFlashList =
  Animated.createAnimatedComponent<FlashListProps<Asset>>(FlashList);

interface LocalFilesScreenContentProps {
  scrollY: SharedValue<number>;
}

export const LocalFilesScreenContent: React.FC<
  LocalFilesScreenContentProps
> = ({ scrollY }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("songs");
  const {
    filteredTracks,
    metadataMap,
    isLoading,
    searchQuery,
    setSearchQuery,
  } = useLocalFiles();
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

  const renderItem = useCallback(
    ({ item }: { item: Asset }) => (
      <LocalTrackItem
        item={item}
        metadata={metadataMap[item.id]}
        onPress={handleTrackPress}
      />
    ),
    [metadataMap, handleTrackPress],
  );

  const listHeader = useMemo(
    () => (
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
    ),
    [searchQuery, setSearchQuery, viewMode],
  );

  return (
    <View style={styles.container}>
      <AnimatedFlashList
        data={filteredTracks}
        extraData={metadataMap}
        renderItem={renderItem}
        keyExtractor={(item: Asset) => item.id}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={listHeader}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
