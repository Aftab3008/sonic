import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef, memo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TABS_CONFIG } from "../../constants/navigation";
import {
  INNER_PADDING,
  PILL_H_INSET,
  PILL_RADIUS,
  TAB_BAR_WIDTH,
  TAB_HEIGHT,
  TAB_TOP,
  TAB_WIDTH,
} from "../../constants/tabBar";
import { theme } from "../../constants/theme";
import { moderateScale, verticalScale } from "../../lib/scaling";
import { TabItem } from "./TabItem";

const TIMING_CONFIG = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  const activeIndex = useSharedValue(state.index);
  const prevIndex = useRef(state.index);

  useEffect(() => {
    if (state.index !== prevIndex.current) {
      activeIndex.value = withTiming(state.index, TIMING_CONFIG);
      prevIndex.current = state.index;
    }
  }, [state.index, activeIndex]);

  const indicatorStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: activeIndex.value * TAB_WIDTH }],
    }),
    [],
  );

  const onTabPress = useCallback(
    (index: number) => {
      const route = state.routes[index];

      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (state.index !== index && !event.defaultPrevented) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        navigation.navigate(route.name, route.params);

        activeIndex.value = withTiming(index, TIMING_CONFIG);
        prevIndex.current = index;
      }
    },
    [state, navigation, activeIndex],
  );

  const onTabLongPress = useCallback(
    (index: number) => {
      const route = state.routes[index];
      navigation.emit({ type: "tabLongPress", target: route.key });
    },
    [navigation, state.routes],
  );

  return (
    <View style={[styles.container, { bottom: bottomPadding }]}>
      <View style={styles.tabBarOuter}>
        <View style={styles.tabBarShadow} />
        <View style={styles.tabBarWrapper}>
          <View style={[StyleSheet.absoluteFillObject, styles.backdrop]} />
          <LinearGradient
            colors={["rgba(30, 30, 40, 0.85)", "rgba(15, 15, 23, 0.92)"]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.topBorderGlow}>
            <LinearGradient
              colors={[
                "transparent",
                theme.colors.primaryContainer + "18",
                theme.colors.primary + "10",
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
          <View style={styles.tabsRow}>
            <Animated.View style={[styles.indicator, indicatorStyle]}>
              <LinearGradient
                colors={[
                  theme.colors.primaryContainer + "25",
                  theme.colors.primary + "12",
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFillObject}
              />
            </Animated.View>

            {state.routes.map((route, index) => {
              const config = TABS_CONFIG[index];
              if (!config) return null;

              return (
                <TabItem
                  key={route.key}
                  {...config}
                  index={index}
                  activeIndex={activeIndex}
                  isActive={state.index === index}
                  onTabPress={onTabPress}
                  onTabLongPress={onTabLongPress}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

export default memo(CustomTabBar);

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
  },
  tabBarShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: moderateScale(28),
    opacity: 0.06,
    top: 4,
    bottom: -4,
    transform: [{ scaleX: 0.96 }],
  },
  tabBarWrapper: {
    borderRadius: moderateScale(32),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  backdrop: {
    backgroundColor:
      Platform.OS === "ios"
        ? "rgba(20, 20, 28, 0.75)"
        : "rgba(20, 20, 28, 0.85)",
  },
  topBorderGlow: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    height: 1,
    zIndex: 10,
  },
  tabsRow: {
    height: verticalScale(64),
    position: "relative",
  },
  indicator: {
    position: "absolute",
    top: TAB_TOP,
    left: INNER_PADDING / 2 + PILL_H_INSET,
    width: TAB_WIDTH - PILL_H_INSET * 2,
    height: TAB_HEIGHT,
    borderRadius: PILL_RADIUS,
    overflow: "hidden",
  },
});
