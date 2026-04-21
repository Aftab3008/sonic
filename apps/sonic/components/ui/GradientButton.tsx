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
  pill?: boolean;
}

export function GradientButton({
  title,
  colors = [theme.colors.primaryContainer, theme.colors.primary],
  containerStyle,
  style,
  disabled,
  isLoading,
  pill = false,
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
        style={[
          styles.gradient, 
          style, 
          pill && { borderRadius: theme.borderRadius.full }
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.colors.onPrimary} size="small" />
        ) : (
          <ThemedText style={styles.text}>{title}</ThemedText>
        )}
      </LinearGradient>
      {isDisabled && (
        <View style={[
          styles.disabledOverlay, 
          pill && { borderRadius: theme.borderRadius.full }
        ]} />
      )}
      {!isDisabled && (
        <View style={[
          styles.shadow, 
          pill && { borderRadius: theme.borderRadius.full }
        ]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    position: "relative",
  },
  gradient: {
    paddingVertical: moderateScale(22),
    borderRadius: moderateScale(20),
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
    minHeight: moderateScale(64),
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.surfaceContainerHighest,
    opacity: 0.6,
    borderRadius: moderateScale(20),
    zIndex: 3,
  },
  text: {
    color: theme.colors.white,
    fontWeight: "900",
    fontSize: moderateFontScale(16),
    letterSpacing: 1,
    fontFamily: theme.typography.body,
    textTransform: "uppercase",
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: moderateScale(20),
    opacity: 0.4,
    zIndex: 1,
    elevation: 12,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: verticalScale(10) },
    shadowOpacity: 0.5,
    shadowRadius: moderateScale(20),
  },
});
