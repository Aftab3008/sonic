import { AppleIcon, GoogleIcon } from "@/components/ui/Icons";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { moderateFontScale, moderateScale } from "@/lib/scaling";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

export function SocialButtons() {
  const handleSocialSignIn = async (provider: "google" | "apple") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/(root)/(tabs)",
      });
      if (error) {
        Alert.alert("Social Login Failed", error.message);
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <LinearGradient
          colors={[
            "transparent",
            theme.colors.outlineVariant + "40",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dividerGradient}
        />
        <ThemedText style={styles.dividerText}>OR</ThemedText>
        <LinearGradient
          colors={[
            "transparent",
            theme.colors.outlineVariant + "40",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.dividerGradient}
        />
      </View>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialSignIn("google")}
          activeOpacity={0.7}
        >
          <GoogleIcon size={18} color={theme.colors.onSurface} />
          <ThemedText style={styles.socialButtonText}>Google</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => handleSocialSignIn("apple")}
          activeOpacity={0.7}
        >
          <AppleIcon size={18} color={theme.colors.onSurface} />
          <ThemedText style={styles.socialButtonText}>Apple</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(16),
    gap: moderateScale(16),
  },
  dividerGradient: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: moderateFontScale(11),
    fontWeight: "700",
    color: theme.colors.outline,
    letterSpacing: 2,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: moderateScale(12),
    width: "100%",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateScale(16),
    gap: moderateScale(10),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "30",
  },
  socialButtonText: {
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(14),
    fontWeight: "600",
  },
});
