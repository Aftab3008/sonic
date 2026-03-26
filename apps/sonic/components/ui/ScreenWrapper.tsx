import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface ScreenWrapperProps {
  children: React.ReactNode;
  useScroll?: boolean;
  backgroundColors?: [string, string, ...string[]];
  containerStyle?: object;
  contentContainerStyle?: object;
}

export function ScreenWrapper({ 
  children, 
  useScroll = false, 
  backgroundColors = [theme.colors.surfaceContainerLowest, theme.colors.surface],
  containerStyle,
  contentContainerStyle
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const Container = useScroll ? ScrollView : View;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient 
        colors={backgroundColors}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glowLeft, { backgroundColor: theme.colors.primary }]} />
      <View style={[styles.glowRight, { backgroundColor: theme.colors.secondary }]} />
      
      <Container 
        style={[styles.content, { paddingTop: insets.top, paddingBottom: insets.bottom }, containerStyle]}
        contentContainerStyle={useScroll ? [styles.scrollContent, contentContainerStyle] : contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  glowLeft: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    opacity: 0.1,
    transform: [{ scale: 1.5 }],
  },
  glowRight: {
    position: 'absolute',
    bottom: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.1,
    transform: [{ scale: 1.5 }],
  }
});
