import { BlurView } from "expo-blur";
import { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import { theme, withAlpha } from "../../constants/theme";
import { moderateFontScale, moderateScale, scale } from "../../lib/scaling";
import { ThemedText } from "../themed-text";

interface GlassInputProps extends TextInputProps {
  label?: string;
  containerStyle?: object;
  rightElement?: React.ReactNode;
  immersive?: boolean;
}

export function GlassInput({
  label,
  containerStyle,
  rightElement,
  onFocus,
  onBlur,
  immersive = false,
  ...props
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View
          style={[
            styles.labelContainer,
            immersive && styles.immersiveLabelContainer,
          ]}
        >
          <ThemedText
            style={[
              styles.label,
              isFocused && styles.labelFocused,
              immersive && styles.immersiveLabel,
            ]}
          >
            {label.toUpperCase()}
          </ThemedText>
        </View>
      )}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          immersive && styles.immersiveInputWrapper,
        ]}
      >
        <BlurView
          intensity={immersive ? 40 : 25}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <TextInput
          style={[
            styles.input,
            rightElement ? { paddingRight: scale(54) } : null,
            immersive && styles.immersiveInput,
          ]}
          placeholderTextColor={theme.colors.outline + "66"}
          cursorColor={theme.colors.primary}
          selectionColor={theme.colors.primary + "40"}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightElement && (
          <View style={styles.rightElement}>{rightElement}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: moderateScale(8),
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: moderateScale(-8),
    left: moderateScale(20),
    backgroundColor: "#050508",
    paddingHorizontal: moderateScale(6),
    borderRadius: moderateScale(4),
    zIndex: 20,
  },
  label: {
    fontSize: moderateFontScale(10.5),
    fontWeight: "800",
    color: theme.colors.outline,
    letterSpacing: 2,
  },
  labelFocused: {
    color: theme.colors.primary,
  },
  immersiveLabelContainer: {
    backgroundColor: "transparent",
    top: moderateScale(-9),
    left: moderateScale(16),
  },
  immersiveLabel: {
    color: theme.colors.white,
    opacity: 0.6,
    fontWeight: "900",
    fontSize: moderateFontScale(10.5),
    letterSpacing: 2.5,
  },
  inputWrapper: {
    width: "100%",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.6),
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant + "40",
  },
  immersiveInputWrapper: {
    backgroundColor: "transparent",
    borderColor: withAlpha(theme.colors.white, 0.1),
    borderRadius: moderateScale(22),
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary + "99",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(12),
    // Removed elevation: 4 to prevent gray overlay/shadow issues
  },
  input: {
    paddingHorizontal: moderateScale(20),
    height: moderateScale(48),
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(14),
    fontFamily: theme.typography.body,
    fontWeight: "600",
    textAlignVertical: "center",
  },
  immersiveInput: {
    height: moderateScale(52),
    color: theme.colors.white,
    letterSpacing: 0.5,
    backgroundColor: "transparent", // Explicitly transparent
  },
  rightElement: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: scale(54),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
});
