import { AccountSubPage } from "@/components/account/AccountSubPage";
import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface QualityOptionProps {
  label: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}

const QualityOption = ({
  label,
  description,
  isSelected,
  onSelect,
}: QualityOptionProps) => (
  <TouchableOpacity
    style={[styles.option, isSelected && styles.optionSelected]}
    onPress={onSelect}
    activeOpacity={0.7}
  >
    <View style={styles.optionContent}>
      <View style={styles.textContainer}>
        <Text style={[styles.optionLabel, isSelected && styles.textSelected]}>
          {label}
        </Text>
        <Text style={styles.optionDescription}>{description}</Text>
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

export default function AudioQualityScreen() {
  const [quality, setQuality] = useState("lossless");

  return (
    <AccountSubPage title="Audio Quality">
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.infoText}>
            Higher quality audio uses more data. Lossless audio is only
            recommended for Wi-Fi connections.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Streaming Quality</Text>
        <View style={styles.section}>
          <QualityOption
            label="Lossless"
            description="Up to 24-bit/192kHz. Pure studio sound."
            isSelected={quality === "lossless"}
            onSelect={() => setQuality("lossless")}
          />
          <View style={styles.divider} />
          <QualityOption
            label="High"
            description="320kbps. Excellent clarity."
            isSelected={quality === "high"}
            onSelect={() => setQuality("high")}
          />
          <View style={styles.divider} />
          <QualityOption
            label="Basic"
            description="128kbps. Saves data."
            isSelected={quality === "basic"}
            onSelect={() => setQuality("basic")}
          />
        </View>

        <Text style={styles.sectionTitle}>Download Quality</Text>
        <View style={styles.section}>
          <QualityOption
            label="Maximum"
            description="Always download in the best available quality."
            isSelected={true}
            onSelect={() => {}}
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
  infoBox: {
    flexDirection: "row",
    backgroundColor: withAlpha(theme.colors.primary, 0.1),
    padding: 16,
    borderRadius: 20,
    marginBottom: 32,
    gap: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.2),
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 20,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  section: {
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.4),
    borderRadius: 24,
    padding: 8,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.2),
    marginBottom: 32,
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
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  textSelected: {
    color: theme.colors.primary,
  },
  optionDescription: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
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
    marginHorizontal: 16,
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.2),
  },
});
