import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface FeaturedAlbumProps {
  album: any;
  onPlay: () => void;
}

export const FeaturedAlbum: FC<FeaturedAlbumProps> = ({ album, onPlay }) => {
  return (
    <View style={styles.heroSection}>
      <View style={styles.heroBanner}>
        <Image
          source={
            album?.coverImageUrl ||
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD0fPxbwuSFd8tyGfVsL9ixgh4MqJzQCircTE5nViqU6mzHOK1GVxDr_zOKTr2aRrKfyMTnpHjkfCv8FjL8VFpswNkmWWuFgLlVKnA-rkTDwrVYTd60v04SpWmtFPmyoU3YDyewkdi_zbCE-icYhFrWoz23yN6R-cj4ifsodFqri_g5_mjvpVpMe1u2Y1yWhsvGoKrGu9wMSMAXoNdZgM6Z7w6Lsi4kKbxP_4sLgfzQ_8g5hgrsg-KDhOl2ImIYPwJkg4P7p--y5iMB"
          }
          style={StyleSheet.absoluteFillObject}
          transition={300}
          contentFit="cover"
        />
        <LinearGradient
          colors={[
            theme.colors.transparent,
            withAlpha(theme.colors.surfaceDim, 0.95),
          ]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.heroContent}>
          <Text style={styles.heroTag}>FEATURED ALBUM</Text>
          <Text style={styles.heroTitle}>{album?.title || "Vibe Theory"}</Text>
          <Text style={styles.heroSubtitle}>
            {album?.artists?.[0]?.artist?.name ||
              "Experience the new visual album"}{" "}
            exclusively on Sonic.
          </Text>

          <View style={styles.heroActions}>
            <TouchableOpacity
              style={styles.listenButton}
              activeOpacity={0.8}
              onPress={onPlay}
            >
              <LinearGradient
                colors={[theme.colors.primaryContainer, theme.colors.primary]}
                style={styles.listenGradient}
              >
                <Ionicons name="play" size={16} color="#FFFFFF" />
                <Text style={styles.listenButtonText}>Listen Now</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.7}>
              <Text style={styles.saveButtonText}>Save Album</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    paddingHorizontal: 20,
    marginTop: 12,
  },
  heroBanner: {
    width: "100%",
    height: 400,
    borderRadius: 20,
    overflow: "hidden",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  heroTag: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 2.5,
    marginBottom: 10,
  },
  heroTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 38,
    fontWeight: "800",
    color: theme.colors.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 20,
    lineHeight: 20,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  listenButton: {
    borderRadius: 14,
    overflow: "hidden",
  },
  listenGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 13,
    gap: 8,
  },
  listenButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 14,
    overflow: "hidden",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "40",
    backgroundColor: theme.colors.surfaceContainerHigh + "80",
    justifyContent: "center",
  },
  saveButtonText: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: 14,
  },
});
