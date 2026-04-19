import { useEffect, useRef } from "react";
import { useSharedValue } from "react-native-reanimated";
import { VolumeManager } from "react-native-volume-manager";

/**
 * useVolumeSync Hook
 * Synchronizes a Reanimated SharedValue with the system volume.
 * Handles physical button presses and provides a setter for the system volume.
 */
export const useVolumeSync = (onExternalChange?: () => void) => {
  const volume = useSharedValue(0.7);
  const lastInternalUpdate = useRef(0);

  useEffect(() => {
    const initVolume = async () => {
      try {
        const result = await VolumeManager.getVolume();
        if (typeof result.volume === "number") {
          volume.value = result.volume;
        }
      } catch (error) {
        console.log("[useVolumeSync] Failed to get initial volume:", error);
      }
    };

    initVolume();

    VolumeManager.showNativeVolumeUI({ enabled: false });

    const listener = VolumeManager.addVolumeListener((result) => {
      const now = Date.now();
      const isInternal = now - lastInternalUpdate.current < 300;

      if (volume.value !== result.volume) {
        volume.value = result.volume;
        if (!isInternal && onExternalChange) {
          onExternalChange();
        }
      }
    });

    return () => {
      listener.remove();
      VolumeManager.showNativeVolumeUI({ enabled: true });
    };
  }, [volume]);

  /**
   * updateSystemVolume
   * Sets the system volume without showing the native HUD.
   */
  const updateSystemVolume = (newVal: number) => {
    const value = Math.min(Math.max(newVal, 0), 1);
    lastInternalUpdate.current = Date.now();
    volume.value = value;
    VolumeManager.setVolume(value, { showUI: false });
  };

  return {
    volume,
    updateSystemVolume,
  };
};
