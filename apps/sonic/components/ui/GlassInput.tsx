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
}

export function GlassInput({
  label,
  containerStyle,
  rightElement,
  onFocus,
  onBlur,
  ...props
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <ThemedText style={[styles.label, isFocused && styles.labelFocused]}>
            {label.toUpperCase()}
          </ThemedText>
        </View>
      )}
      <View
        style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
      >
        <BlurView
          intensity={25}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <TextInput
          style={[
            styles.input,
            rightElement ? { paddingRight: scale(54) } : null,
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
    backgroundColor: theme.colors.surface,
    paddingHorizontal: moderateScale(6),
    borderRadius: moderateScale(8),
    zIndex: 20,
  },
  label: {
    fontSize: moderateFontScale(10),
    fontWeight: "700",
    color: theme.colors.outline,
    letterSpacing: 1.5,
  },
  labelFocused: {
    color: theme.colors.primary,
  },
  inputWrapper: {
    width: "100%",
    borderRadius: moderateScale(16),
    overflow: "hidden",
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.6),
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant + "40",
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary + "80",
  },
  input: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(18),
    color: theme.colors.onSurface,
    fontSize: moderateFontScale(15),
    fontFamily: theme.typography.body,
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
