import { HeartIcon } from "@/components/ui/Icons";
import { theme, withAlpha } from "@/constants/theme";
import { moderateScale, scale, verticalScale } from "@/lib/scaling";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";

interface LikedSongsHeroProps {
  count?: string;
  onPress?: () => void;
  onPlayPress?: () => void;
}

export const LikedSongsHero: React.FC<LikedSongsHeroProps> = ({
  count = "1.2K Tracks",
  onPress,
  onPlayPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.container}
      onPress={onPress}
    >
      <LinearGradient
        colors={["#FF4B91", "#784BA0"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <Text style={styles.title}>Liked Songs</Text>
            <Text style={styles.count}>{count}</Text>
          </View>

          <View style={styles.rightSection}>
            <View style={styles.artStack}>
              <Image
                source="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=100&h=100"
                style={[styles.stackImage, { transform: [{ rotate: "-10deg" }] }]}
              />
              <Image
                source="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=100&h=100"
                style={[
                  styles.stackImage,
                  { position: "absolute", left: 15, zIndex: 2 },
                ]}
              />
            </View>

            <TouchableOpacity
              style={styles.playButton}
              onPress={onPlayPress}
              activeOpacity={0.8}
            >
              <View style={styles.playIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: scale(24),
    height: verticalScale(170),
    borderRadius: moderateScale(24),
    overflow: "hidden",
    marginBottom: verticalScale(24),
    elevation: 8,
    shadowColor: "#FF4B91",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  gradient: {
    flex: 1,
    padding: scale(24),
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    justifyContent: "center",
  },
  title: {
    fontSize: moderateScale(28),
    fontFamily: theme.typography.headline,
    fontWeight: "800",
    color: theme.colors.white,
    letterSpacing: -0.5,
  },
  count: {
    fontSize: moderateScale(16),
    fontFamily: theme.typography.body,
    color: withAlpha(theme.colors.white, 0.8),
    marginTop: verticalScale(4),
  },
  rightSection: {
    alignItems: "flex-end",
    height: "100%",
    justifyContent: "space-between",
  },
  artStack: {
    width: scale(70),
    height: scale(50),
    flexDirection: "row",
  },
  stackImage: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(12),
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.2)",
  },
  playButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 18,
    borderTopWidth: 11,
    borderBottomWidth: 11,
    borderLeftColor: "#784BA0",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    marginLeft: 4,
  },
});
