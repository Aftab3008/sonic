import { GlassInput } from "@/components/ui/GlassInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { AppleIcon, GoogleIcon } from "@/components/ui/Icons";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { ASSETS } from "@/constants/assets";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import {
  moderateFontScale,
  moderateScale,
  scale,
  verticalScale,
} from "@/lib/scaling";
import { SignUpFormData, SignUpSchema } from "@/lib/schema/auth.schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const handleSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        termsAccepted: data.termsAccepted,
        callbackURL: "/(root)/(tabs)",
      });

      if (error) {
        setError("root", {
          type: "server",
          message: error.message || "Sign Up Failed",
        });
      } else {
        router.replace("/(root)/(tabs)" as any);
      }
    } catch (err: any) {
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
    <ScreenWrapper
      useScroll={true}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.decorationContainer} pointerEvents="none">
        <Image
          source={ASSETS.abstractImageRight}
          style={styles.abstractImageRight}
          blurRadius={25}
        />
        <Image
          source={ASSETS.abstractImageLeft}
          style={styles.abstractImageLeft}
          blurRadius={25}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.heroSection}>
          <Text style={styles.headline}>
            Join the <Text style={styles.primaryText}>Sonic</Text> world.
          </Text>
          <Text style={styles.subtitle}>
            Create your account to start your music journey.
          </Text>
        </View>

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
            name="name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <GlassInput
                  label="Full Name"
                  placeholder="Enter your name"
                  value={value}
                  onChangeText={onChange}
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <GlassInput
                  label="Email Address"
                  placeholder="hello@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
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
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={theme.colors.outline}
                      />
                    </TouchableOpacity>
                  }
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <GlassInput
                  label="Confirm Password"
                  placeholder="••••••••"
                  secureTextEntry={!showConfirmPassword}
                  value={value}
                  onChangeText={onChange}
                  rightElement={
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-off-outline"
                            : "eye-outline"
                        }
                        size={20}
                        color={theme.colors.outline}
                      />
                    </TouchableOpacity>
                  }
                />
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="termsAccepted"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => onChange(!value)}
                  activeOpacity={0.7}
                >
                  <Checkbox
                    style={styles.checkbox}
                    value={value}
                    onValueChange={onChange}
                    color={
                      value
                        ? theme.colors.primaryContainer
                        : theme.colors.outlineVariant
                    }
                  />
                  <Text style={styles.checkboxLabel}>
                    I agree to the{" "}
                    <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
                {error && <Text style={styles.errorText}>{error.message}</Text>}
              </View>
            )}
          />

          <GradientButton
            title={loading ? "Joining..." : "Join Sonic"}
            onPress={handleSubmit(handleSignUp)}
            containerStyle={styles.joinButton}
            disabled={loading}
          />
        </View>

        <View style={styles.secondaryActions}>
          <View style={styles.loginPromptRow}>
            <Text style={styles.loginPromptText}>
              Already have an account?{" "}
            </Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.loginLink}>Log in</Text>
              </Pressable>
            </Link>
          </View>

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
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.errorContainer + "20",
    paddingVertical: moderateScale(14),
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(14),
    marginHorizontal: moderateScale(24),
    marginBottom: moderateScale(20),
    marginTop: moderateScale(-10),
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
  scrollContent: {
    paddingBottom: moderateScale(40),
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  abstractImageRight: {
    position: "absolute",
    top: "25%",
    right: scale(-80),
    width: scale(250),
    height: verticalScale(320),
    opacity: 0.12,
    borderRadius: moderateScale(16),
  },
  abstractImageLeft: {
    position: "absolute",
    bottom: "25%",
    left: scale(-80),
    width: scale(192),
    height: verticalScale(256),
    opacity: 0.12,
    borderRadius: moderateScale(16),
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
  },
  primaryText: {
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: moderateScale(12),
    fontSize: moderateFontScale(15),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    lineHeight: moderateFontScale(22),
  },
  formSection: {
    width: "100%",
    gap: moderateScale(10),
  },
  errorText: {
    color: theme.colors.error,
    fontSize: moderateFontScale(12),
    marginTop: moderateScale(4),
    marginLeft: moderateScale(8),
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScale(8),
    paddingHorizontal: moderateScale(4),
  },
  checkbox: {
    marginRight: moderateScale(12),
    borderRadius: moderateScale(6),
    width: scale(20),
    height: scale(20),
  },
  checkboxLabel: {
    fontSize: moderateFontScale(13),
    color: theme.colors.onSurfaceVariant,
    lineHeight: moderateFontScale(19),
    flex: 1,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  joinButton: {
    marginTop: moderateScale(12),
  },
  secondaryActions: {
    width: "100%",
    marginTop: moderateScale(32),
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
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(20),
    width: "100%",
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
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "30",
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  socialButtonText: {
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(14),
    fontWeight: "600",
  },
});
