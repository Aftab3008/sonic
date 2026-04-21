import { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TabConfigItem } from "../../constants/navigation";
import {
  INNER_PADDING,
  TAB_HEIGHT,
  TAB_TOP,
  TAB_WIDTH,
} from "../../constants/tabBar";
import { theme } from "../../constants/theme";
import { moderateFontScale } from "../../lib/scaling";

const createTabStyles = (index: number) =>
  StyleSheet.create({
    tabContainer: {
      position: "absolute",
      top: TAB_TOP,
      left: INNER_PADDING / 2 + index * TAB_WIDTH,
      width: TAB_WIDTH,
      height: TAB_HEIGHT,
    },
    tabContentArea: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    iconContainer: {
      width: 24,
      height: 24,
      justifyContent: "center",
      alignItems: "center",
    },
    tabLabel: {
      position: "absolute",
      bottom: 6,
      fontSize: moderateFontScale(10),
      fontWeight: "600",
      letterSpacing: 0.2,
    },
  });

export interface TabItemProps extends TabConfigItem {
  index: number;
  activeIndex: SharedValue<number>;
  isActive: boolean;
  onTabPress: (index: number) => void;
  onTabLongPress: (index: number) => void;
}

export const TabItem = memo(function TabItem({
  label,
  index,
  activeIndex,
  isActive,
  onTabPress,
  onTabLongPress,
  Icon,
}: TabItemProps) {
  const styles = useMemo(() => createTabStyles(index), [index]);

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const focus = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return {
      transform: [{ translateY: interpolate(focus, [0, 1], [0, -4]) }],
    };
  }, [index]);

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const focus = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return {
      opacity: interpolate(focus, [0, 0.5, 1], [0, 0, 1]),
      transform: [{ translateY: interpolate(focus, [0, 1], [4, 0]) }],
    };
  }, [index]);

  const activeIconStyle = useAnimatedStyle(() => {
    const focus = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return { opacity: focus };
  }, [index]);

  const inactiveIconStyle = useAnimatedStyle(() => {
    const focus = interpolate(
      activeIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 0],
      { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
    );
    return { opacity: 1 - focus };
  }, [index]);

  const handlePress = useCallback(() => onTabPress(index), [onTabPress, index]);
  const handleLongPress = useCallback(
    () => onTabLongPress(index),
    [onTabLongPress, index],
  );

  const inactiveColor = theme.colors.outline + "90";
  const activeColor = theme.colors.primary;
  const labelColor = theme.colors.primary;

  return (
    <View style={styles.tabContainer}>
      <Pressable
        onPress={handlePress}
        onLongPress={handleLongPress}
        style={StyleSheet.absoluteFillObject}
      >
        <View style={styles.tabContentArea}>
          <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { alignItems: "center", justifyContent: "center" },
                inactiveIconStyle,
              ]}
            >
              <Icon size={22} focused={false} color={inactiveColor} />
            </Animated.View>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { alignItems: "center", justifyContent: "center" },
                activeIconStyle,
              ]}
            >
              <Icon size={22} focused={true} color={activeColor} />
            </Animated.View>
          </Animated.View>

          <Animated.Text
            style={[styles.tabLabel, labelAnimatedStyle, { color: labelColor }]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </View>
      </Pressable>
    </View>
  );
});
