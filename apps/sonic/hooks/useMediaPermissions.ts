import * as MediaLibrary from "expo-media-library";
import { useSettingsStore } from "../lib/store/settings-store";

export const useMediaPermissions = () => {
  const setMediaPermission = useSettingsStore(
    (state) => state.setMediaPermission,
  );

  const requestPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setMediaPermission(status === "granted");
      return status === "granted";
    } catch (error) {
      console.error(
        "[useMediaPermissions] Failed to request permission:",
        error,
      );
      setMediaPermission(false);
      return false;
    }
  };

  const checkPermission = async () => {
    const { status } = await MediaLibrary.getPermissionsAsync();
    setMediaPermission(status === "granted");
    return status === "granted";
  };

  return { requestPermission, checkPermission };
};
