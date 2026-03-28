import { GlassInput } from "@/components/ui/GlassInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { AppleIcon, GoogleIcon } from "@/components/ui/Icons";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { ASSETS } from "@/constants/assets";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { moderateFontScale, moderateScale, scale } from "@/lib/scaling";
import { LoginFormData, LoginSchema } from "@/lib/schema/auth.schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn: SubmitHandler<LoginFormData> = async (data) => {
    setLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (error) {
        console.log("Sign-in response:", { error });
        setError("root", {
          type: "server",
          message: error.message || "Invalid credentials",
        });
      } else {
        router.replace("/(root)/(tabs)" as any);
      }
    } catch (err: any) {
      console.log("Sign-in error:", err);
      setError("root", {
        type: "server",
        message: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "apple") => {
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
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoGlowWrapper}>
              <View style={styles.logoGlow} />
              <Image source={ASSETS.appLogo} style={styles.logo} />
            </View>
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Error Banner */}
          {errors.root && (
            <View style={styles.errorContainer}>
              <Ionicons
                name="alert-circle"
                size={18}
                color={theme.colors.error}
              />
              <Text style={styles.rootErrorText}>{errors.root.message}</Text>
            </View>
          )}

          <View style={styles.formSection}>
            <Controller
              control={control}
              name="email"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <GlassInput
                    label="Email Address"
                    placeholder="name@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <View>
                  <GlassInput
                    label="Password"
                    placeholder="••••••••"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    rightElement={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color={theme.colors.outline}
                        />
                      </TouchableOpacity>
                    }
                  />
                  {error && (
                    <Text style={styles.errorText}>{error.message}</Text>
                  )}
                </View>
              )}
            />

            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <GradientButton
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleSubmit(handleSignIn)}
              containerStyle={styles.signInButton}
              disabled={loading}
            />

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
              <Text style={styles.dividerText}>OR</Text>
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
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignIn("apple")}
                activeOpacity={0.7}
              >
                <AppleIcon size={18} color={theme.colors.onSurface} />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.signUpPromptText}>Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <Pressable>
                <Text style={styles.signUpLinkText}>Join us</Text>
              </Pressable>
            </Link>
          </View>

          <View style={styles.bottomLinks}>
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>PRIVACY</Text>
            </TouchableOpacity>
            <View style={styles.bottomLinkDot} />
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>TERMS</Text>
            </TouchableOpacity>
            <View style={styles.bottomLinkDot} />
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>SUPPORT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(48),
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: scale(400),
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: moderateScale(40),
  },
  logoGlowWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(24),
  },
  logoGlow: {
    position: "absolute",
    width: scale(120),
    height: scale(120),
    borderRadius: scale(60),
    backgroundColor: theme.colors.primaryContainer,
    opacity: 0.12,
    transform: [{ scale: 1.5 }],
  },
  logo: {
    height: scale(100),
    width: scale(100),
    borderRadius: scale(50),
  },
  welcomeText: {
    fontSize: moderateFontScale(28),
    fontWeight: "800",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.headline,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(15),
    fontWeight: "500",
    letterSpacing: 0.3,
    marginTop: moderateScale(8),
    opacity: 0.8,
  },
  formSection: {
    width: "100%",
    gap: moderateScale(12),
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.errorContainer + "20",
    padding: moderateScale(14),
    borderRadius: moderateScale(14),
    marginBottom: moderateScale(20),
    width: "100%",
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    gap: moderateScale(10),
  },
  rootErrorText: {
    color: theme.colors.error,
    fontSize: moderateFontScale(14),
    fontWeight: "600",
    flex: 1,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: moderateFontScale(12),
    marginTop: moderateScale(4),
    marginLeft: moderateScale(8),
    fontWeight: "500",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: moderateScale(4),
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: moderateFontScale(14),
    fontWeight: "600",
  },
  signInButton: {
    marginTop: moderateScale(8),
    marginBottom: moderateScale(8),
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
    marginTop: moderateScale(48),
  },
  bottomLinkText: {
    fontSize: moderateFontScale(10),
    fontWeight: "700",
    letterSpacing: 2,
    color: theme.colors.outline,
    opacity: 0.4,
  },
  bottomLinkDot: {
    width: scale(3),
    height: scale(3),
    borderRadius: scale(1.5),
    backgroundColor: theme.colors.outline,
    opacity: 0.2,
  },
});
