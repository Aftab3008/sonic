import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { theme } from "../../constants/theme";
import {
  moderateFontScale,
  moderateScale,
  verticalScale,
} from "../../lib/scaling";

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  colors?: [string, string, ...string[]];
  containerStyle?: object;
}

export function GradientButton({
  title,
  colors = [theme.colors.primaryContainer, theme.colors.primary],
  containerStyle,
  style,
  disabled,
  ...props
}: GradientButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.container, containerStyle, disabled && styles.disabled]}
      disabled={disabled}
      {...props}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, style]}
      >
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
      <View style={styles.shadow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  disabled: {
    opacity: 0.5,
  },
  gradient: {
    paddingVertical: moderateScale(18),
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  text: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: moderateFontScale(16),
    letterSpacing: 0.5,
    fontFamily: theme.typography.body,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: moderateScale(16),
    opacity: 0.25,
    top: moderateScale(6),
    bottom: moderateScale(-6),
    zIndex: 1,
    elevation: 8,
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(16),
  },
});
