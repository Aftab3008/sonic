import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TABS_CONFIG, TabConfigItem } from "../../constants/navigation";
import { theme, withAlpha } from "../../constants/theme";
import {
  moderateFontScale,
  moderateScale,
  scale,
  verticalScale,
} from "../../lib/scaling";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_BAR_MAX_WIDTH = scale(420);
const TAB_BAR_WIDTH = Math.min(SCREEN_WIDTH - scale(32), TAB_BAR_MAX_WIDTH);

interface TabItemProps extends TabConfigItem {
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ label, focused, onPress, onLongPress, Icon }: TabItemProps) {
  const animatedFocus = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    animatedFocus.value = withTiming(focused ? 1 : 0, {
      duration: 250,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [focused]);

  const TABS_COUNT = TABS_CONFIG.length;
  const INNER_PADDING = moderateScale(16);
  const AVAILABLE_WIDTH = TAB_BAR_WIDTH - INNER_PADDING;
  const ACTIVE_TAB_WIDTH = AVAILABLE_WIDTH * 0.35;
  const INACTIVE_TAB_WIDTH =
    (AVAILABLE_WIDTH - ACTIVE_TAB_WIDTH) / (TABS_COUNT - 1);

  const containerStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        animatedFocus.value,
        [0, 1],
        [INACTIVE_TAB_WIDTH, ACTIVE_TAB_WIDTH],
      ),
    };
  });

  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedFocus.value, [0.5, 1], [0, 1]),
      transform: [
        { translateX: interpolate(animatedFocus.value, [0, 1], [10, 0]) },
      ],
    };
  });

  const inactiveIconStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedFocus.value, [0, 0.5], [1, 0]),
      transform: [
        { scale: interpolate(animatedFocus.value, [0, 1], [1, 0.5]) },
        { translateY: interpolate(animatedFocus.value, [0, 1], [0, 15]) },
      ],
    };
  });

  const activeBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedFocus.value,
    };
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.tabItem, containerStyle]}>
        <Animated.View style={[styles.activeBackground, activeBackgroundStyle]}>
          <LinearGradient
            colors={[
              theme.colors.primaryContainer + "40",
              theme.colors.primary + "15",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFillObject}
          />
        </Animated.View>

        <View style={styles.tabContentContainer}>
          <Animated.View
            style={[
              styles.activeContent,
              contentStyle,
              { width: ACTIVE_TAB_WIDTH },
            ]}
          >
            <Icon size={20} focused={true} color={theme.colors.primary} />
            <Animated.Text style={styles.tabLabel} numberOfLines={1}>
              {label}
            </Animated.Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.inactiveContent,
              inactiveIconStyle,
              { width: INACTIVE_TAB_WIDTH },
            ]}
          >
            <Icon
              size={24}
              focused={false}
              color={theme.colors.outline + "90"}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.container, { bottom: bottomPadding }]}>
      <View style={styles.tabBarOuter}>
        <View style={styles.tabBarWrapper}>
          <BlurView
            intensity={80}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />

          <LinearGradient
            colors={[
              withAlpha(theme.colors.surfaceContainer, 0.8),
              withAlpha(theme.colors.background, 0.95),
            ]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.tabsRow}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              const config = TABS_CONFIG[index];

              if (!config) return null;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  requestAnimationFrame(() => {
                    navigation.navigate(route.name, route.params);
                  });
                }
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              };

              return (
                <TabItem
                  key={route.key}
                  {...config}
                  focused={isFocused}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 50,
  },
  tabBarOuter: {
    width: TAB_BAR_WIDTH,
    position: "relative",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(12),
    elevation: 8,
  },
  tabBarWrapper: {
    borderRadius: moderateScale(32),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.08),
  },
  tabsRow: {
    flexDirection: "row",
    paddingVertical: moderateScale(8),
    paddingHorizontal: moderateScale(8),
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabItem: {
    height: verticalScale(48),
    borderRadius: moderateScale(24),
    overflow: "hidden",
    justifyContent: "center",
  },
  activeBackground: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: moderateScale(24),
  },
  tabContentContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  activeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(6),
    position: "absolute",
  },
  inactiveContent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  tabLabel: {
    color: theme.colors.primary,
    fontSize: moderateFontScale(13),
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
