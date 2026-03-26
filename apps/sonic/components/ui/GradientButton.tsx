import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';

interface GradientButtonProps extends TouchableOpacityProps {
  title: string;
  colors?: [string, string, ...string[]];
  containerStyle?: object;
}

export function GradientButton({ 
  title, 
  colors = [theme.colors.primary, theme.colors.primaryContainer],
  containerStyle,
  style,
  ...props 
}: GradientButtonProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      style={[styles.container, containerStyle]} 
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
    width: '100%',
    position: 'relative',
  },
  gradient: {
    paddingVertical: 16,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  text: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: 'bold',
    fontSize: 18,
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary,
    borderRadius: 9999,
    opacity: 0.3,
    top: 8,
    bottom: -8,
    filter: 'blur(15px)',
    zIndex: 1,
    elevation: 8,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  }
});
