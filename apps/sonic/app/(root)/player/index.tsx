import { useVolume } from "@/components/volume-controller/VolumeProvider";
import { theme } from "@/constants/theme";
import { getAdaptiveDelays, usePerformanceTier } from "@/lib/performance";
import { moderateScale, scale, verticalScale } from "@/lib/scaling";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  AppStateStatus,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";
import { PlayerAlbumArt } from "../../../components/player/main-player/PlayerAlbumArt";
import { PlayerBackground } from "../../../components/player/main-player/PlayerBackground";
import { PlayerMetadata } from "../../../components/player/main-player/PlayerMetadata";
import { PlayerPlaybackControls } from "../../../components/player/main-player/PlayerPlaybackControls";
import { PlayerProgress } from "../../../components/player/main-player/PlayerProgress";
import { PlayerUtilities } from "../../../components/player/main-player/PlayerUtilities";
import { UnifiedPlayerHeader } from "../../../components/player/main-player/UnifiedPlayerHeader";

// Mount phases for progressive rendering
// 0 = immediate (basic structure)
// 1 = after first frame (blur effects)
// 2 = after 2-3 frames (heavy shadows, extras)
type MountPhase = 0 | 1 | 2;

export default function PlayerScreen() {
  const insets = useSafeAreaInsets();
  const track = useActiveTrack();
  const playbackState = usePlaybackState();
  const { position, duration } = useProgress();

  const performanceTier = usePerformanceTier();
  const delays = getAdaptiveDelays(performanceTier);

  const [bgColors] = useState<string[]>([
    theme.colors.background,
    theme.colors.surface,
  ]);

  const [mountPhase, setMountPhase] = useState<MountPhase>(0);
  const mountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const phase1Timer = requestAnimationFrame(() => {
      setTimeout(() => setMountPhase(1), delays.phase1);
    });

    mountTimerRef.current = setTimeout(() => {
      setMountPhase(2);
    }, delays.phase2);

    return () => {
      cancelAnimationFrame(phase1Timer);
      if (mountTimerRef.current) {
        clearTimeout(mountTimerRef.current);
      }
    };
  }, [delays.phase1, delays.phase2]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active" && mountPhase === 2) {
      }
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    const memoryWarning = AppState.addEventListener("memoryWarning", () => {
      console.log("[Player] Memory warning received, reducing effects");
      if (mountPhase === 2) {
        setMountPhase(1);
      }
    });

    return () => {
      subscription.remove();
      memoryWarning.remove();
    };
  }, [mountPhase]);

  const { volume, showVolumeHUD } = useVolume();

  const isPlaying = playbackState.state === State.Playing;

  const handlePlayPause = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isPlaying) {
      await TrackPlayer.pause();
    } else {
      await TrackPlayer.play();
    }
  }, [isPlaying]);

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

  return (
    <View style={styles.container}>
      <PlayerBackground
        artwork={track.artwork}
        bgColors={bgColors}
        mountPhase={mountPhase}
      />

      <UnifiedPlayerHeader
        title={track.album}
        volume={volume}
        topInset={insets.top}
        onLongPress={showVolumeHUD}
        mountPhase={mountPhase}
        performanceTier={performanceTier}
      />

      <ScrollView
        contentContainerStyle={styles.mainContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        <PlayerAlbumArt
          artwork={track.artwork}
          mountPhase={mountPhase}
          performanceTier={performanceTier}
        />
        <View style={styles.controlsContainer}>
          <PlayerMetadata title={track.title} artist={track.artist} />
          <PlayerProgress position={position} duration={duration} />
          <PlayerPlaybackControls
            isPlaying={isPlaying}
            onPlayPause={handlePlayPause}
          />
          <PlayerUtilities mountPhase={mountPhase} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(24),
    paddingHorizontal: moderateScale(32),
    maxWidth: scale(500),
    alignSelf: "center",
    width: "100%",
    paddingTop: verticalScale(10),
    paddingBottom: verticalScale(32),
  },
  controlsContainer: {
    width: "100%",
    gap: verticalScale(20),
  },
});
