import { theme, withAlpha } from "@/constants/theme";
import { verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
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
      [0, 60],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 60],
      [0, -20],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
      pointerEvents: scrollY.value > 60 ? "none" : "auto",
    };
  });

  const compactIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [60, 100],
      [0, 1],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [60, 100],
      [0.6, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }],
      pointerEvents: scrollY.value < 60 ? "none" : "auto",
    };
  });

  // Search bar placement: below the new expanded header
  // Total header height ≈ Inset + verticalScale(20) + 50 (text height) + verticalScale(12) = Inset + verticalScale(82)
  const expandedY = topInset + verticalScale(84);

  // Compact icon placement: aligns directly with the actions (notifications/profile) in the header.
  // We offset it up from expandedY by a reasonable negative margin.
  // Profile is inside header padding; height is 32. We want compact icon to align.
  const compactOffset = -verticalScale(58); // Shifts up to sit near profile icon

  return (
    <View style={[styles.headerRow, { top: expandedY }]}>
      <Animated.View style={[styles.searchBox, fullSearchStyle]}>
        <Ionicons
          name="search"
          size={18}
          color={theme.colors.outline}
          style={{ marginRight: 10 }}
        />
        <TextInput
          placeholder="Artists, songs, or vibes..."
          placeholderTextColor={withAlpha(theme.colors.onSurface, 0.4)}
          style={styles.input}
        />
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="mic-outline" size={20} color={theme.colors.outline} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.compactIcon, compactIconStyle]}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="search" size={22} color={theme.colors.onSurface} />
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
    paddingHorizontal: 24,
    height: 52,
    justifyContent: "center",
  },
  searchBox: {
    height: 52,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
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
    fontSize: 15,
    fontWeight: "500",
    fontFamily: theme.typography.body,
  },
  compactIcon: {
    position: "absolute",
    right: 24,
    // top offset ensures it centers with the profile image in the main header
    top: -verticalScale(62),
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: withAlpha(theme.colors.surfaceContainerHigh, 0.8),
    alignItems: "center",
    justifyContent: "center",
  },
});
