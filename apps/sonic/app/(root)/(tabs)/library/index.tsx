import { PageHeader } from "@/components/ui/PageHeader";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useSharedValue } from "react-native-reanimated";
import { LibraryScreenContent } from "@/components/library/main/LibraryScreenContent";
import { StyleSheet } from "react-native";

export default function LibraryScreen() {
  const scrollY = useSharedValue(0);

  return (
    <ScreenWrapper>
      <PageHeader
        title="Library"
        subtitle="Your,"
        scrollY={scrollY}
        style={styles.header}
      />
      <LibraryScreenContent scrollY={scrollY} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
