import { AccountSubPage } from "@/components/account/AccountSubPage";
import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface InfoFieldProps {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const InfoField = ({ label, value, icon }: InfoFieldProps) => (
  <View style={styles.fieldContainer}>
    <View style={styles.fieldHeader}>
      <Ionicons name={icon} size={16} color={theme.colors.onSurfaceVariant} />
      <Text style={styles.fieldLabel}>{label}</Text>
    </View>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        defaultValue={value}
        placeholderTextColor={withAlpha(theme.colors.onSurfaceVariant, 0.4)}
      />
    </View>
  </View>
);

export default function PersonalInfoScreen() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <AccountSubPage title="Personal Information">
      <View style={styles.container}>
        <View style={styles.section}>
          <InfoField
            label="Full Name"
            value={user?.name || "Music Lover"}
            icon="person-outline"
          />
          <InfoField
            label="Email Address"
            value={user?.email || "vibe@sonic.app"}
            icon="mail-outline"
          />
          <InfoField
            label="Phone Number"
            value="+1 (555) 000-0000"
            icon="call-outline"
          />
          <InfoField
            label="Username"
            value="@vanguard_listener"
            icon="at-outline"
          />
        </View>

        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </AccountSubPage>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
  },
  section: {
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.4),
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.2),
    marginBottom: 32,
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginLeft: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputWrapper: {
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.2),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.1),
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: theme.colors.onPrimary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
