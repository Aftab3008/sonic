import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TABS_CONFIG, TabConfigItem } from "../../constants/navigation";
import { theme } from "../../constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";

interface TabItemProps extends TabConfigItem {
  focused: boolean;
  onPress: () => void;
  onLongPress: () => void;
}

function TabItem({ label, focused, onPress, onLongPress, Icon }: TabItemProps) {
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;
  const glowAnim = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        tension: 80,
        friction: 12,
      }),
      Animated.timing(glowAnim, {
        toValue: focused ? 1 : 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start();
  }, [focused, scaleAnim, glowAnim]);

  const pillScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });

  const pillOpacity = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const labelOpacity = scaleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const labelTranslateY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 0],
  });

  const iconTranslateY = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -1],
  });

  const dotOpacity = glowAnim;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={styles.tabItem}
    >
      <View style={styles.tabItemInner}>
        <Animated.View
          style={[
            styles.activePill,
            {
              opacity: pillOpacity,
              transform: [{ scale: pillScale }],
            },
          ]}
        >
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

        <Animated.View
          style={{
            transform: [{ translateY: iconTranslateY }],
          }}
        >
          <Icon
            size={22}
            focused={focused}
            color={focused ? theme.colors.primary : theme.colors.outline + "90"}
          />
        </Animated.View>

        <Animated.Text
          style={[
            styles.tabLabel,
            focused && styles.tabLabelActive,
            {
              opacity: focused ? labelOpacity : 0.6,
              transform: [{ translateY: labelTranslateY }],
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </Animated.Text>

        <Animated.View
          style={[styles.activeIndicatorDot, { opacity: dotOpacity }]}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 12,
        },
      ]}
    >
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
                  navigation.navigate(route.name, route.params);
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
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  tabBarOuter: {
    width: "100%",
    maxWidth: 420,
    position: "relative",
  },
  tabBarShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 28,
    opacity: 0.06,
    top: 4,
    bottom: -4,
    transform: [{ scaleX: 0.96 }],
  },
  tabBarWrapper: {
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "18",
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
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabItemInner: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    position: "relative",
    minWidth: 56,
  },
  activePill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 16,
    overflow: "hidden",
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.outline,
    marginTop: 4,
    letterSpacing: 0.2,
    fontFamily: theme.typography.label,
  },
  tabLabelActive: {
    color: theme.colors.primary,
    fontWeight: "700",
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
});
