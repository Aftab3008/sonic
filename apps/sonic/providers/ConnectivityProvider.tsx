import { ReactNode, use, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { onlineManager } from "@tanstack/react-query";
import TrackPlayer from "react-native-track-player";
import { useNetworkStore } from "../store/use-network-store";

export const ConnectivityProvider = ({ children }: { children: ReactNode }) => {
  const setIsConnected = useNetworkStore((state) => state.setIsConnected);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline = !!state.isConnected && !!state.isInternetReachable;
      const wasOnline = useNetworkStore.getState().isConnected;

      if (isOnline && wasOnline === false) {
        const { stalledDueToNetwork, setStalledDueToNetwork } =
          useNetworkStore.getState();
        if (stalledDueToNetwork) {
          setTimeout(() => {
            TrackPlayer.play();
            setStalledDueToNetwork(false);
          }, 800);
        }
      }

      onlineManager.setOnline(isOnline);
      setIsConnected(isOnline);
    });

    return () => {
      unsubscribe();
    };
  }, [setIsConnected]);

  return <>{children}</>;
};
