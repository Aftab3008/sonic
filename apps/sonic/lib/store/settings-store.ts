import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { createMMKV } from "react-native-mmkv";
// import { getStoragePath } from "../helpers/storage";

const storage = createMMKV({
  id: "sonic-settings-storage",
  // path: getStoragePath(),
  encryptionKey: "[ENCRYPTION_KEY]",
  encryptionType: "AES-128",
  compareBeforeSet: true,
});

const mmkvStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, value);
  },
  getItem: (name) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name) => {
    return storage.remove(name);
  },
};

interface SettingsState {
  hasMediaPermission: boolean | null;
  setMediaPermission: (status: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      hasMediaPermission: null,
      setMediaPermission: (status) => set({ hasMediaPermission: status }),
    }),
    {
      name: "sonic-settings",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
