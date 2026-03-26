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
          <Text style={styles.label}>{label.toUpperCase()}</Text>
        </View>
      )}
      <View
        style={[styles.inputWrapper, isFocused && styles.inputWrapperFocused]}
      >
        <BlurView
          intensity={20}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
        <TextInput
          style={[styles.input, rightElement ? { paddingRight: 50 } : null]}
          placeholderTextColor={theme.colors.outline + "80"}
          cursorColor={theme.colors.primary}
          selectionColor={theme.colors.primary}
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
    marginVertical: 10,
    position: "relative",
  },
  labelContainer: {
    position: "absolute",
    top: -8,
    left: 20,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 4,
    borderRadius: 10,
    zIndex: 20,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: theme.colors.primary,
    letterSpacing: 2,
  },
  inputWrapper: {
    width: "100%",
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "rgba(53, 53, 52, 0.4)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    color: theme.colors.onSurface,
    fontSize: 14,
  },
  rightElement: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 30,
  },
});
