import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

interface PlayerVolumeProps {
  bottomInset: number;
}

export const PlayerVolume: FC<PlayerVolumeProps> = ({ bottomInset }) => {
  return (
    <View
      style={[
        styles.bottomContext,
        { paddingBottom: bottomInset > 0 ? bottomInset + 12 : 24 },
      ]}
    >
      <BlurView intensity={30} tint="dark" style={styles.volumeControl}>
        <Ionicons
          name="volume-low"
          size={18}
          color={theme.colors.onSurfaceVariant}
        />
        <View style={styles.volumeTrack}>
          <LinearGradient
            colors={[
              theme.colors.outlineVariant,
              theme.colors.onSurfaceVariant,
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.volumeFill, { width: "75%" }]}
          />
        </View>
        <Ionicons
          name="volume-high"
          size={18}
          color={theme.colors.onSurfaceVariant}
        />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomContext: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  volumeControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(theme.colors.white, 0.1),
  },
  volumeTrack: {
    width: 140,
    height: 4,
    backgroundColor: withAlpha(theme.colors.onSurfaceVariant, 0.3),
    borderRadius: 2,
    overflow: "hidden",
  },
  volumeFill: {
    height: "100%",
    borderRadius: 2,
  },
});
