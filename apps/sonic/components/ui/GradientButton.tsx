import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
  StyleSheet,
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
import { ThemedText } from "../themed-text";

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  colors?: [string, string, ...string[]];
  containerStyle?: object;
  isLoading?: boolean;
}

export function GradientButton({
  title,
  colors = [theme.colors.primaryContainer, theme.colors.primary],
  containerStyle,
  style,
  disabled,
  isLoading,
  ...props
}: GradientButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[styles.container, containerStyle]}
      disabled={isDisabled}
      {...props}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, style]}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.onPrimary} size="small" />
        ) : (
          <ThemedText style={styles.text}>{title}</ThemedText>
        )}
      </LinearGradient>
      {isDisabled && <View style={styles.disabledOverlay} />}
      {!isDisabled && <View style={styles.shadow} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  gradient: {
    paddingVertical: moderateScale(18),
    borderRadius: moderateScale(16),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    minHeight: moderateScale(56),
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surfaceContainerHighest,
    opacity: 0.6,
    borderRadius: moderateScale(16),
    zIndex: 3,
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
    zIndex: 1,
    elevation: 8,
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.35,
    shadowRadius: moderateScale(16),
  },
});
