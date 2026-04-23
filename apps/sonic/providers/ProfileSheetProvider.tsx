import React, { createContext, useContext, useRef, useCallback } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { ProfileSettingsSheet } from "@/components/settings/ProfileSettingsSheet";

interface ProfileSheetContextType {
  openProfileSheet: () => void;
  closeProfileSheet: () => void;
}

const ProfileSheetContext = createContext<ProfileSheetContextType | undefined>(undefined);

export const ProfileSheetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const sheetRef = useRef<BottomSheetModal>(null);

  const openProfileSheet = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const closeProfileSheet = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  return (
    <ProfileSheetContext.Provider value={{ openProfileSheet, closeProfileSheet }}>
      {children}
      <ProfileSettingsSheet ref={sheetRef} />
    </ProfileSheetContext.Provider>
  );
};

export const useProfileSheet = () => {
  const context = useContext(ProfileSheetContext);
  if (context === undefined) {
    throw new Error("useProfileSheet must be used within a ProfileSheetProvider");
  }
  return context;
};
