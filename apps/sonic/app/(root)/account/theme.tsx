import { AccountSubPage } from "@/components/account/AccountSubPage";
import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ThemeOptionProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}

const ThemeOption = ({
  label,
  isSelected,
  onSelect,
  icon,
}: ThemeOptionProps) => (
  <TouchableOpacity
    style={[styles.option, isSelected && styles.optionSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <View style={styles.optionContent}>
      <View style={styles.leftContent}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: isSelected
                ? withAlpha(theme.colors.primary, 0.1)
                : withAlpha(theme.colors.surfaceBright, 0.5),
            },
          ]}
        >
          <Ionicons
            name={icon}
            size={20}
            color={
              isSelected ? theme.colors.primary : theme.colors.onSurfaceVariant
            }
          />
        </View>
        <Text style={[styles.optionLabel, isSelected && styles.textSelected]}>
          {label}
        </Text>
      </View>
      <View
        style={[
          styles.radio,
          isSelected && { borderColor: theme.colors.primary },
        ]}
      >
        {isSelected && <View style={styles.radioInner} />}
      </View>
    </View>
  </TouchableOpacity>
);

export default function ThemeScreen() {
  const [currentTheme, setCurrentTheme] = useState("dark");

  return (
    <AccountSubPage title="App Theme">
      <View style={styles.container}>
        <View style={styles.previewCard}>
          <View
            style={[
              styles.previewBackground,
              {
                backgroundColor:
                  currentTheme === "dark"
                    ? theme.colors.background
                    : theme.colors.white,
              },
            ]}
          >
            <View
              style={[
                styles.previewHeader,
                {
                  backgroundColor:
                    currentTheme === "dark"
                      ? theme.colors.surfaceContainer
                      : "#F3F4F6",
                },
              ]}
            />
            <View style={styles.previewBody}>
              <View
                style={[
                  styles.previewLines,
                  {
                    backgroundColor:
                      currentTheme === "dark"
                        ? theme.colors.surfaceBright
                        : "#E5E7EB",
                  },
                ]}
              />
              <View
                style={[
                  styles.previewLines,
                  {
                    width: "60%",
                    backgroundColor:
                      currentTheme === "dark"
                        ? theme.colors.surfaceBright
                        : "#E5E7EB",
                  },
                ]}
              />
            </View>
          </View>
          <Text style={styles.previewText}>Appearance Preview</Text>
        </View>

        <View style={styles.section}>
          <ThemeOption
            label="Dark Mode"
            icon="moon-outline"
            isSelected={currentTheme === "dark"}
            onSelect={() => setCurrentTheme("dark")}
          />
          <View style={styles.divider} />
          <ThemeOption
            label="Light Mode"
            icon="sunny-outline"
            isSelected={currentTheme === "light"}
            onSelect={() => setCurrentTheme("light")}
          />
          <View style={styles.divider} />
          <ThemeOption
            label="System Default"
            icon="settings-outline"
            isSelected={currentTheme === "system"}
            onSelect={() => setCurrentTheme("system")}
          />
        </View>
      </View>
    </AccountSubPage>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  previewCard: {
    alignItems: "center",
    marginBottom: 40,
  },
  previewBackground: {
    width: 200,
    height: 120,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: theme.colors.surfaceContainerHighest,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  previewHeader: {
    height: 30,
    width: "100%",
  },
  previewBody: {
    padding: 16,
    gap: 8,
  },
  previewLines: {
    height: 8,
    width: "100%",
    borderRadius: 4,
  },
  previewText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    opacity: 0.8,
  },
  section: {
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.4),
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.2),
  },
  option: {
    padding: 16,
    borderRadius: 16,
  },
  optionSelected: {
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.2),
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  textSelected: {
    color: theme.colors.primary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  divider: {
    height: 1,
    marginLeft: 72,
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.2),
  },
});
