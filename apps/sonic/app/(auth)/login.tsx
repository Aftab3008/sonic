import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
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
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, LoginSchema } from "@/lib/schema/auth.schema";

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
        setError("root", {
          type: "server",
          message: error.message || "Invalid credentials",
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
      // Note: On native, navigation might need to be handled after redirect back
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Image source={ASSETS.appLogo} style={styles.logo} />
            <Text style={styles.subtitle}>Experience the Sonic Prism.</Text>
          </View>

          {errors.root && (
            <Text
              style={[
                styles.errorText,
                { textAlign: "center", marginBottom: 16, marginTop: -24 },
              ]}
            >
              {errors.root.message}
            </Text>
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
                  intensity={20}
                  tint="dark"
                  style={StyleSheet.absoluteFillObject}
                />
                <GoogleIcon size={20} color={theme.colors.onSurface} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialSignIn("apple")}
              >
                <BlurView
                  intensity={20}
                  tint="dark"
                  style={StyleSheet.absoluteFillObject}
                />
                <AppleIcon size={20} color={theme.colors.onSurface} />
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
            <TouchableOpacity>
              <Text style={styles.bottomLinkText}>TERMS</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  content: {
    alignItems: "center",
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logo: {
    height: 128,
    width: 128,
    borderRadius: 64,
    marginBottom: 16,
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.5,
    opacity: 0.8,
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  signInButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(73, 68, 84, 0.2)", // outlineVariant/20
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: "700",
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
    gap: 12,
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "rgba(53, 53, 52, 0.4)",
  },
  socialButtonText: {
    color: theme.colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 48,
  },
  signUpPromptText: {
    color: theme.colors.onSurfaceVariant,
    fontWeight: "500",
    fontSize: 16,
  },
  signUpLinkText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 16,
  },
  bottomLinks: {
    flexDirection: "row",
    gap: 24,
    marginTop: 64,
  },
  bottomLinkText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: "rgba(149, 142, 160, 0.4)", // outline/40
  },
});
