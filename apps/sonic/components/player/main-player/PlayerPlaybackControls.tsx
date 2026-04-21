import { theme, withAlpha } from "@/constants/theme";
import { moderateScale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { FC, memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import TrackPlayer, {
  State,
  usePlaybackState,
} from "react-native-track-player";
import { useNetworkStore } from "@/store/use-network-store";

interface PlayerPlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const PlayerPlaybackControls: FC<PlayerPlaybackControlsProps> = memo(
  ({ isPlaying, onPlayPause }) => {
    const playbackState = usePlaybackState();
    const isConnected = useNetworkStore((state) => state.isConnected);
    const isStalled =
      [State.Buffering, State.Loading].includes(
        playbackState.state ?? State.None,
      ) ||
      (!isConnected && !isPlaying && playbackState.state !== State.Ready);

    return (
      <View style={styles.playbackControls}>
        <TouchableOpacity style={styles.secondaryControl} activeOpacity={0.7}>
          <Ionicons
            name="shuffle"
            size={moderateScale(22)}
            color={theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlPrimaryBtn}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            TrackPlayer.skipToPrevious();
          }}
        >
          <Ionicons
            name="play-skip-back"
            size={moderateScale(34)}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtnWrapper}
          onPress={onPlayPause}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[theme.colors.primaryContainer, theme.colors.primary]}
            style={styles.playPauseBtn}
          >
            {isStalled ||
            (!isConnected &&
              !isPlaying &&
              playbackState.state !== State.Ready) ? (
              <ActivityIndicator size="large" color={theme.colors.white} />
            ) : (
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={moderateScale(34)}
                color={theme.colors.white}
              />
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlPrimaryBtn}
          activeOpacity={0.7}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            TrackPlayer.skipToNext();
          }}
        >
          <Ionicons
            name="play-skip-forward"
            size={moderateScale(34)}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryControl} activeOpacity={0.7}>
          <Ionicons
            name="repeat"
            size={moderateScale(22)}
            color={theme.colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  playbackControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: moderateScale(16),
  },
  secondaryControl: {
    padding: moderateScale(10),
    minWidth: moderateScale(44),
    alignItems: "center",
  },
  controlPrimaryBtn: {
    padding: moderateScale(10),
    minWidth: moderateScale(54),
    alignItems: "center",
  },
  playPauseBtnWrapper: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(16),
    elevation: 6,
    marginHorizontal: moderateScale(8),
  },
  playPauseBtn: {
    width: moderateScale(80),
    height: moderateScale(80),
    borderRadius: moderateScale(40),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.2),
  },
});
