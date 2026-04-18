import { theme } from "@/constants/theme";
import { moderateFontScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PlayerHeaderProps {
  title?: string;
  topInset: number;
}

export const PlayerHeader: FC<PlayerHeaderProps> = ({ title, topInset }) => {
  const router = useRouter();

  return (
    <View style={[styles.header, { paddingTop: topInset + 12 }]}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons
          name="chevron-down"
          size={26}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>

      <View style={styles.headerTitleContainer}>
        <Text
          allowFontScaling={true}
          maxFontSizeMultiplier={1.2}
          style={styles.headerTitle}
        >
          {title || "Sonic Player"}
        </Text>
      </View>

      <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
        <Ionicons
          name="ellipsis-horizontal"
          size={22}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 50,
  },
  headerButton: {
    minWidth: 44,
    minHeight: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(14),
    fontWeight: "700",
    color: theme.colors.primary,
    marginTop: 4,
  },
});
