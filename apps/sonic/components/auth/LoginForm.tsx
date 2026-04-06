import { GlassInput } from "@/components/ui/GlassInput";
import { GradientButton } from "@/components/ui/GradientButton";
import { theme } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { moderateFontScale, moderateScale } from "@/lib/scaling";
import { LoginFormData, LoginSchema } from "@/lib/schema/auth.schema";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Haptics from "expo-haptics";
import { useState, useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { ThemedText } from "../themed-text";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useFocusEffect(
    useCallback(() => {
      clearErrors("root");
    }, [clearErrors]),
  );

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
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
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

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity
            onPress={() =>
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <ThemedText style={styles.forgotPasswordText}>
              Forgot password?
            </ThemedText>
          </TouchableOpacity>
        </View>

        <GradientButton
          title="Sign In"
          isLoading={loading}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            handleSubmit(handleSignIn)();
          }}
          containerStyle={styles.signInButton}
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
});
