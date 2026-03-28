import { theme, withAlpha } from "@/constants/theme";
import { moderateFontScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
          blurRadius={70}
        />
        <LinearGradient
          colors={[
            withAlpha(theme.colors.background, 0.4),
            withAlpha(theme.colors.background, 0.8),
            withAlpha(theme.colors.background, 0.98),
          ]}
          locations={[0, 0.4, 1]}
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
            size={26}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text
            allowFontScaling={true}
            maxFontSizeMultiplier={1.2}
            style={styles.headerSubtitle}
          >
            PLAYING FROM PLAYLIST
          </Text>
          <Text
            allowFontScaling={true}
            maxFontSizeMultiplier={1.2}
            style={styles.headerTitle}
          >
            Midnight Vibes
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

      <View style={styles.mainContent}>
        <View style={styles.albumArtContainer}>
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDio4MjMr5rBPOso_l7VO_2j125bUAS3WiH8vA0oc4qvf_ZjRUfDsQ8MUaVytTEckuo99p4CdXiZy9Fc1XaGRwY2wIfgsVlzoZ4maOyrZ00Ox6KL1rJ28RjH4EsHvhIHvFkt7lkUgjBFI4YGxbWcROGt6d21n-0sEjHO1pF5ag5uPjGMUGXqaegT0fqsx6CMG8a9Vm52_OHaQJrjwMWykJ4p3DH3lflDUxKIsRKuyGsaWot9U24jrtntrb6VYPjmGC56_p8XQfwJ5j1",
            }}
            style={styles.albumArt}
          />
          <BlurView intensity={60} tint="dark" style={styles.hiResBadge}>
            <Ionicons
              name="aperture"
              size={12}
              color={theme.colors.secondary}
            />
            <Text
              allowFontScaling={true}
              maxFontSizeMultiplier={1.2}
              style={styles.hiResText}
            >
              HI-RES
            </Text>
          </BlurView>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.metadataRow}>
            <View style={styles.metadataText}>
              <Text
                allowFontScaling={true}
                maxFontSizeMultiplier={1.2}
                style={styles.trackTitle}
                numberOfLines={1}
              >
                Obsidian Dream
              </Text>
              <Text
                allowFontScaling={true}
                maxFontSizeMultiplier={1.2}
                style={styles.trackArtist}
                numberOfLines={1}
              >
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
              <Text
                allowFontScaling={true}
                maxFontSizeMultiplier={1.2}
                style={styles.timeText}
              >
                1:42
              </Text>
              <Text
                allowFontScaling={true}
                maxFontSizeMultiplier={1.2}
                style={styles.timeText}
              >
                4:05
              </Text>
            </View>
          </View>

          <View style={styles.playbackControls}>
            <TouchableOpacity
              style={styles.secondaryControl}
              activeOpacity={0.7}
            >
              <Ionicons
                name="shuffle"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            <View style={styles.mainControls}>
              <TouchableOpacity
                style={styles.controlPrimaryBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="play-skip-back"
                  size={36}
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
                    size={34}
                    color={theme.colors.white}
                    style={!isPlaying ? { marginLeft: 4 } : {}}
                  />
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.controlPrimaryBtn}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="play-skip-forward"
                  size={36}
                  color={theme.colors.onSurface}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.secondaryControl}
              activeOpacity={0.7}
            >
              <Ionicons
                name="repeat"
                size={22}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.utilityGrid}>
            <TouchableOpacity
              style={styles.utilityBtnWrapper}
              activeOpacity={0.7}
            >
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

            <TouchableOpacity
              style={styles.utilityBtnWrapper}
              activeOpacity={0.7}
            >
              <BlurView intensity={30} tint="dark" style={styles.utilityBtn}>
                <Ionicons
                  name="list"
                  size={18}
                  color={theme.colors.onSurface}
                />
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
        </View>
      </View>

      <View
        style={[
          styles.bottomContext,
          { paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 24 },
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
    opacity: 0.5,
  },
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
  headerSubtitle: {
    fontSize: moderateFontScale(10),
    fontWeight: "700",
    color: theme.colors.onSurfaceVariant,
    letterSpacing: 2.5,
    opacity: 0.8,
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(14),
    fontWeight: "700",
    color: theme.colors.primary,
    marginTop: 4,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  albumArtContainer: {
    width: "90%",
    aspectRatio: 1,
    position: "relative",
    marginBottom: 44,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
  albumArt: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
  },
  hiResBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    overflow: "hidden",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(theme.colors.white, 0.2),
  },
  hiResText: {
    fontSize: moderateFontScale(10),
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: 1.5,
  },
  controlsContainer: {
    width: "100%",
  },
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
  },
  metadataText: {
    flex: 1,
    paddingRight: 16,
  },
  trackTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(28),
    fontWeight: "800",
    color: theme.colors.onSurface,
    marginBottom: 6,
    letterSpacing: -1,
  },
  trackArtist: {
    fontSize: moderateFontScale(16),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
  },
  favoriteButton: {
    marginBottom: 6,
  },
  seekerContainer: {
    marginBottom: 36,
  },
  seekerTrack: {
    width: "100%",
    height: 4,
    backgroundColor: withAlpha(theme.colors.onSurface, 0.15),
    borderRadius: 2,
    overflow: "visible",
    position: "relative",
  },
  seekerFill: {
    height: "100%",
    borderRadius: 2,
  },
  seekerKnob: {
    position: "absolute",
    top: -3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.white,
    marginLeft: -5,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  timeText: {
    fontSize: moderateFontScale(12),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    opacity: 0.7,
  },
  playbackControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  secondaryControl: {
    padding: 10,
  },
  mainControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 32,
  },
  controlPrimaryBtn: {
    padding: 8,
  },
  playPauseBtnWrapper: {
    shadowColor: theme.colors.primaryContainer,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  playPauseBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  utilityGrid: {
    flexDirection: "row",
    gap: 16,
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
