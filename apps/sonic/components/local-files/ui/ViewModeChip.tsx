import { theme } from "@/constants/theme";
import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { withAlpha } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export type ViewMode = "songs" | "folders";

interface ViewModeChipProps {
  label: string;
  mode: ViewMode;
  active: ViewMode;
  onPress: (mode: ViewMode) => void;
}

export const ViewModeChip: React.FC<ViewModeChipProps> = ({
  label,
  mode,
  active,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.chip, mode === active && styles.activeChip]}
    onPress={() => onPress(mode)}
    activeOpacity={0.7}
  >
    <Text style={[styles.chipText, mode === active && styles.activeChipText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(7),
    borderRadius: scale(20),
    backgroundColor: theme.colors.surfaceContainer,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outline, 0.15),
  },
  activeChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(13),
    fontWeight: "600",
  },
  activeChipText: {
    color: theme.colors.onPrimary,
  },
});
