import { theme } from "@/constants/theme";
import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { Image } from "expo-image";
import { FC, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface LibraryItemProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  image?: string;
  onPress?: () => void;
}

export const LibraryItem: FC<LibraryItemProps> = ({
  title,
  subtitle,
  icon,
  image,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.container}
    activeOpacity={0.7}
    onPress={onPress}
  >
    <View style={styles.imageContainer}>
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <View style={styles.iconPlaceholder}>{icon}</View>
      )}
    </View>
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(12),
  },
  imageContainer: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(12),
    overflow: "hidden",
    marginRight: scale(16),
    backgroundColor: theme.colors.surfaceContainerHigh,
    justifyContent: "center",
    alignItems: "center",
  },
  image: { width: "100%", height: "100%" },
  iconPlaceholder: {},
  info: { flex: 1 },
  title: {
    color: theme.colors.onSurface,
    fontWeight: "700",
    fontSize: moderateFontScale(16),
    marginBottom: verticalScale(4),
  },
  subtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(13),
    fontWeight: "500",
  },
});
