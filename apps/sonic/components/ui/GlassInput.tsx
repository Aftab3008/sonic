import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  Text,
} from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../../constants/theme";

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
          <Text style={[styles.label, isFocused && styles.labelFocused]}>
            {label.toUpperCase()}
          </Text>
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
          style={[styles.input, rightElement ? { paddingRight: 54 } : null]}
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
    marginVertical: 8,
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: -8,
    left: 20,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 6,
    borderRadius: 8,
    zIndex: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.outline,
    letterSpacing: 1.5,
  },
  labelFocused: {
    color: theme.colors.primary,
  },
  inputWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(22, 22, 31, 0.6)",
    borderWidth: 1.5,
    borderColor: theme.colors.outlineVariant + "40",
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary + "80",
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    color: theme.colors.onSurface,
    fontSize: 15,
    fontFamily: theme.typography.body,
  },
  rightElement: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 54,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
});
