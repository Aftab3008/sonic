import { LoginForm } from "@/components/auth/LoginForm";
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
import { Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function LoginScreen() {
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
        <View style={styles.header}>
          <View style={styles.logoGlowWrapper}>
            <View style={styles.logoGlow} />
            <Image
              source={ASSETS.appLogo}
              style={styles.logo}
              transition={300}
              contentFit="contain"
            />
          </View>
          <ThemedText style={styles.welcomeText}>Welcome back</ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to continue your journey
          </ThemedText>
        </View>

        <BlurView intensity={20} tint="dark" style={styles.glassCard}>
          <LoginForm />
          <View style={{ marginTop: moderateScale(16) }}>
            <SocialButtons />
          </View>
        </BlurView>

        <Animated.View
          entering={FadeInUp.delay(300).duration(500)}
          style={styles.footer}
        >
          <ThemedText style={styles.signUpPromptText}>
            Don't have an account?{" "}
          </ThemedText>
          <Link href="/sign-up" asChild>
            <Pressable onPress={() => Haptics.selectionAsync()}>
              <ThemedText style={styles.signUpLinkText}>Join us</ThemedText>
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
          <View style={styles.bottomLinkDot} />
          <TouchableOpacity onPress={() => Haptics.selectionAsync()}>
            <ThemedText style={styles.bottomLinkText}>SUPPORT</ThemedText>
          </TouchableOpacity>
        </View>
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
    top: "10%",
    right: scale(-100),
    width: scale(300),
    height: verticalScale(350),
    opacity: 0.15,
    borderRadius: moderateScale(30),
    transform: [{ rotate: "-15deg" }],
  },
  abstractImageLeft: {
    position: "absolute",
    bottom: "20%",
    left: scale(-80),
    width: scale(220),
    height: verticalScale(280),
    opacity: 0.15,
    borderRadius: moderateScale(20),
    transform: [{ rotate: "15deg" }],
  },
  content: {
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(24),
    alignItems: "center",
    width: "100%",
    maxWidth: scale(400),
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: moderateScale(32),
  },
  logoGlowWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(20),
    marginBottom: moderateScale(48),
  },
  logoGlow: {
    position: "absolute",
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: theme.colors.primary,
    opacity: 0.15,
    transform: [{ scale: 1.4 }],
  },
  logo: {
    height: scale(90),
    width: scale(90),
    borderRadius: scale(45),
  },
  welcomeText: {
    fontSize: moderateFontScale(32),
    fontWeight: "800",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.headline,
    letterSpacing: -0.5,
    lineHeight: moderateFontScale(40),
    paddingTop: moderateScale(4),
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(15),
    fontWeight: "500",
    letterSpacing: 0.3,
    marginTop: moderateScale(8),
    opacity: 0.8,
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
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(40),
  },
  signUpPromptText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
    fontSize: moderateFontScale(15),
  },
  signUpLinkText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: moderateFontScale(15),
  },
  bottomLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(16),
    marginTop: moderateScale(40),
  },
  bottomLinkText: {
    fontSize: moderateFontScale(10),
    fontWeight: "700",
    letterSpacing: 2,
    color: theme.colors.outline,
    opacity: 0.5,
  },
  bottomLinkDot: {
    width: scale(3),
    height: scale(3),
    borderRadius: scale(1.5),
    backgroundColor: theme.colors.outline,
    opacity: 0.3,
  },
});
