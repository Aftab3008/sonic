import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale, moderateScale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { FC, memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface PlayerUtilitiesProps {
  mountPhase?: number;
}

export const PlayerUtilities: FC<PlayerUtilitiesProps> = memo(({
  mountPhase = 0,
}) => {
  const showBlur = mountPhase >= 1;

  return (
    <View style={styles.utilityGrid}>
      <TouchableOpacity style={styles.utilityBtnWrapper} activeOpacity={0.7}>
        {showBlur ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[styles.utilityBtn, { backgroundColor: withAlpha(theme.colors.white, 0.05) }]}
          >
            <Ionicons
              name="musical-notes"
              size={moderateScale(18)}
              color={theme.colors.onSurface}
            />
            <Text
              allowFontScaling={true}
              maxFontSizeMultiplier={1.2}
              style={styles.utilityText}
            >
              Lyrics
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.utilityBtn}>
            <Ionicons
              name="musical-notes"
              size={moderateScale(18)}
              color={theme.colors.onSurface}
            />
            <Text
              allowFontScaling={true}
              maxFontSizeMultiplier={1.2}
              style={styles.utilityText}
            >
              Lyrics
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.utilityBtnWrapper} activeOpacity={0.7}>
        {showBlur ? (
          <Animated.View
            entering={FadeIn.duration(300)}
            style={[styles.utilityBtn, { backgroundColor: withAlpha(theme.colors.white, 0.05) }]}
          >
            <Ionicons
              name="list"
              size={moderateScale(18)}
              color={theme.colors.onSurface}
            />
            <Text
              allowFontScaling={true}
              maxFontSizeMultiplier={1.2}
              style={styles.utilityText}
            >
              Up Next
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.utilityBtn}>
            <Ionicons
              name="list"
              size={moderateScale(18)}
              color={theme.colors.onSurface}
            />
            <Text
              allowFontScaling={true}
              maxFontSizeMultiplier={1.2}
              style={styles.utilityText}
            >
              Up Next
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  utilityGrid: {
    flexDirection: "row",
    gap: moderateScale(16),
    width: "100%",
  },
  utilityBtnWrapper: {
    flex: 1,
    minHeight: verticalScale(50),
    borderRadius: moderateScale(100),
    borderWidth: 0.5,
    borderColor: theme.colors.primary,
    overflow: "hidden",
  },
  utilityBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8),
    backgroundColor: withAlpha(theme.colors.surface, 0.8),
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.1),
  },
  utilityText: {
    color: theme.colors.onSurface,
    fontWeight: "700",
    fontSize: moderateFontScale(13),
    letterSpacing: moderateScale(0.2),
  },
});
