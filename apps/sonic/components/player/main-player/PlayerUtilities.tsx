import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const PlayerUtilities: FC = () => {
  return (
    <View style={styles.utilityGrid}>
      <TouchableOpacity style={styles.utilityBtnWrapper} activeOpacity={0.7}>
        <BlurView intensity={30} tint="dark" style={styles.utilityBtn}>
          <Ionicons
            name="musical-notes"
            size={18}
            color={theme.colors.onSurface}
          />
          <Text
            allowFontScaling={true}
            maxFontSizeMultiplier={1.2}
            style={styles.utilityText}
          >
            Lyrics
          </Text>
        </BlurView>
      </TouchableOpacity>

      <TouchableOpacity style={styles.utilityBtnWrapper} activeOpacity={0.7}>
        <BlurView intensity={30} tint="dark" style={styles.utilityBtn}>
          <Ionicons name="list" size={18} color={theme.colors.onSurface} />
          <Text
            allowFontScaling={true}
            maxFontSizeMultiplier={1.2}
            style={styles.utilityText}
          >
            Up Next
          </Text>
        </BlurView>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  utilityGrid: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  utilityBtnWrapper: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    overflow: "hidden",
  },
  utilityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(theme.colors.white, 0.1),
  },
  utilityText: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: moderateFontScale(14),
  },
});
