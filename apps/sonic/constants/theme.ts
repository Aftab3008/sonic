export const withAlpha = (color: string, opacity: number) => {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export const theme = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",
    background: "#0A0A0F",
    surface: "#0F0F17",
    surfaceDim: "#0A0A0F",
    surfaceBright: "#2A2A35",
    surfaceContainer: "#16161F",
    surfaceContainerLow: "#121219",
    surfaceContainerLowest: "#08080D",
    surfaceContainerHigh: "#1E1E28",
    surfaceContainerHighest: "#262630",
    surfaceVariant: "#262630",
    surfaceTint: "#C4B5FD",

    primary: "#C4B5FD",
    primaryContainer: "#7C3AED",
    primaryFixed: "#EDE9FE",
    primaryFixedDim: "#C4B5FD",
    onPrimary: "#1E1046",
    onPrimaryContainer: "#F5F3FF",
    onPrimaryFixed: "#1E1046",
    onPrimaryFixedVariant: "#5B21B6",
    inversePrimary: "#6D28D9",

    secondary: "#67E8F9",
    secondaryContainer: "#0891B2",
    secondaryFixed: "#CFFAFE",
    secondaryFixedDim: "#67E8F9",
    onSecondary: "#083344",
    onSecondaryContainer: "#ECFEFF",
    onSecondaryFixed: "#083344",
    onSecondaryFixedVariant: "#0E7490",

    tertiary: "#FCD34D",
    tertiaryContainer: "#D97706",
    tertiaryFixed: "#FEF3C7",
    tertiaryFixedDim: "#FCD34D",
    onTertiary: "#451A03",
    onTertiaryContainer: "#FFFBEB",
    onTertiaryFixed: "#451A03",
    onTertiaryFixedVariant: "#B45309",

    onSurface: "#F1F0F5",
    onSurfaceVariant: "#A09CB1",
    onBackground: "#F1F0F5",
    inverseSurface: "#F1F0F5",
    inverseOnSurface: "#16161F",

    outline: "#6B6880",
    outlineVariant: "#3D3A4E",

    error: "#FCA5A5",
    errorContainer: "#991B1B",
    onError: "#450A0A",
    onErrorContainer: "#FEE2E2",

    success: "#6EE7B7",
    warning: "#FCD34D",
    info: "#67E8F9",
  },
  typography: {
    headline: "Plus Jakarta Sans",
    body: "Inter",
    label: "Inter",
  },
  borderRadius: {
    DEFAULT: 16,
    lg: 24,
    xl: 32,
    full: 9999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export const Colors = {
  light: {
    ...theme.colors,
    text: theme.colors.onSurface,
    background: theme.colors.surface,
    tint: theme.colors.primary,
    icon: theme.colors.outline,
    tabIconDefault: theme.colors.outline,
    tabIconSelected: theme.colors.primary,
  },
  dark: {
    ...theme.colors,
    text: theme.colors.onSurface,
    background: theme.colors.surface,
    tint: theme.colors.primary,
    icon: theme.colors.outline,
    tabIconDefault: theme.colors.outline,
    tabIconSelected: theme.colors.primary,
  },
};
