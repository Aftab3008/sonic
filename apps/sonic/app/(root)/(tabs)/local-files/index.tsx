import { LocalFilesScreenContent } from "@/components/local-files/main/LocalFilesScreenContent";
import { PageHeader } from "@/components/ui/PageHeader";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";

/**
 * @file local-files/index.tsx
 * @description Local Files browsing screen.
 *
 * This screen is a thin orchestrator that uses LocalFilesScreenContent
 * to handle the actual content and logic.
 */
export default function LocalFilesScreen() {
  const scrollY = useSharedValue(0);

  return (
    <ScreenWrapper>
      <PageHeader
        title="Local Files"
        subtitle="Songs on this device"
        scrollY={scrollY}
        style={styles.header}
      />
      <LocalFilesScreenContent scrollY={scrollY} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});
