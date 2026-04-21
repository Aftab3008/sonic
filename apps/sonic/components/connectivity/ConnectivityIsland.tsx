import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNetworkStore } from "../../store/use-network-store";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ConnectivityIsland = () => {
  const isConnected = useNetworkStore((state) => state.isConnected);
  const [showOnline, setShowOnline] = useState(false);
  const insets = useSafeAreaInsets();
  const hasBeenOffline = useRef(false);

  useEffect(() => {
    if (isConnected === false) {
      hasBeenOffline.current = true;
    } else if (isConnected === true && hasBeenOffline.current) {
      setShowOnline(true);
      const timer = setTimeout(() => setShowOnline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected]);

  if (isConnected === null) {
    return null;
  }

  const shouldShow = isConnected === false || showOnline;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(shouldShow ? 0 : -100) }],
      opacity: withTiming(shouldShow ? 1 : 0, { duration: 300 }),
    };
  });

  return (
    <View style={styles.outerContainer} pointerEvents="none">
      <Animated.View
        style={[
          styles.container,
          { marginTop: insets.top + 10 },
          animatedStyle,
        ]}
      >
        <BlurView intensity={60} tint="dark" style={styles.pill}>
          <View
            style={[
              styles.indicator,
              { backgroundColor: isConnected ? "#1DB954" : "#FF4D4D" },
            ]}
          />
          <Ionicons
            name={isConnected ? "wifi" : "wifi-outline"}
            size={14}
            color={isConnected ? "#1DB954" : "#FF4D4D"}
            style={styles.icon}
          />
          <Text style={styles.text}>
            {isConnected ? "Back Online" : "Waiting for connection"}
          </Text>
        </BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 1000,
  },
  container: {
    width: "100%",
    alignItems: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
