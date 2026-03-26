export const theme = {
  colors: {
    inverseOnSurface: "#313030",
    primaryFixedDim: "#d0bcff",
    onPrimaryFixed: "#23005c",
    errorContainer: "#93000a",
    onSurfaceVariant: "#cbc3d7",
    onTertiaryContainer: "#3f2300",
    surfaceContainerHighest: "#353534",
    onSecondaryContainer: "#00424e",
    onTertiary: "#482900",
    onSurface: "#e5e2e1",
    tertiaryFixedDim: "#ffb869",
    surfaceBright: "#393939",
    secondaryContainer: "#03b5d3",
    surfaceVariant: "#353534",
    secondaryFixedDim: "#4cd7f6",
    tertiaryContainer: "#ca801e",
    onSecondaryFixedVariant: "#004e5c",
    surfaceContainerLowest: "#0e0e0e",
    surface: "#131313",
    error: "#ffb4ab",
    tertiaryFixed: "#ffdcbb",
    inversePrimary: "#6d3bd7",
    surfaceContainer: "#201f1f",
    outlineVariant: "#494454",
    background: "#131313",
    inverseSurface: "#e5e2e1",
    secondary: "#4cd7f6",
    outline: "#958ea0",
    surfaceContainerLow: "#1c1b1b",
    onTertiaryFixed: "#2c1700",
    onPrimary: "#3c0091",
    onSecondaryFixed: "#001f26",
    onPrimaryFixedVariant: "#5516be",
    onBackground: "#e5e2e1",
    onError: "#690005",
    primary: "#d0bcff",
    onSecondary: "#003640",
    secondaryFixed: "#acedff",
    surfaceContainerHigh: "#2a2a2a",
    surfaceDim: "#131313",
    surfaceTint: "#d0bcff",
    onTertiaryFixedVariant: "#673d00",
    tertiary: "#ffb869",
    primaryContainer: "#a078ff",
    onErrorContainer: "#ffdad6",
    onPrimaryContainer: "#340080",
    primaryFixed: "#e9ddff"
  },
  typography: {
    headline: "Plus Jakarta Sans",
    body: "Inter",
    label: "Inter"
  },
  borderRadius: {
    DEFAULT: 16,
    lg: 32,
    xl: 48,
    full: 9999
  }
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
  }
};

