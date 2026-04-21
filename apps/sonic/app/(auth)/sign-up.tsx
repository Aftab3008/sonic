import { SignUpForm } from "@/components/auth/SignUpForm";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { ThemedText } from "@/components/themed-text";
import { PrismBackground } from "@/components/ui/PrismBackground";
import { theme } from "@/constants/theme";
import { moderateFontScale, moderateScale, scale } from "@/lib/scaling";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function SignUpScreen() {
  return (
    <PrismBackground
      useScroll={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        style={styles.content}
      >
        <View style={styles.heroSection}>
          <ThemedText style={styles.headline}>CREATE</ThemedText>
          <ThemedText style={styles.headline}>YOUR WAVE</ThemedText>
          <ThemedText style={styles.subtitle}>
            Join the Sonic prism and define your sound today.
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <SignUpForm />
          <SocialButtons />
        </View>

        <View style={styles.footerContainer}>
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            style={styles.secondaryActions}
          >
            <View style={styles.loginPromptRow}>
              <ThemedText style={styles.loginPromptText}>
                ALREADY PART OF THE WAVE?{" "}
              </ThemedText>
              <Link href="/login" asChild>
                <Pressable onPress={() => Haptics.selectionAsync()}>
                  <ThemedText style={styles.loginLink}>LOG IN</ThemedText>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </View>
      </Animated.View>
    </PrismBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: moderateScale(32), // Reduced for v4
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    width: "100%",
    maxWidth: scale(450),
    alignSelf: "center",
    justifyContent: "space-between",
  },
  heroSection: {
    width: "100%",
    paddingLeft: moderateScale(10),
    marginTop: moderateScale(0),
  },
  headline: {
    fontSize: moderateFontScale(44),
    fontWeight: "900",
    color: theme.colors.white,
    fontFamily: theme.typography.headline,
    letterSpacing: -2.5,
    lineHeight: moderateFontScale(40),
    textAlign: "left",
    textTransform: "uppercase",
  },
  subtitle: {
    marginTop: moderateScale(16),
    fontSize: moderateFontScale(16),
    fontWeight: "600",
    color: theme.colors.white,
    opacity: 0.5,
    lineHeight: moderateFontScale(24),
    maxWidth: "85%",
  },
  formContainer: {
    width: "100%",
    marginVertical: moderateScale(16),
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
  },
  secondaryActions: {
    width: "100%",
    marginBottom: moderateScale(20),
    alignItems: "center",
  },
  loginPromptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8),
  },
  loginPromptText: {
    color: theme.colors.white,
    opacity: 0.4,
    fontWeight: "800",
    fontSize: moderateFontScale(12),
    letterSpacing: 1.2,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "900",
    fontSize: moderateFontScale(12),
    letterSpacing: 1.2,
    textDecorationLine: "underline",
  },
});
