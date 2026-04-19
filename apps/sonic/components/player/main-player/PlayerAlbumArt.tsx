import { theme, withAlpha } from "@/constants/theme";
import { PerformanceTier } from "@/lib/performance";
import { moderateFontScale, moderateScale, verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { FC, memo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

interface PlayerAlbumArtProps {
  artwork?: string;
  mountPhase?: number;
  performanceTier?: PerformanceTier;
}

export const PlayerAlbumArt: FC<PlayerAlbumArtProps> = memo(
  ({ artwork, mountPhase = 0, performanceTier = "mid" }) => {
    const isLowEnd = performanceTier === "low";

    const showHeavyShadows = mountPhase >= 2 && !isLowEnd;
    const showBadge = mountPhase >= 1;

    const getShadowStyle = () => {
      if (isLowEnd) {
        return styles.minimalShadows;
      }
      if (showHeavyShadows) {
        return styles.heavyShadows;
      }
      return styles.lightShadows;
    };

    return (
      <View style={[styles.albumArtContainer, getShadowStyle()]}>
        <Image source={{ uri: artwork }} style={styles.albumArt} />

        {showBadge && (
          <Animated.View
            entering={isLowEnd ? undefined : FadeIn.duration(300)}
            style={styles.hiResBadge}
          >
            <Ionicons
              name="aperture"
              size={moderateScale(12)}
              color={theme.colors.secondary}
            />
            <Text
              allowFontScaling={true}
              maxFontSizeMultiplier={1.2}
              style={styles.hiResText}
            >
              HI-RES
            </Text>
          </Animated.View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  albumArtContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  minimalShadows: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.2,
    shadowRadius: moderateScale(4),
    elevation: 4,
  },
  lightShadows: {
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(12),
    elevation: 8,
  },
  heavyShadows: {
    shadowOffset: { width: 0, height: verticalScale(8) },
    shadowOpacity: 0.4,
    shadowRadius: moderateScale(20),
    elevation: 12,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: moderateScale(32),
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.1),
  },
  hiResBadge: {
    position: "absolute",
    top: verticalScale(20),
    right: moderateScale(20),
    paddingHorizontal: moderateScale(14),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(14),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6),
    overflow: "hidden",
    backgroundColor: withAlpha(theme.colors.surface, 0.4),
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.white, 0.15),
  },
  hiResText: {
    fontSize: moderateFontScale(9),
    fontWeight: "900",
    color: theme.colors.white,
    letterSpacing: moderateScale(2),
  },
});
