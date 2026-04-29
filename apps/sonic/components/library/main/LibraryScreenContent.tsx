import { verticalScale } from "@/lib/scaling";
import { StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { ProfileHeader } from "../ui/ProfileHeader";
import { LikedSongsHero } from "../ui/LikedSongsHero";
import { LibraryCategoryGrid } from "../sections/LibraryCategoryGrid";
import { RecentMusicSection } from "../sections/RecentMusicSection";
import { authClient } from "@/lib/auth/auth-client";

interface LibraryScreenContentProps {
  scrollY: SharedValue<number>;
}

export const LibraryScreenContent: React.FC<LibraryScreenContentProps> = ({
  scrollY,
}) => {
  const { data: session } = authClient.useSession();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      onScroll={scrollHandler}
      scrollEventThrottle={16}
    >
      <ProfileHeader
        username={session?.user?.name}
        avatarUrl={session?.user?.image}
      />
      <LikedSongsHero />
      <LibraryCategoryGrid />
      <RecentMusicSection />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(220),
  },
});
