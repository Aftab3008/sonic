import TrackPlayer, {
  Event,
  PlaybackErrorEvent,
  State,
} from "react-native-track-player";
import { useNetworkStore } from "@/store/use-network-store";

export const PlaybackService = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log("[PlaybackService] Event: RemotePlay");
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log("[PlaybackService] Event: RemotePause");
    useNetworkStore.getState().setStalledDueToNetwork(false);
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log("[PlaybackService] Event: RemoteNext");
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log("[PlaybackService] Event: RemotePrevious");
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, (event) => {
    console.log(`[PlaybackService] Event: RemoteSeek to ${event.position}`);
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(
    Event.PlaybackError,
    (error: PlaybackErrorEvent) => {
      console.log(
        "[PlaybackService] Critical Playback Error:",
        error.code,
        error.message,
      );
      useNetworkStore.getState().setStalledDueToNetwork(true);
    },
  );

  TrackPlayer.addEventListener(Event.PlaybackState, (event) => {
    console.log("[PlaybackService] Playback State Changed:", event.state);
    if (event.state === State.Playing) {
      useNetworkStore.getState().setStalledDueToNetwork(false);
    }
  });
};
