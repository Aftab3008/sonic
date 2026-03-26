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
import { BlurView } from "expo-blur";
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
    },
  });

  const handleSignUp: SubmitHandler<SignUpFormData> = async (data) => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
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
          blurRadius={20}
        />
        <Image
          source={ASSETS.abstractImageLeft}
          style={styles.abstractImageLeft}
          blurRadius={20}
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
          <Text
            style={[
              styles.errorText,
              { textAlign: "center", marginBottom: 16, marginTop: -16 },
            ]}
          >
            {errors.root.message}
          </Text>
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
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignIn("google")}
            >
              <BlurView
                intensity={10}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
              />
              <GoogleIcon size={18} color={theme.colors.onSurface} />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialSignIn("apple")}
            >
              <BlurView
                intensity={10}
                tint="dark"
                style={StyleSheet.absoluteFillObject}
              />
              <AppleIcon size={18} color={theme.colors.onSurface} />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By signing up, you agree to our{" "}
            <Text style={styles.footerLink}>Terms of Service</Text> and{" "}
            <Text style={styles.footerLink}>Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
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
    opacity: 0.2,
    borderRadius: 16,
  },
  abstractImageLeft: {
    position: "absolute",
    bottom: "25%",
    left: -80,
    width: 192,
    height: 256,
    opacity: 0.2,
    borderRadius: 16,
    transform: [{ rotate: "12deg" }],
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    zIndex: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    height: 40,
    width: 120,
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
    fontSize: 44,
    fontWeight: "800",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.headline,
    letterSpacing: -1,
  },
  primaryText: {
    color: theme.colors.primary,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    lineHeight: 24,
  },
  formSection: {
    width: "100%",
    gap: 16,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  joinButton: {
    marginTop: 16,
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
    paddingVertical: 24,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(73, 68, 84, 0.3)",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.outline,
    letterSpacing: 2,
  },
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 10,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.2)",
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceContainerLow,
  },
  socialButtonText: {
    color: theme.colors.onSurface,
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    marginTop: 32,
    maxWidth: 280,
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    color: theme.colors.outline,
    lineHeight: 18,
  },
  footerLink: {
    textDecorationLine: "underline",
  },
});
