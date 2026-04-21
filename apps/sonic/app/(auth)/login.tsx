import { LoginForm } from "@/components/auth/LoginForm";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { ThemedText } from "@/components/themed-text";
import { PrismBackground } from "@/components/ui/PrismBackground";
import { theme } from "@/constants/theme";
import { moderateFontScale, moderateScale, scale } from "@/lib/scaling";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function LoginScreen() {
  return (
    <PrismBackground
      useScroll={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View
        entering={FadeInDown.duration(800).springify()}
        style={styles.content}
      >
        <View style={styles.header}>
          <ThemedText style={styles.welcomeText}>TUNE INTO</ThemedText>
          <ThemedText style={styles.welcomeText}>SONIC</ThemedText>

          <ThemedText style={styles.subtitle}>
            Enter the Sonic prism and resume your musical journey.
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <LoginForm />
          <SocialButtons />
        </View>

        <View style={styles.footerContainer}>
          <Animated.View
            entering={FadeInUp.delay(500).duration(600)}
            style={styles.footer}
          >
            <ThemedText style={styles.signUpPromptText}>
              DON'T HAVE AN ACCOUNT?{" "}
            </ThemedText>
            <Link href="/sign-up" asChild>
              <Pressable onPress={() => Haptics.selectionAsync()}>
                <ThemedText style={styles.signUpLinkText}>JOIN US</ThemedText>
              </Pressable>
            </Link>
          </Animated.View>

          <View style={styles.bottomLinks}>
            <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
              <ThemedText style={styles.bottomLinkText}>PRIVACY</ThemedText>
            </TouchableOpacity>
            <View style={styles.bottomLinkDot} />
            <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
              <ThemedText style={styles.bottomLinkText}>TERMS</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </PrismBackground>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: moderateScale(40),
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    width: "100%",
    maxWidth: scale(450),
    alignSelf: "center",
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-start",
    width: "100%",
    paddingLeft: moderateScale(10),
    marginTop: moderateScale(10),
  },
  welcomeText: {
    fontSize: moderateFontScale(44),
    fontWeight: "900",
    color: theme.colors.white,
    fontFamily: theme.typography.headline,
    letterSpacing: -2.5,
    lineHeight: moderateFontScale(40),
    textTransform: "uppercase",
  },
  subtitle: {
    color: theme.colors.white,
    fontSize: moderateFontScale(16),
    fontWeight: "600",
    letterSpacing: 0.2,
    marginTop: moderateScale(16),
    opacity: 0.5,
    maxWidth: "90%",
  },
  formContainer: {
    width: "100%",
    marginVertical: moderateScale(20),
  },
  footerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8),
    marginBottom: moderateScale(24),
  },
  signUpPromptText: {
    color: theme.colors.white,
    opacity: 0.4,
    fontWeight: "800",
    fontSize: moderateFontScale(12),
    letterSpacing: 1.2,
  },
  signUpLinkText: {
    color: theme.colors.primary,
    fontWeight: "900",
    fontSize: moderateFontScale(12),
    letterSpacing: 1.2,
    textDecorationLine: "underline",
  },
  bottomLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(16),
    opacity: 0.3,
  },
  bottomLinkText: {
    fontSize: moderateFontScale(9),
    fontWeight: "900",
    letterSpacing: 2,
    color: theme.colors.white,
  },
  bottomLinkDot: {
    width: scale(2),
    height: scale(2),
    borderRadius: scale(1),
    backgroundColor: theme.colors.white,
  },
});
