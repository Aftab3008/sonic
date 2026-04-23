import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface CollapsibleSearchBarProps {
  scrollY: SharedValue<number>;
  topInset: number;
}

export const CollapsibleSearchBar = ({
  scrollY,
  topInset,
}: CollapsibleSearchBarProps) => {
  const fullSearchStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, verticalScale(60)],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, verticalScale(60)],
      [0, -verticalScale(20)],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
      pointerEvents: scrollY.value > verticalScale(60) ? "none" : "auto",
    };
  });

  const compactIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [verticalScale(60), verticalScale(100)],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const itemScale = interpolate(
      scrollY.value,
      [verticalScale(60), verticalScale(100)],
      [0.6, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale: itemScale }],
      pointerEvents: scrollY.value < verticalScale(60) ? "none" : "auto",
    };
  });

  const expandedY = topInset + verticalScale(84);

  return (
    <View style={[styles.headerRow, { top: expandedY }]}>
      <Animated.View style={[styles.searchBox, fullSearchStyle]}>
        <Ionicons
          name="search"
          size={scale(18)}
          color={theme.colors.outline}
          style={{ marginRight: scale(10) }}
        />
        <TextInput
          placeholder="Artists, songs, or vibes..."
          placeholderTextColor={withAlpha(theme.colors.onSurface, 0.4)}
          style={styles.input}
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons
            name="mic-outline"
            size={scale(20)}
            color={theme.colors.outline}
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.compactIcon, compactIconStyle]}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons
            name="search"
            size={scale(22)}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: scale(24),
    height: verticalScale(52),
    justifyContent: "center",
  },
  searchBox: {
    height: verticalScale(52),
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: scale(16),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.05),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(15),
    fontWeight: "500",
    fontFamily: theme.typography.body,
  },
  compactIcon: {
    position: "absolute",
    right: scale(24),
    top: -verticalScale(62),
    height: scale(40),
    width: scale(40),
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    backgroundColor: withAlpha(theme.colors.surfaceContainerHigh, 0.8),
    alignItems: "center",
    justifyContent: "center",
  },
});
