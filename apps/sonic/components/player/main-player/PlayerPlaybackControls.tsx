import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import TrackPlayer from "react-native-track-player";

interface PlayerPlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
}

export const PlayerPlaybackControls: FC<PlayerPlaybackControlsProps> = ({
  isPlaying,
  onPlayPause,
}) => {
  return (
    <View style={styles.playbackControls}>
      <TouchableOpacity style={styles.secondaryControl} activeOpacity={0.7}>
        <Ionicons
          name="shuffle"
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </TouchableOpacity>

      <View style={styles.mainControls}>
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
            size={36}
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
            <Ionicons
              name={isPlaying ? "pause" : "play"}
              size={34}
              color={theme.colors.white}
              style={!isPlaying ? { marginLeft: 4 } : {}}
            />
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
            size={36}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.secondaryControl} activeOpacity={0.7}>
        <Ionicons
          name="repeat"
          size={22}
          color={theme.colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  playbackControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
    width: "100%",
  },
  secondaryControl: {
    padding: 10,
  },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  controlPrimaryBtn: {
    padding: 8,
  },
  playPauseBtnWrapper: {
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  playPauseBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
});
