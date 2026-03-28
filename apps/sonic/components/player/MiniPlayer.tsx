import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme, withAlpha } from "../../constants/theme";
import {
  moderateFontScale,
  moderateScale,
  scale,
  verticalScale,
} from "../../lib/scaling";

export interface TrackData {
  title: string;
  artist: string;
  image: string;
}

export interface MiniPlayerProps {
  track?: TrackData | null;
  isPlaying?: boolean;
  progressPercentage?: number;
  onPlayPause?: () => void;
  onLike?: () => void;
  onPress?: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying = false,
  progressPercentage = 0,
  onPlayPause,
  onLike,
  onPress,
}) => {
  const insets = useSafeAreaInsets();

  if (!track) {
    return null;
  }

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.inner,
          {
            paddingBottom: (Platform.OS === "ios" ? insets.bottom : 16) + 76,
          },
        ]}
      >
        <BlurView
          intensity={90}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={[
            withAlpha(theme.colors.surfaceContainer, 0.85),
            withAlpha(theme.colors.background, 0.95),
          ]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: track.image }} style={styles.image} />
            <View style={styles.imageOverlay}>
              <View style={styles.imageCenter} />
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.title} numberOfLines={1}>
              {track.title}
            </Text>
            <Text style={styles.artist} numberOfLines={1}>
              {track.artist}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              activeOpacity={0.7}
              onPress={onLike}
            >
              <Ionicons
                name="heart-outline"
                size={24}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playBtn}
              activeOpacity={0.8}
              onPress={onPlayPause}
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color={theme.colors.onPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  inner: {
    paddingTop: moderateScale(8),
    borderTopLeftRadius: moderateScale(28),
    borderTopRightRadius: moderateScale(28),
    overflow: "hidden",
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: withAlpha(theme.colors.white, 0.08),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(12),
  },
  imageContainer: {
    width: scale(48),
    height: scale(48),
    borderRadius: moderateScale(24),
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.25,
    shadowRadius: moderateScale(4),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.transparent,
    justifyContent: "center",
    alignItems: "center",
  },
  imageCenter: {
    width: scale(12),
    height: scale(12),
    borderRadius: moderateScale(6),
    backgroundColor: theme.colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: theme.colors.surfaceBright,
  },
  info: {
    flex: 1,
    marginLeft: moderateScale(14),
    marginRight: moderateScale(10),
    justifyContent: "center",
  },
  title: {
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(15),
    fontWeight: "700",
    letterSpacing: 0.2,
    marginBottom: moderateScale(2),
  },
  artist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(13),
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12),
  },
  actionBtn: {
    padding: moderateScale(8),
  },
  playBtn: {
    width: scale(40),
    height: scale(40),
    borderRadius: moderateScale(20),
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(6),
    elevation: 4,
  },
  progressTrack: {
    height: verticalScale(2),
    backgroundColor: withAlpha(theme.colors.white, 0.1),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderTopRightRadius: moderateScale(2),
    borderBottomRightRadius: moderateScale(2),
  },
});
