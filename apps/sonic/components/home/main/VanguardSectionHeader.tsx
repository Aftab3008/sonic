import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "@/constants/theme";

interface VanguardSectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

export const VanguardSectionHeader: FC<VanguardSectionHeaderProps> = ({
  title,
  actionText = "Show all",
  onActionPress,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onActionPress}>
        <Text style={styles.action}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  title: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  action: {
    fontFamily: theme.typography.body,
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
});
