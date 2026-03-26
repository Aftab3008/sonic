import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenWrapper } from "../../../components/ui/ScreenWrapper";
import { theme } from "../../../constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { ASSETS } from "@/constants/assets";

export default function HomeScreen() {
  const recentTracks = [
    {
      title: "Neon Nights",
      artist: "Cyber-Pop Collective",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuATjk5Wc_UjwJhHCuw1UM7fsH_T4vrbYFAYq95Akx409Fd39ko-ZFZkReKv2X2fGyG4EmduGfWXTmU4XURHDO4p_G65PWPjBl7uXa-T2-X1C4LNGaDZosAvc7aGaIHUK3NCLKzK6ElkYg6Z1pvxb45VFWCICXp6EvOSFwJAkGk62xfojI3FqhpFw4XpyKLUFF-GzNTfWceodocignIbCy1AfZCkt1mxL8DmUH1c6ApPrNV9m0lV9wRI90BuOFV0EX5Ilar9eqPzwDKS",
    },
    {
      title: "Retro Soul",
      artist: "The Groove Band",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuA1x87qGdYWHefAHGSWdHct4VdDxM90_WT2AwUbEBcXf5LYxgAEoUWt4X7NDjiVWEwTAspEB8fxv_CRH3jWBXyHUNuLuzjI63rZ6gH9W5f3qtNyIxRY3bG_K6t0UNytMo_ZlZEQZvwODRlGibU6PBdoqenIy38rUa5sZdT9WWghNeU3iPIL9vYLXND6D37P2c2xo8oYvZYgdsJdCeaDLxIbh2LQ-JSwMwCr-2igzljatuFMbOGWBk5UbcsVVLwAMBUBWm3ilugeBDxO",
    },
    {
      title: "Silent Echo",
      artist: "Acoustic Dreams",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBg4NHkIsurO9L_XrD2fCBduzSG0DhCI4viHh3VxbUkT_d3MvPzLofUqGhK0YhFFMXCPqSNmOLuzgEVAx2tkXgDi10N2qE_ihVgjkGrNd8V0DQgGg2_UzUgkDYG9RwhIIMNOOgeKuAejXIAVdq4TOqhc2epaF_C59355Nlt1mnT4casw6y43y3RcGluhkoZzOTXqVplz-iVg1JemFChskQfJNQiYOdrA5S0BaCG0s61u8sE6MOC7rgkrXpSRtWdlJXm0N1WG40mNh8X",
    },
    {
      title: "Stellar Voyage",
      artist: "Intergalactic Beats",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCfXXVc6dXQJhlW-igG8vdpy5Q4TTD_OCjwk0hCY0HSLYjPmmp0gI5AfoaKZrHBFwCkfeNMc2oqPRAQjhzv1_u64VJzT3_TfA_n1wjiZpqGBOvQR3_Ui8eVBm7x3xlBBSRH0gnt_EoDFLnXrP0qJmarqGf8DGY2V70iTrw6D6UTHx6D4PabSZNv0Xun7yvpDWoJhH9Dgf8XNi5l-5RjbBaGZ1xbJZeQDzC89cykwNs4Hd7dkrzJ9cxKU7qJuSN32bzLBnD6yJGACaQg",
    },
  ];

  const moods = [
    {
      label: "Chill",
      icon: "leaf-outline",
      color: "rgba(139, 92, 246, 0.1)",
      textColor: theme.colors.primary,
      border: "rgba(139, 92, 246, 0.3)",
    },
    {
      label: "Energy",
      icon: "flash-outline",
      color: theme.colors.surfaceContainerHigh,
      textColor: theme.colors.onSurfaceVariant,
      border: "transparent",
    },
    {
      label: "Deep",
      icon: "moon-outline",
      color: theme.colors.surfaceContainerHigh,
      textColor: theme.colors.onSurfaceVariant,
      border: "transparent",
    },
    {
      label: "Workout",
      icon: "barbell-outline",
      color: theme.colors.surfaceContainerHigh,
      textColor: theme.colors.onSurfaceVariant,
      border: "transparent",
    },
    {
      label: "Focus",
      icon: "terminal-outline",
      color: theme.colors.surfaceContainerHigh,
      textColor: theme.colors.onSurfaceVariant,
      border: "transparent",
    },
  ];

  return (
    <ScreenWrapper>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRSNrDXxy1IdxzkLWHCrK5pq7SUAWDnLwYI1Meo76NuieQKPSHuSBSlbMSxBAkWb32pk1YaOCnOJ0VdrYdJvDSrpr9Y0DZkzv628PAo5g2idrdd9_jkv9OrX4HRn31S14541trHfbOiGMSlXBtS45EqsaMYbskMzYfhMZaEfAMVCInhKR5CyEVN1qfmFGrG-4cfH0M4cyr42ycOdJPtMJP99CdYC_gYGlNJD63ODNN4vlBbQQ8_4pBpQhpe_ycgCc5FtNX0pkF6MfF",
              }}
              style={styles.profileImage}
            />
          </View>
          <Image source={ASSETS.appLogo} style={styles.headerLogo} />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="notifications-outline"
              size={24}
              color={theme.colors.primaryFixed}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="settings-outline"
              size={24}
              color={theme.colors.primaryFixed}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Featured Banner */}
        <View style={styles.heroSection}>
          <View style={styles.heroBanner}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0fPxbwuSFd8tyGfVsL9ixgh4MqJzQCircTE5nViqU6mzHOK1GVxDr_zOKTr2aRrKfyMTnpHjkfCv8FjL8VFpswNkmWWuFgLlVKnA-rkTDwrVYTd60v04SpWmtFPmyoU3YDyewkdi_zbCE-icYhFrWoz23yN6R-cj4ifsodFqri_g5_mjvpVpMe1u2Y1yWhsvGoKrGu9wMSMAXoNdZgM6Z7w6Lsi4kKbxP_4sLgfzQ_8g5hgrsg-KDhOl2ImIYPwJkg4P7p--y5iMB",
              }}
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              colors={["transparent", "rgba(19, 19, 19, 0.9)"]}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTag}>TRENDING ARTIST</Text>
              <Text style={styles.heroTitle}>Vibe Theory</Text>
              <Text style={styles.heroSubtitle}>
                Experience the new visual album "Refractions" exclusively on
                Sonic.
              </Text>

              <View style={styles.heroActions}>
                <TouchableOpacity style={styles.listenButton}>
                  <LinearGradient
                    colors={[
                      theme.colors.primary,
                      theme.colors.primaryContainer,
                    ]}
                    style={styles.listenGradient}
                  >
                    <Ionicons
                      name="play"
                      size={16}
                      color={theme.colors.onPrimaryContainer}
                    />
                    <Text style={styles.listenButtonText}>Listen Now</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.saveButton}>
                  <BlurView
                    intensity={40}
                    tint="dark"
                    style={StyleSheet.absoluteFillObject}
                  />
                  <Text style={styles.saveButtonText}>Save Album</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Recently Played */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>View History</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {recentTracks.map((track, i) => (
              <TouchableOpacity key={i} style={styles.trackCard}>
                <View style={styles.trackImageContainer}>
                  <Image
                    source={{ uri: track.image }}
                    style={styles.trackImage}
                  />
                </View>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {track.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Made for You: Bento Grid */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Made for You</Text>
          <View style={styles.bentoGrid}>
            <TouchableOpacity style={styles.bentoLarge}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEKxDLPbZx6QLpYrNVuURdY1sqE14fJMH5ZBnWm5fG_dygoFp1lIpDmh_vS_2mcqHHbAuUDV-lEqwqT5yBC9U_ZeRlwDmfqJdZxXyodptiXHEvIhkffAOpwQwBx3o-r7IIpI_wzw5nB7P1UYwWjgu09pSSX__MSGKO5s0fK7Qd3nVD13sAYt0iCex293os6fdO0lnNhI55Nc4XLdN-sgu0PTmPb8Uua9LKTFUI4xM9A7TRlDgDy0wfLSBc1XVCDgMrP8knevtJ05vl",
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={["transparent", "rgba(76, 29, 149, 0.9)"]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.bentoLargeContent}>
                <Text style={styles.bentoLargeTitle}>Daily Mix{"\n"}Pulse</Text>
                <Text style={styles.bentoLargeSubtitle}>
                  Personalized high-energy tracks
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.bentoRightColumn}>
              <TouchableOpacity style={styles.bentoSmallGroup1}>
                <View style={styles.bentoSmallHeader}>
                  <Ionicons
                    name="sparkles"
                    size={24}
                    color={theme.colors.secondary}
                  />
                  <View style={styles.discoverBadge}>
                    <Text style={styles.discoverText}>DISCOVER</Text>
                  </View>
                </View>
                <View>
                  <Text style={styles.bentoSmallTitle}>Weekly Radar</Text>
                  <Text style={styles.bentoSmallSubtitle}>
                    Fresh sounds for your soul
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.bentoSmallGroup2}>
                <Ionicons
                  name="heart"
                  size={24}
                  color={theme.colors.tertiary}
                />
                <View>
                  <Text style={styles.bentoSmallTitle}>Liked Tracks</Text>
                  <Text style={styles.bentoSmallSubtitle}>428 gems saved</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Select your mood */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select your mood</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: mood.color,
                    borderColor: mood.border,
                    borderWidth: 1,
                  },
                ]}
              >
                <Ionicons
                  name={mood.icon as any}
                  size={16}
                  color={mood.textColor}
                />
                <Text style={[styles.moodLabel, { color: mood.textColor }]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.miniPlayer}>
        <View style={styles.miniPlayerGlass}>
          <View style={styles.miniPlayerProgress} />
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMSQOcjFUNt_jxYHhnFUao7J-xIKJaqBoSqyOxABz0yNewlPXV6zSLoCC_cQrrmuiDWGePxptZlRHJLlse4qCp8lXHwwwE35JRrKVRtRo3DnkZMTqEypOEtAxXEh8x0oszTW3VHhfo-lUiE0aRYiryTqvRb0P_HM1CbJkbchHxEhDTVqBQahHFk6_lmVTGXLUHzXFZPZKzDKs8nDWf1y8shHCMql6Of-F34Ob7_Gv3IvV3ucc8GKfrRCEgqxOU3bVHFIY_0tgqKRua",
            }}
            style={styles.miniPlayerImage}
          />
          <View style={styles.miniPlayerInfo}>
            <Text style={styles.miniPlayerTitle} numberOfLines={1}>
              Neon Nights
            </Text>
            <Text style={styles.miniPlayerArtist} numberOfLines={1}>
              Cyber-Pop Collective
            </Text>
          </View>
          <View style={styles.miniPlayerActions}>
            <TouchableOpacity style={styles.miniPlayerActionBtn}>
              <Ionicons
                name="desktop-outline"
                size={20}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniPlayerActionBtn}>
              <Ionicons
                name="heart-outline"
                size={20}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniPlayerPlayBtn}>
              <Ionicons
                name="pause"
                size={20}
                color={theme.colors.onPrimaryContainer}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 48,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerHigh,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.2)",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  headerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.2)",
  },
  headerRight: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    opacity: 0.8,
  },
  scrollContent: {
    paddingBottom: 220, // space for mini player + tab bar
  },
  heroSection: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  heroBanner: {
    width: "100%",
    height: 420,
    borderRadius: 16,
    overflow: "hidden",
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: "rgba(53, 53, 52, 0.6)",
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.1)",
    margin: 20,
    borderRadius: 16,
  },
  heroTag: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 40,
    fontWeight: "800",
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
    lineHeight: 20,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
  },
  listenButton: {
    borderRadius: 9999,
    overflow: "hidden",
  },
  listenGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  listenButtonText: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: "700",
    fontSize: 14,
  },
  saveButton: {
    borderRadius: 9999,
    overflow: "hidden",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.2)",
    justifyContent: "center",
  },
  saveButtonText: {
    color: theme.colors.onSurface,
    fontWeight: "700",
    fontSize: 14,
  },
  sectionContainer: {
    marginTop: 48,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.onSurface,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  sectionAction: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  horizontalList: {
    paddingHorizontal: 24,
    gap: 20,
  },
  trackCard: {
    width: 140,
  },
  trackImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  trackImage: {
    width: "100%",
    height: "100%",
  },
  trackTitle: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  trackArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  bentoGrid: {
    flexDirection: "row",
    paddingHorizontal: 24,
    gap: 16,
    height: 380,
  },
  bentoLarge: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  bentoLargeContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  bentoLargeTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 32,
  },
  bentoLargeSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 8,
  },
  bentoRightColumn: {
    flex: 1,
    gap: 16,
  },
  bentoSmallGroup1: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    padding: 20,
    justifyContent: "space-between",
  },
  bentoSmallGroup2: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 12,
    padding: 20,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(73, 68, 84, 0.05)",
  },
  bentoSmallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  discoverBadge: {
    backgroundColor: "rgba(76, 215, 246, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
  },
  discoverText: {
    color: theme.colors.secondary,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bentoSmallTitle: {
    color: theme.colors.onSurface,
    fontSize: 18,
    fontWeight: "700",
  },
  bentoSmallSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 4,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: 12,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    gap: 8,
  },
  moodLabel: {
    fontWeight: "600",
    fontSize: 14,
  },
  miniPlayer: {
    position: "absolute",
    bottom: 96,
    left: 16,
    right: 16,
  },
  miniPlayerGlass: {
    backgroundColor: "rgba(53, 53, 52, 0.6)",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    overflow: "hidden",
  },
  miniPlayerProgress: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: theme.colors.primary,
    width: "65%",
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  miniPlayerImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  miniPlayerInfo: {
    flex: 1,
  },
  miniPlayerTitle: {
    color: theme.colors.onSurface,
    fontSize: 14,
    fontWeight: "700",
  },
  miniPlayerArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
  },
  miniPlayerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingRight: 8,
  },
  miniPlayerActionBtn: {
    padding: 4,
  },
  miniPlayerPlayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
