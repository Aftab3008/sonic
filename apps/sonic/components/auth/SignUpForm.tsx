import { GlassInput } from "@/components/ui/GlassInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { moderateFontScale, moderateScale, scale } from "@/lib/scaling";
import { SignUpFormData, SignUpSchema } from "@/lib/schema/auth.schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "expo-checkbox";
import * as Haptics from "expo-haptics";
import { useState, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { ThemedText } from "../themed-text";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
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

  useFocusEffect(
    useCallback(() => {
      clearErrors("root");
    }, [clearErrors]),
  );

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

  return (
    <View style={styles.container}>
      {errors.root && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={18} color={theme.colors.error} />
          <ThemedText style={styles.rootErrorText}>
            {errors.root.message}
          </ThemedText>
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
              {error && (
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              )}
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
              {error && (
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              )}
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
              {error && (
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              )}
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
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={theme.colors.outline}
                    />
                  </TouchableOpacity>
                }
              />
              {error && (
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              )}
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onChange(!value);
                }}
                activeOpacity={0.7}
              >
                <Checkbox
                  style={styles.checkbox}
                  value={value}
                  onValueChange={(val) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    onChange(val);
                  }}
                  color={
                    value
                      ? theme.colors.primaryContainer
                      : theme.colors.outlineVariant
                  }
                />
                <ThemedText style={styles.checkboxLabel}>
                  I agree to the{" "}
                  <ThemedText style={styles.footerLink}>
                    Terms of Service
                  </ThemedText>{" "}
                  and{" "}
                  <ThemedText style={styles.footerLink}>
                    Privacy Policy
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
              {error && (
                <ThemedText style={styles.errorText}>
                  {error.message}
                </ThemedText>
              )}
            </View>
          )}
        />

        <GradientButton
          title="Join Sonic"
          isLoading={loading}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSubmit(handleSignUp)();
          }}
          containerStyle={styles.joinButton}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  formSection: {
    width: "100%",
    gap: moderateScale(10),
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
});
