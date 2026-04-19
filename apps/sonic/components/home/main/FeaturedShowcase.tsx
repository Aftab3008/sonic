import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { Album } from "@/lib/schema/player.schema";

interface FeaturedShowcaseProps {
  album: (Album & { tracks?: any[] }) | null | undefined;
  onPlay: () => void;
}

export const FeaturedShowcase: FC<FeaturedShowcaseProps> = ({ album, onPlay }) => {
  if (!album) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={album.coverImageUrl}
          style={StyleSheet.absoluteFillObject}
          priority="high"
          contentFit="cover"
          transition={400}
        />
        
        {/* Deep Gradient Mask */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)", "rgba(0,0,0,0.95)"]}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.content}>
          <Text style={styles.tag}>
            {album.albumType === "SINGLE" ? "NEW SINGLE" : "FEATURED ALBUM"}
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {album.title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {album.artists?.[0]?.artist?.name || "Featured Artist"}
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.playButton} 
              activeOpacity={0.9}
              onPress={onPlay}
            >
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.playGradient}
              >
                <Ionicons 
                  name={album.albumType === "SINGLE" ? "play" : "list"} 
                  size={20} 
                  color="white" 
                />
                <Text style={styles.playText}>
                  {album.albumType === "SINGLE" ? "Listen Now" : "View Album"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveButton} activeOpacity={0.7}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const { width } = Dimensions.get("window");
const ASPECT_RATIO = 4 / 5;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    width: "100%",
    aspectRatio: ASPECT_RATIO,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: theme.colors.surfaceContainer,
  },
  content: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  tag: {
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: theme.typography.headline,
    fontSize: 32,
    fontWeight: "900",
    color: "white",
    letterSpacing: -1,
    marginBottom: 4,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  playButton: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  playGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  playText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
  saveButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
});
