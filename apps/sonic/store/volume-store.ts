import { create } from "zustand";

interface VolumeState {
  isVolumeExpanded: boolean;
  setVolumeExpanded: (expanded: boolean) => void;
  toggleVolume: () => void;
}

export const useVolumeStore = create<VolumeState>((set) => ({
  isVolumeExpanded: false,
  setVolumeExpanded: (expanded) => set({ isVolumeExpanded: expanded }),
  toggleVolume: () =>
    set((state) => ({ isVolumeExpanded: !state.isVolumeExpanded })),
}));
