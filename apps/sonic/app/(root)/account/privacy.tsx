import { AccountSubPage } from "@/components/account/AccountSubPage";
import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, Switch, View } from "react-native";

interface PrivacyToggleProps {
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  initialValue?: boolean;
}

const PrivacyToggle = ({
  label,
  description,
  icon,
  initialValue = false,
}: PrivacyToggleProps) => {
  const [isEnabled, setIsEnabled] = useState(initialValue);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View style={styles.toggleItem}>
      <View style={styles.toggleHeader}>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: withAlpha(theme.colors.primary, 0.1) },
          ]}
        >
          <Ionicons name={icon} size={20} color={theme.colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.toggleLabel}>{label}</Text>
          <Text style={styles.toggleDescription}>{description}</Text>
        </View>
        <Switch
          trackColor={{
            false: theme.colors.surfaceBright,
            true: theme.colors.primary,
          }}
          thumbColor={theme.colors.white}
          ios_backgroundColor={theme.colors.surfaceBright}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
};

export default function PrivacyScreen() {
  return (
    <AccountSubPage title="Privacy & Security">
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Social Privacy</Text>
        <View style={styles.section}>
          <PrivacyToggle
            label="Private Profile"
            description="Only followers can see your playlists and activity."
            icon="lock-closed-outline"
            initialValue={true}
          />
          <View style={styles.divider} />
          <PrivacyToggle
            label="Listening Activity"
            description="Show what you're listening to on your profile."
            icon="headset-outline"
            initialValue={true}
          />
          <View style={styles.divider} />
          <PrivacyToggle
            label="Recently Played Artists"
            description="Display your top artists from the last 30 days."
            icon="people-outline"
            initialValue={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Data & Security</Text>
        <View style={styles.section}>
          <PrivacyToggle
            label="Two-Factor Auth"
            description="Add an extra layer of security to your account."
            icon="shield-checkmark-outline"
            initialValue={true}
          />
          <View style={styles.divider} />
          <PrivacyToggle
            label="Marketing Emails"
            description="Receive updates about new features and tracks."
            icon="mail-unread-outline"
            initialValue={false}
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
  toggleItem: {
    padding: 16,
  },
  toggleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginBottom: 2,
  },
  toggleDescription: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    marginLeft: 72,
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.2),
  },
});
