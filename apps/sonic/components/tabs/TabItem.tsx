import { memo, useCallback } from "react";
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
import { getFocus } from "../../lib/tabBarUtils";

export interface TabItemProps extends TabConfigItem {
  index: number;
  fromIdx: SharedValue<number>;
  toIdx: SharedValue<number>;
  progress: SharedValue<number>;
  onTabPress: (index: number) => void;
  onTabLongPress: (index: number) => void;
}

export const TabItem = memo(function TabItem({
  label,
  index,
  fromIdx,
  toIdx,
  progress,
  onTabPress,
  onTabLongPress,
  Icon,
}: TabItemProps) {
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const f = getFocus(fromIdx.value, toIdx.value, progress.value, index);
    return {
      transform: [{ translateY: interpolate(f, [0, 1], [0, -4]) }],
    };
  });

  const labelAnimatedStyle = useAnimatedStyle(() => {
    const f = getFocus(fromIdx.value, toIdx.value, progress.value, index);
    return {
      opacity: interpolate(f, [0, 0.5, 1], [0, 0, 1]),
      transform: [{ translateY: interpolate(f, [0, 1], [4, 0]) }],
    };
  });

  const activeIconStyle = useAnimatedStyle(() => {
    const f = getFocus(fromIdx.value, toIdx.value, progress.value, index);
    return { opacity: f };
  });

  const inactiveIconStyle = useAnimatedStyle(() => {
    const f = getFocus(fromIdx.value, toIdx.value, progress.value, index);
    return { opacity: 1 - f };
  });

  const handlePress = useCallback(() => onTabPress(index), [onTabPress, index]);
  const handleLongPress = useCallback(
    () => onTabLongPress(index),
    [onTabLongPress, index],
  );

  return (
    <View
      style={[
        styles.tabContainer,
        { left: INNER_PADDING / 2 + index * TAB_WIDTH },
      ]}
    >
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
              <Icon
                size={22}
                focused={false}
                color={theme.colors.outline + "90"}
              />
            </Animated.View>
            <Animated.View
              style={[
                StyleSheet.absoluteFillObject,
                { alignItems: "center", justifyContent: "center" },
                activeIconStyle,
              ]}
            >
              <Icon size={22} focused={true} color={theme.colors.primary} />
            </Animated.View>
          </Animated.View>

          <Animated.Text
            style={[styles.tabLabel, labelAnimatedStyle]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        </View>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    top: TAB_TOP,
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
    color: theme.colors.primary,
    letterSpacing: 0.2,
  },
});
