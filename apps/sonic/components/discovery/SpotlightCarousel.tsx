import { theme, withAlpha } from "@/constants/theme";
import { FC } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselItem } from "./CarouselItem";
import { SpotlightCarouselProps, SpotlightItem } from "./types/carousel";

export const SpotlightCarousel: FC<SpotlightCarouselProps> = ({
  items,
  onPress,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Carousel
        loop={true}
        width={width}
        height={220}
        autoPlay={true}
        autoPlayInterval={4000}
        data={items}
        scrollAnimationDuration={1000}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.88,
          parallaxScrollingOffset: 40,
        }}
        windowSize={3}
        style={{ width: width }}
        renderItem={({ item }: { item: SpotlightItem }) => (
          <CarouselItem item={item} onPress={onPress} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginTop: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  cardContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  tagBadge: {
    backgroundColor: theme.colors.secondary + "40",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagText: {
    color: theme.colors.white,
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.white,
    lineHeight: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: "500",
    color: withAlpha(theme.colors.white, 0.8),
  },
});
