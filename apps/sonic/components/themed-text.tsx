import { theme } from "@/constants/theme";
import { useThemeColor } from "@/hooks/use-theme-color";
import { moderateFontScale } from "@/lib/scaling";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      allowFontScaling={true}
      maxFontSizeMultiplier={1.2}
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: moderateFontScale(16),
    lineHeight: moderateFontScale(24),
  },
  defaultSemiBold: {
    fontSize: moderateFontScale(16),
    lineHeight: moderateFontScale(24),
    fontWeight: "600",
  },
  title: {
    fontSize: moderateFontScale(32),
    fontWeight: "bold",
    lineHeight: moderateFontScale(32),
  },
  subtitle: {
    fontSize: moderateFontScale(20),
    fontWeight: "bold",
  },
  link: {
    lineHeight: moderateFontScale(30),
    fontSize: moderateFontScale(16),
    color: theme.colors.primary,
  },
});
