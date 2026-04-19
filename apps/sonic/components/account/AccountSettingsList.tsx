import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color?: string;
  onPress?: () => void;
  showChevron?: boolean;
}

const SettingItem = ({
  icon,
  label,
  color = theme.colors.onSurface,
  onPress,
  showChevron = true,
}: SettingItemProps) => (
  <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.iconBox, { backgroundColor: withAlpha(color, 0.1) }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.label}>{label}</Text>
    {showChevron && (
      <Ionicons
        name="chevron-forward"
        size={18}
        color={theme.colors.onSurfaceVariant}
      />
    )}
  </TouchableOpacity>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title}</Text>
);

export const AccountSettingsList = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <SectionHeader title="Account Settings" />
        <View style={styles.listCard}>
          <SettingItem
            icon="person-outline"
            label="Personal Information"
            color={theme.colors.primary}
            onPress={() => router.push("/account/personal-info")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="shield-checkmark-outline"
            label="Privacy & Security"
            color={theme.colors.secondary}
            onPress={() => router.push("/account/privacy")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="notifications-outline"
            label="Notification Preferences"
            color={theme.colors.tertiary}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Experience" />
        <View style={styles.listCard}>
          <SettingItem
            icon="musical-notes-outline"
            label="Audio Quality"
            color="#A855F7"
            onPress={() => router.push("/account/audio-quality")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="color-palette-outline"
            label="App Theme"
            color="#EC4899"
            onPress={() => router.push("/account/theme")}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="download-outline"
            label="Storage & Downloads"
            color="#10B981"
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Support" />
        <View style={styles.listCard}>
          <SettingItem
            icon="help-circle-outline"
            label="Help Center"
            color={theme.colors.onSurfaceVariant}
          />
          <View style={styles.divider} />
          <SettingItem
            icon="document-text-outline"
            label="Terms of Service"
            color={theme.colors.onSurfaceVariant}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionText}>Sonic Version 1.2.0 (Build 42)</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  listCard: {
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.4),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.2),
    overflow: "hidden",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  divider: {
    height: 1,
    marginLeft: 72,
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.2),
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: withAlpha(theme.colors.error, 0.1),
    paddingVertical: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.error, 0.2),
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: "700",
  },
  versionText: {
    textAlign: "center",
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
    opacity: 0.6,
  },
});
