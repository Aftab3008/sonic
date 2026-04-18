import { theme } from "@/constants/theme";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { PlayerAlbumArt } from "../../../components/player/main-player/PlayerAlbumArt";
import { PlayerBackground } from "../../../components/player/main-player/PlayerBackground";
import { PlayerHeader } from "../../../components/player/main-player/PlayerHeader";
import { PlayerMetadata } from "../../../components/player/main-player/PlayerMetadata";
import { PlayerPlaybackControls } from "../../../components/player/main-player/PlayerPlaybackControls";
import { PlayerProgress } from "../../../components/player/main-player/PlayerProgress";
import { PlayerUtilities } from "../../../components/player/main-player/PlayerUtilities";
import { PlayerVolume } from "../../../components/player/main-player/PlayerVolume";

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();

  const [bgColors, setBgColors] = useState<string[]>([
    theme.colors.background,
    theme.colors.surface,
  ]);

  const isPlaying = playbackState.state === State.Playing;

  if (!track) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.colors.onSurface }}>No track playing</Text>
      </View>
    );
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
    <View style={styles.container}>
      <PlayerBackground artwork={track.artwork} bgColors={bgColors} />
      <PlayerHeader title={track.album} topInset={insets.top} />
      <View style={styles.mainContent}>
        <PlayerAlbumArt artwork={track.artwork} />
        <View style={styles.controlsContainer}>
          <PlayerMetadata title={track.title} artist={track.artist} />
          <PlayerProgress position={position} duration={duration} />
          <PlayerPlaybackControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
          <PlayerUtilities />
        </View>
      </View>
      <PlayerVolume bottomInset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  controlsContainer: {
    width: "100%",
  },
});
