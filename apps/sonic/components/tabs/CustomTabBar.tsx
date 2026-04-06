import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { TABS_CONFIG } from "../../constants/navigation";
import {
  INNER_PADDING,
  PILL_H_INSET,
  PILL_RADIUS,
  TAB_BAR_WIDTH,
  TAB_HEIGHT,
  TAB_TOP,
  TAB_WIDTH,
  TIMING_CONFIG,
} from "../../constants/tabBar";
import { theme } from "../../constants/theme";
import { moderateScale, verticalScale } from "../../lib/scaling";
import { TabItem } from "./TabItem";

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 12);

  const fromIdx = useSharedValue(state.index);
  const toIdx = useSharedValue(state.index);
  const progress = useSharedValue(1);

  const stateRef = useRef(state);
  stateRef.current = state;
  const navigationRef = useRef(navigation);
  navigationRef.current = navigation;

  useEffect(() => {
    if (state.index !== toIdx.value) {
      fromIdx.value = toIdx.value;
      toIdx.value = state.index;
      progress.value = 0;
      progress.value = withTiming(1, TIMING_CONFIG);
    }
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => {
    const fi = fromIdx.value;
    const ti = toIdx.value;
    const p = progress.value;
    const x = fi * TAB_WIDTH + (ti - fi) * TAB_WIDTH * p;
    return {
      transform: [{ translateX: x }],
    };
  });

  const doNavigate = useCallback((routeName: string, routeParams: any) => {
    navigationRef.current.navigate(routeName, routeParams);
  }, []);

  const onTabPress = useCallback(
    (index: number) => {
      const currentState = stateRef.current;
      const nav = navigationRef.current;
      const route = currentState.routes[index];

      const event = nav.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (currentState.index !== index && !event.defaultPrevented) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const routeName = route.name;
        const routeParams = route.params;

        fromIdx.value = toIdx.value;
        toIdx.value = index;
        progress.value = 0;
        progress.value = withTiming(1, TIMING_CONFIG, (finished) => {
          "worklet";
          if (finished) {
            scheduleOnRN(doNavigate, routeName, routeParams);
          }
        });
      }
    },
    [fromIdx, toIdx, progress],
  );

  const onTabLongPress = useCallback((index: number) => {
    const currentState = stateRef.current;
    const nav = navigationRef.current;
    const route = currentState.routes[index];
    nav.emit({ type: "tabLongPress", target: route.key });
  }, []);

  return (
    <View style={[styles.container, { bottom: bottomPadding }]}>
      <View style={styles.tabBarOuter}>
        <View style={styles.tabBarShadow} />
        <View style={styles.tabBarWrapper}>
          <BlurView
            intensity={60}
            tint="dark"
            style={StyleSheet.absoluteFillObject}
          />
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
                  fromIdx={fromIdx}
                  toIdx={toIdx}
                  progress={progress}
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
