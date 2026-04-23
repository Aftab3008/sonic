import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";
import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";
import { useMediaPermissions } from "@/hooks/useMediaPermissions";

interface AudioContextType {
  isInitialized: boolean;
  error: Error | null;
}

const AudioContext = createContext<AudioContextType>({
  isInitialized: false,
  error: null,
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { checkPermission } = useMediaPermissions();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        console.log(
          "[AudioProvider] App became active, re-checking permissions...",
        );
        checkPermission();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [checkPermission]);

  useEffect(() => {
    let unmounted = false;

    const setup = async () => {
      console.log("[AudioProvider] Starting TrackPlayer setup...");
      try {
        await TrackPlayer.setupPlayer({
          autoHandleInterruptions: true,
        });
        console.log("[AudioProvider] setupPlayer completed");

        await TrackPlayer.updateOptions({
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.SeekTo,
            Capability.Stop,
          ],
          notificationCapabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
        });
        console.log("[AudioProvider] updateOptions completed");

        if (!unmounted) {
          setIsInitialized(true);
          console.log("[AudioProvider] TrackPlayer is ready");
        }
      } catch (e) {
        console.error("[AudioProvider] TrackPlayer setup failed:", e);
        if (!unmounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
        }
      }
    };

    setup();

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <AudioContext.Provider value={{ isInitialized, error }}>
      {children}
    </AudioContext.Provider>
  );
};
