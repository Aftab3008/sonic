import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { useState } from "react";
import { router } from "expo-router";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.iconButton}
      activeOpacity={0.7}
      disabled={loading}
      onPress={handleLogout}
    >
      <View style={styles.iconButtonBg}>
        {loading ? (
          <ActivityIndicator size="small" color={theme.colors.onSurface} />
        ) : (
          <Ionicons
            name="log-out-outline"
            size={20}
            color={theme.colors.onSurface}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconButton: {},
  iconButtonBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
});
