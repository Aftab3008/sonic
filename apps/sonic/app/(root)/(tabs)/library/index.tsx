import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { useSharedValue } from "react-native-reanimated";
import { LibraryScreenContent } from "@/components/library/main/LibraryScreenContent";

export default function LibraryScreen() {
  const scrollY = useSharedValue(0);

  return (
    <ScreenWrapper>
      <LibraryScreenContent scrollY={scrollY} />
    </ScreenWrapper>
  );
}
