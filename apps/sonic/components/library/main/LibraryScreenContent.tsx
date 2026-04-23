import { verticalScale } from "@/lib/scaling";
import { StyleSheet } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { CollectionList } from "../sections/CollectionList";

interface LibraryScreenContentProps {
  scrollY: SharedValue<number>;
}

export const LibraryScreenContent: React.FC<LibraryScreenContentProps> = ({
  scrollY,
}) => {
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
      <CollectionList />
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: verticalScale(110),
    paddingBottom: verticalScale(220),
  },
});
