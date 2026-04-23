import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { StyleSheet, Text, View } from "react-native";
import { LibraryItem } from "../ui/LibraryItem";
import { useRouter } from "expo-router";
import { useSettingsStore } from "@/lib/store/settings-store";

export const CollectionList = () => {
  const router = useRouter();
  const hasMediaPermission = useSettingsStore((s) => s.hasMediaPermission);

  return (
    <View style={styles.container}>
      <LibraryItem
        title="Liked Songs"
        subtitle="Playlist • 1,248 songs"
        icon={<Text style={{ fontSize: moderateFontScale(24) }}>❤️</Text>}
        onPress={() => {}}
      />
      <LibraryItem
        title="Downloads"
        subtitle="42 tracks available offline"
        icon={<Text style={{ fontSize: moderateFontScale(24) }}>⬇️</Text>}
        onPress={() => {}}
      />
      {hasMediaPermission && (
        <LibraryItem
          title="Local Files"
          subtitle="Songs on this device"
          icon={<Text style={{ fontSize: moderateFontScale(24) }}>📂</Text>}
          onPress={() => router.push("/local-files")}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24),
    marginTop: verticalScale(8),
  },
});
