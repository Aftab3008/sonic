import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface LocalSearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const LocalSearchBar: React.FC<LocalSearchBarProps> = ({
  value,
  onChangeText,
}) => (
  <View style={styles.searchContainer}>
    <Ionicons name="search" size={scale(16)} color={theme.colors.outline} />
    <TextInput
      placeholder="Search local files..."
      placeholderTextColor={withAlpha(theme.colors.onSurface, 0.4)}
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      returnKeyType="search"
      clearButtonMode="while-editing"
    />
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: scale(12),
    paddingHorizontal: scale(14),
    height: verticalScale(46),
    marginBottom: verticalScale(14),
    gap: scale(8),
  },
  searchInput: {
    flex: 1,
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(14),
    fontWeight: "500",
  },
});
