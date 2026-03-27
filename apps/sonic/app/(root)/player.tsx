import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "@/constants/theme";

export default function PlayerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <View style={styles.container}>
      <View style={StyleSheet.absoluteFillObject}>
        <Image
          source={{
            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-PAVcejU7AD5VWklbWYxh07RUAb2gZCmDYx1o1VtRdhxNmTjHw7GzfJscqHJyG8KqSzyp07xT-YRgkSY3GIlwp5rfLgJ99WgE5D2G-I8EB1Xpw50Xw5lKNcz0SCvwjR4KJ2q2_Ac-aFaJpuAiZxgO4YhMnIl4gv0WXlWbk4cpFes7YHKaNFRX_gZhX_Doj_d620DmurDXEROWu5xOg3YdG-k3kAYvco6j34E6xNo2v1jVOc5C1smsX4Ck0FWq6HeEswSv_DBwUHt_",
          }}
          style={styles.bgImage}
          blurRadius={60}
        />
        <LinearGradient
          colors={["rgba(10, 10, 15, 0.3)", "rgba(10, 10, 15, 0.85)", "rgba(10, 10, 15, 0.95)"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-down"
            size={22}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerSubtitle}>PLAYING FROM PLAYLIST</Text>
          <Text style={styles.headerTitle}>Midnight Vibes</Text>
        </View>

        <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
          <Ionicons
            name="ellipsis-horizontal"
            size={20}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.albumArtContainer}>
          <View style={styles.albumArtGlow} />
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDio4MjMr5rBPOso_l7VO_2j125bUAS3WiH8vA0oc4qvf_ZjRUfDsQ8MUaVytTEckuo99p4CdXiZy9Fc1XaGRwY2wIfgsVlzoZ4maOyrZ00Ox6KL1rJ28RjH4EsHvhIHvFkt7lkUgjBFI4YGxbWcROGt6d21n-0sEjHO1pF5ag5uPjGMUGXqaegT0fqsx6CMG8a9Vm52_OHaQJrjwMWykJ4p3DH3lflDUxKIsRKuyGsaWot9U24jrtntrb6VYPjmGC56_p8XQfwJ5j1",
            }}
            style={styles.albumArt}
          />
          <View style={styles.hiResBadge}>
            <Ionicons
              name="aperture"
              size={14}
              color={theme.colors.secondary}
            />
            <Text style={styles.hiResText}>HI-RES</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.metadataRow}>
            <View style={styles.metadataText}>
              <Text style={styles.trackTitle} numberOfLines={1}>
                Obsidian Dream
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                The Prism Collective
              </Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.7}>
              <Ionicons name="heart" size={28} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.seekerContainer}>
            <View style={styles.seekerTrack}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, theme.colors.primary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.seekerFill, { width: "42%" }]}
              />
              <View style={[styles.seekerKnob, { left: "42%" }]} />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeText}>1:42</Text>
              <Text style={styles.timeText}>4:05</Text>
            </View>
          </View>

          <View style={styles.playbackControls}>
            <TouchableOpacity style={styles.secondaryControl} activeOpacity={0.7}>
              <Ionicons
                name="shuffle"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            <View style={styles.mainControls}>
              <TouchableOpacity style={styles.controlPrimaryBtn} activeOpacity={0.7}>
                <Ionicons
                  name="play-skip-back"
                  size={32}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.playPauseBtnWrapper}
                onPress={() => setIsPlaying(!isPlaying)}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={[theme.colors.primaryContainer, theme.colors.primary]}
                  style={styles.playPauseBtn}
                >
                  <Ionicons
                    name={isPlaying ? "pause" : "play"}
                    size={32}
                    color="#FFFFFF"
                    style={!isPlaying ? { marginLeft: 3 } : {}}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlPrimaryBtn} activeOpacity={0.7}>
                <Ionicons
                  name="play-skip-forward"
                  size={32}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.secondaryControl} activeOpacity={0.7}>
              <Ionicons
                name="repeat"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.utilityGrid}>
            <TouchableOpacity style={styles.utilityBtn} activeOpacity={0.7}>
              <Ionicons
                name="musical-notes"
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.utilityText}>Lyrics</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.utilityBtn} activeOpacity={0.7}>
              <Ionicons
                name="list"
                size={18}
                color={theme.colors.secondary}
              />
              <Text style={styles.utilityText}>Up Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View
        style={[styles.bottomContext, { paddingBottom: insets.bottom + 12 }]}
      >
        <View style={styles.volumeControl}>
          <Ionicons
            name="volume-low"
            size={18}
            color={theme.colors.onSurfaceVariant}
          />
          <View style={styles.volumeTrack}>
            <LinearGradient
              colors={[theme.colors.outlineVariant, theme.colors.onSurfaceVariant]}
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
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  bgImage: {
    width: "120%",
    height: "120%",
    top: "-10%",
    left: "-10%",
    opacity: 0.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 50,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceContainerHigh + "80",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: "700",
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 2,
    opacity: 0.6,
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
    marginTop: 2,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  albumArtContainer: {
    width: "85%",
    aspectRatio: 1,
    position: "relative",
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  albumArtGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primaryContainer,
    opacity: 0.1,
    borderRadius: 20,
    transform: [{ scale: 1.08 }],
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  hiResBadge: {
    position: "absolute",
    bottom: -12,
    right: -8,
    backgroundColor: theme.colors.surfaceContainerHighest,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "20",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  hiResText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 1,
  },
  controlsContainer: {
    width: "100%",
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  metadataText: {
    flex: 1,
    paddingRight: 16,
  },
  trackTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.onSurface,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  trackArtist: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.secondary,
  },
  favoriteButton: {
    marginBottom: 6,
  },
  seekerContainer: {
    marginBottom: 32,
  },
  seekerTrack: {
    width: "100%",
    height: 5,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: "visible",
    position: "relative",
  },
  seekerFill: {
    height: "100%",
    borderRadius: 3,
  },
  seekerKnob: {
    position: "absolute",
    top: -4,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: theme.colors.primary,
    marginLeft: -6,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    opacity: 0.6,
  },
  playbackControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 36,
  },
  secondaryControl: {
    padding: 8,
  },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },
  controlPrimaryBtn: {
    padding: 6,
  },
  playPauseBtnWrapper: {
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  utilityGrid: {
    flexDirection: "row",
    gap: 12,
  },
  utilityBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "20",
    backgroundColor: theme.colors.surfaceContainerHigh + "80",
  },
  utilityText: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: 13,
  },
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
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
    backgroundColor: theme.colors.surfaceContainerHigh + "60",
  },
  volumeTrack: {
    width: 120,
    height: 4,
    backgroundColor: theme.colors.surfaceContainerHighest,
    borderRadius: 2,
    overflow: "hidden",
  },
  volumeFill: {
    height: "100%",
    borderRadius: 2,
  },
});
