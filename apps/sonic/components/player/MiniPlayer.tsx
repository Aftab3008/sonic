import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, {
  useActiveTrack,
  usePlaybackState,
  useProgress,
  State,
} from "react-native-track-player";
import { TAB_HEIGHT } from "../../constants/tabBar";
import { theme } from "../../constants/theme";
import {
  moderateFontScale,
  moderateScale,
  scale,
  verticalScale,
} from "../../lib/scaling";
import { FC } from "react";

export interface MiniPlayerProps {
  onPress?: () => void;
  onLike?: () => void;
}

export const MiniPlayer: FC<MiniPlayerProps> = ({ onPress, onLike }) => {
  const insets = useSafeAreaInsets();
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();

  const isPlaying = playbackState.state === State.Playing;
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  if (!track) {
    return null;
  }

  const handlePlayPause = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[
          styles.inner,
          {
            paddingBottom:
              (Platform.OS === "ios" ? insets.bottom : 16) + TAB_HEIGHT + 24,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image
              source={track.artwork}
              style={styles.image}
              transition={300}
              contentFit="cover"
            />
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
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onLike?.();
              }}
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
              onPress={handlePlayPause}
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
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(16, 16, 24, 0.95)",
    elevation: 10,
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
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
