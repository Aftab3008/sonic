import { ThemedText } from "@/components/themed-text";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { FC, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const MoodGrid: FC = () => {
  const moods = useMemo(
    () => [
      {
        label: "Chill",
        icon: "leaf-outline" as const,
        isActive: true,
      },
      {
        label: "Energy",
        icon: "flash-outline" as const,
        isActive: false,
      },
      {
        label: "Deep",
        icon: "moon-outline" as const,
        isActive: false,
      },
      {
        label: "Workout",
        icon: "barbell-outline" as const,
        isActive: false,
      },
      {
        label: "Focus",
        icon: "terminal-outline" as const,
        isActive: false,
      },
    ],
    [],
  );

  return (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionTitleFull}>Select your mood</ThemedText>
      <View style={styles.moodGrid}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.label}
            style={[
              styles.moodButton,
              mood.isActive && styles.moodButtonActive,
            ]}
            activeOpacity={0.7}
            onPress={() => Haptics.selectionAsync()}
          >
            <Ionicons
              name={mood.icon}
              size={16}
              color={
                mood.isActive
                  ? theme.colors.primary
                  : theme.colors.onSurfaceVariant
              }
            />
            <Text
              style={[
                styles.moodLabel,
                mood.isActive && styles.moodLabelActive,
              ]}
            >
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 40,
  },
  sectionTitleFull: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: "transparent",
  },
  moodButtonActive: {
    backgroundColor: theme.colors.primaryContainer + "18",
    borderColor: theme.colors.primaryContainer + "40",
  },
  moodLabel: {
    fontWeight: "600",
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },
  moodLabelActive: {
    color: theme.colors.primary,
  },
});
