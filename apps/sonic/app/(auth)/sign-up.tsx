import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/constants/theme";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { GlassInput } from "@/components/ui/GlassInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { AppleIcon, GoogleIcon } from "@/components/ui/Icons";
import { ASSETS } from "@/constants/assets";
import { authClient } from "@/lib/auth/auth-client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormData, SignUpSchema } from "@/lib/schema/auth.schema";
import Checkbox from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";

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
                    color={value ? theme.colors.primaryContainer : theme.colors.outlineVariant}
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
              colors={["transparent", theme.colors.outlineVariant + "40", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.dividerGradient}
            />
            <Text style={styles.dividerText}>OR</Text>
            <LinearGradient
              colors={["transparent", theme.colors.outlineVariant + "40", "transparent"]}
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
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginHorizontal: 24,
    marginBottom: 20,
    marginTop: -10,
    borderWidth: 1,
    borderColor: theme.colors.error + "30",
    gap: 10,
  },
  rootErrorText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  decorationContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  abstractImageRight: {
    position: "absolute",
    top: "25%",
    right: -80,
    width: 250,
    height: 320,
    opacity: 0.12,
    borderRadius: 16,
  },
  abstractImageLeft: {
    position: "absolute",
    bottom: "25%",
    left: -80,
    width: 192,
    height: 256,
    opacity: 0.12,
    borderRadius: 16,
    transform: [{ rotate: "12deg" }],
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  heroSection: {
    width: "100%",
    marginBottom: 32,
  },
  headline: {
    fontSize: 40,
    fontWeight: "800",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.headline,
    letterSpacing: -1,
  },
  primaryText: {
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    lineHeight: 22,
  },
  formSection: {
    width: "100%",
    gap: 10,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 8,
    fontWeight: "500",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
    paddingHorizontal: 4,
  },
  checkbox: {
    marginRight: 12,
    borderRadius: 6,
    width: 20,
    height: 20,
  },
  checkboxLabel: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 19,
    flex: 1,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  joinButton: {
    marginTop: 12,
  },
  secondaryActions: {
    width: "100%",
    marginTop: 32,
    alignItems: "center",
  },
  loginPromptRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginPromptText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
    fontSize: 15,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    width: "100%",
    gap: 16,
  },
  dividerGradient: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.outline,
    letterSpacing: 2,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "30",
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  socialButtonText: {
    color: theme.colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
  },
});
