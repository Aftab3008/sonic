import { SignUpForm } from "@/components/auth/SignUpForm";
import { SocialButtons } from "@/components/auth/SocialButtons";
import { ThemedText } from "@/components/themed-text";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { ASSETS } from "@/constants/assets";
import { theme } from "@/constants/theme";
import {
  moderateFontScale,
  moderateScale,
  scale,
  verticalScale,
} from "@/lib/scaling";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function SignUpScreen() {
  return (
    <ScreenWrapper
      useScroll={true}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.decorationContainer} pointerEvents="none">
        <Image
          source={ASSETS.abstractImageRight}
          style={styles.abstractImageRight}
          blurRadius={30}
          contentFit="cover"
          transition={500}
        />
        <Image
          source={ASSETS.abstractImageLeft}
          style={styles.abstractImageLeft}
          blurRadius={30}
          contentFit="cover"
          transition={500}
        />
      </View>

      <Animated.View
        entering={FadeInDown.duration(600).springify()}
        style={styles.content}
      >
        <View style={styles.heroSection}>
          <ThemedText style={styles.headline}>
            Join the <ThemedText style={styles.primaryText}>Sonic</ThemedText>{" "}
            world.
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Create your account to start your music journey.
          </ThemedText>
        </View>

        <BlurView intensity={20} tint="dark" style={styles.glassCard}>
          <SignUpForm />

          <View style={{ marginTop: moderateScale(16) }}>
            <SocialButtons />
          </View>
        </BlurView>

        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={styles.secondaryActions}
        >
          <View style={styles.loginPromptRow}>
            <ThemedText style={styles.loginPromptText}>
              Already have an account?{" "}
            </ThemedText>
            <Link href="/login" asChild>
              <Pressable onPress={() => Haptics.selectionAsync()}>
                <ThemedText style={styles.loginLink}>Log in</ThemedText>
              </Pressable>
            </Link>
          </View>
        </Animated.View>
      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: moderateScale(40),
    justifyContent: "center",
    minHeight: "100%",
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  abstractImageRight: {
    position: "absolute",
    top: "15%",
    right: scale(-100),
    width: scale(300),
    height: verticalScale(350),
    opacity: 0.15,
    borderRadius: moderateScale(30),
  },
  abstractImageLeft: {
    position: "absolute",
    bottom: "15%",
    left: scale(-80),
    width: scale(220),
    height: verticalScale(280),
    opacity: 0.15,
    borderRadius: moderateScale(20),
    transform: [{ rotate: "12deg" }],
  },
  content: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(32),
    alignItems: "center",
    width: "100%",
    maxWidth: scale(400),
    alignSelf: "center",
  },
  heroSection: {
    width: "100%",
    marginBottom: moderateScale(32),
  },
  headline: {
    fontSize: moderateFontScale(40),
    fontWeight: "800",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.headline,
    letterSpacing: -1,
    lineHeight: moderateFontScale(48),
    paddingTop: moderateScale(8),
  },
  primaryText: {
    color: theme.colors.primary,
    fontSize: moderateFontScale(40),
    fontWeight: "800",
    fontFamily: theme.typography.headline,
    letterSpacing: -1,
    lineHeight: moderateFontScale(48),
  },
  subtitle: {
    marginTop: moderateScale(12),
    fontSize: moderateFontScale(15),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    lineHeight: moderateFontScale(22),
  },
  glassCard: {
    width: "100%",
    borderRadius: moderateScale(24),
    padding: moderateScale(24),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(0,0,0,0.2)",
    overflow: "hidden",
  },
  secondaryActions: {
    width: "100%",
    marginTop: moderateScale(40),
    alignItems: "center",
  },
  loginPromptRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginPromptText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
    fontSize: moderateFontScale(15),
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: moderateFontScale(15),
  },
});
