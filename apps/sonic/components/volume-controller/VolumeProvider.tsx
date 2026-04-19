import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import { SharedValue } from "react-native-reanimated";
import { useVolumeSync } from "@/hooks/use-volume-sync";
import { useVolumeStore } from "@/store/volume-store";
import { VolumeSliderOverlay } from "@/components/volume-controller/VolumeSliderOverlay";

interface VolumeContextType {
  volume: SharedValue<number>;
  updateSystemVolume: (val: number) => void;
  showVolumeHUD: () => void;
}

const VolumeContext = createContext<VolumeContextType | null>(null);

export const useVolume = () => {
  const context = useContext(VolumeContext);
  if (!context) {
    throw new Error("useVolume must be used within a VolumeProvider");
  }
  return context;
};

export const VolumeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const setVolumeExpanded = useVolumeStore((state) => state.setVolumeExpanded);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setVolumeExpanded(false);
    }, 2500);
  }, [setVolumeExpanded]);

  const showVolumeHUD = useCallback(() => {
    setVolumeExpanded(true);
    resetHideTimer();
  }, [setVolumeExpanded, resetHideTimer]);

  const { volume, updateSystemVolume } = useVolumeSync(showVolumeHUD);

  const handleVolumeChange = useCallback(
    (val: number) => {
      updateSystemVolume(val);
      resetHideTimer();
    },
    [updateSystemVolume, resetHideTimer],
  );

  const isVolumeExpanded = useVolumeStore((state) => state.isVolumeExpanded);

  return (
    <VolumeContext.Provider
      value={{ volume, updateSystemVolume, showVolumeHUD }}
    >
      {children}
      <VolumeSliderOverlay
        volume={volume}
        isVisible={isVolumeExpanded}
        onVolumeChange={handleVolumeChange}
        onClose={() => {
          setVolumeExpanded(false);
          if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        }}
      />
    </VolumeContext.Provider>
  );
};
