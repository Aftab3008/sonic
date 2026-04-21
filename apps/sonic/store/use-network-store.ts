import { create } from "zustand";

interface NetworkState {
  isConnected: boolean | null;
  setIsConnected: (connected: boolean | null) => void;
  stalledDueToNetwork: boolean;
  setStalledDueToNetwork: (stalled: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  setIsConnected: (connected) => set({ isConnected: connected }),
  stalledDueToNetwork: false,
  setStalledDueToNetwork: (stalled) => set({ stalledDueToNetwork: stalled }),
}));
