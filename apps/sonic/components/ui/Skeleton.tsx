import { theme, withAlpha } from "@/constants/theme";
import { moderateScale, scale, verticalScale } from "@/lib/scaling";
import { FC, memo } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: FC<SkeletonProps> = memo(
  ({
    width: w = "100%",
    height: h = moderateScale(16),
    borderRadius = moderateScale(8),
    style,
  }) => {
    const shimmerStyle = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateX: withRepeat(withTiming(1, { duration: 1500 }), -1, true),
          },
        ],
      }),
      [],
    );

    return (
      <View
        style={[
          styles.container,
          {
            width: w,
            height: h,
            borderRadius,
          },
          style,
        ]}
      >
        <Animated.View style={[styles.shimmer, shimmerStyle]} />
      </View>
    );
  },
);

export const CardSkeleton: FC = memo(() => (
  <View style={cardStyles.container}>
    <View style={cardStyles.image} />
    <View style={cardStyles.content}>
      <Skeleton width={80} height={12} borderRadius={4} />
      <Skeleton
        width="70%"
        height={24}
        borderRadius={6}
        style={{ marginTop: 8 }}
      />
      <Skeleton
        width="50%"
        height={16}
        borderRadius={4}
        style={{ marginTop: 8 }}
      />
      <View style={cardStyles.actions}>
        <Skeleton width={120} height={40} borderRadius={20} />
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>
    </View>
  </View>
));

export const GridSkeleton: FC = memo(() => (
  <View style={gridStyles.container}>
    {[1, 2, 3, 4].map((i) => (
      <View key={i} style={gridStyles.item}>
        <Skeleton
          width={scale(72)}
          height={scale(72)}
          borderRadius={moderateScale(12)}
        />
        <Skeleton
          width={60}
          height={12}
          borderRadius={4}
          style={{ marginTop: 8 }}
        />
      </View>
    ))}
  </View>
));

export const ListSkeleton: FC = memo(() => (
  <View style={listStyles.container}>
    {[1, 2, 3].map((i) => (
      <View key={i} style={listStyles.item}>
        <Skeleton
          width={scale(56)}
          height={scale(56)}
          borderRadius={moderateScale(8)}
        />
        <View style={listStyles.text}>
          <Skeleton width="60%" height={16} borderRadius={4} />
          <Skeleton
            width="40%"
            height={12}
            borderRadius={4}
            style={{ marginTop: 6 }}
          />
        </View>
      </View>
    ))}
  </View>
));

export const BentoSkeleton: FC = memo(() => (
  <View style={bentoStyles.container}>
    <Skeleton
      width="58%"
      height={verticalScale(180)}
      borderRadius={moderateScale(16)}
    />
    <View style={bentoStyles.right}>
      <Skeleton
        width="100%"
        height={verticalScale(84)}
        borderRadius={moderateScale(12)}
      />
      <Skeleton
        width="100%"
        height={verticalScale(84)}
        borderRadius={moderateScale(12)}
        style={{ marginTop: 12 }}
      />
    </View>
  </View>
));

export const MoodSkeleton: FC = memo(() => (
  <View style={moodStyles.container}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <Skeleton
        key={i}
        width={scale(100)}
        height={verticalScale(80)}
        borderRadius={moderateScale(12)}
      />
    ))}
  </View>
));

const styles = StyleSheet.create({
  container: {
    backgroundColor: withAlpha(theme.colors.surface, 0.3),
    overflow: "hidden",
  },
  shimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withAlpha(theme.colors.white, 0.05),
  },
});

const cardStyles = StyleSheet.create({
  container: {
    marginHorizontal: moderateScale(20),
    marginTop: moderateScale(16),
    borderRadius: moderateScale(20),
    overflow: "hidden",
    backgroundColor: withAlpha(theme.colors.surface, 0.2),
  },
  image: {
    width: "100%",
    aspectRatio: 4 / 5,
    backgroundColor: withAlpha(theme.colors.surface, 0.3),
  },
  content: {
    padding: moderateScale(16),
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(12),
    gap: moderateScale(12),
  },
});

const gridStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(16),
  },
  item: {
    alignItems: "center",
    width: "25%",
    marginBottom: moderateScale(16),
  },
});

const listStyles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(8),
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(8),
  },
  text: {
    flex: 1,
    marginLeft: moderateScale(12),
  },
});

const bentoStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(16),
    gap: moderateScale(12),
  },
  right: {
    flex: 1,
    gap: moderateScale(12),
  },
});

const moodStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(16),
    gap: moderateScale(12),
  },
});
