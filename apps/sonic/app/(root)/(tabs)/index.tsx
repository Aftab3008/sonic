import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
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
      icon: "leaf-outline" as const,
      isActive: true,
    },
    {
      label: "Energy",
      icon: "flash-outline" as const,
      isActive: false,
    },
    {
      label: "Deep",
      icon: "moon-outline" as const,
      isActive: false,
    },
    {
      label: "Workout",
      icon: "barbell-outline" as const,
      isActive: false,
    },
    {
      label: "Focus",
      icon: "terminal-outline" as const,
      isActive: false,
    },
  ];

  return (
    <ScreenWrapper>
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
          <View style={styles.headerLogoContainer}>
            <Image source={ASSETS.appLogo} style={styles.headerLogo} />
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View style={styles.iconButtonBg}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme.colors.onSurface}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <View style={styles.iconButtonBg}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={theme.colors.onSurface}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <View style={styles.heroBanner}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0fPxbwuSFd8tyGfVsL9ixgh4MqJzQCircTE5nViqU6mzHOK1GVxDr_zOKTr2aRrKfyMTnpHjkfCv8FjL8VFpswNkmWWuFgLlVKnA-rkTDwrVYTd60v04SpWmtFPmyoU3YDyewkdi_zbCE-icYhFrWoz23yN6R-cj4ifsodFqri_g5_mjvpVpMe1u2Y1yWhsvGoKrGu9wMSMAXoNdZgM6Z7w6Lsi4kKbxP_4sLgfzQ_8g5hgrsg-KDhOl2ImIYPwJkg4P7p--y5iMB",
              }}
              style={StyleSheet.absoluteFillObject}
            />
            <LinearGradient
              colors={["transparent", "rgba(10, 10, 15, 0.95)"]}
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
                <TouchableOpacity style={styles.listenButton} activeOpacity={0.8}>
                  <LinearGradient
                    colors={[
                      theme.colors.primaryContainer,
                      theme.colors.primary,
                    ]}
                    style={styles.listenGradient}
                  >
                    <Ionicons
                      name="play"
                      size={16}
                      color="#FFFFFF"
                    />
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

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently Played</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.sectionAction}>View History</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {recentTracks.map((track, i) => (
              <TouchableOpacity key={i} style={styles.trackCard} activeOpacity={0.8}>
                <View style={styles.trackImageContainer}>
                  <Image
                    source={{ uri: track.image }}
                    style={styles.trackImage}
                  />
                  <View style={styles.trackPlayOverlay}>
                    <Ionicons name="play" size={16} color="#FFFFFF" />
                  </View>
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

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleFull}>Made for You</Text>
          <View style={styles.bentoGrid}>
            <TouchableOpacity style={styles.bentoLarge} activeOpacity={0.85}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEKxDLPbZx6QLpYrNVuURdY1sqE14fJMH5ZBnWm5fG_dygoFp1lIpDmh_vS_2mcqHHbAuUDV-lEqwqT5yBC9U_ZeRlwDmfqJdZxXyodptiXHEvIhkffAOpwQwBx3o-r7IIpI_wzw5nB7P1UYwWjgu09pSSX__MSGKO5s0fK7Qd3nVD13sAYt0iCex293os6fdO0lnNhI55Nc4XLdN-sgu0PTmPb8Uua9LKTFUI4xM9A7TRlDgDy0wfLSBc1XVCDgMrP8knevtJ05vl",
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={["transparent", "rgba(124, 58, 237, 0.85)"]}
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
              <TouchableOpacity style={styles.bentoSmallGroup1} activeOpacity={0.8}>
                <View style={styles.bentoSmallHeader}>
                  <Ionicons
                    name="sparkles"
                    size={22}
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

              <TouchableOpacity style={styles.bentoSmallGroup2} activeOpacity={0.8}>
                <Ionicons
                  name="heart"
                  size={22}
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

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleFull}>Select your mood</Text>
          <View style={styles.moodGrid}>
            {moods.map((mood, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.moodButton,
                  mood.isActive && styles.moodButtonActive,
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={mood.icon}
                  size={16}
                  color={mood.isActive ? theme.colors.primary : theme.colors.onSurfaceVariant}
                />
                <Text
                  style={[
                    styles.moodLabel,
                    mood.isActive && styles.moodLabelActive,
                  ]}
                >
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
            <TouchableOpacity style={styles.miniPlayerActionBtn} activeOpacity={0.7}>
              <Ionicons
                name="heart-outline"
                size={20}
                color={theme.colors.onSurface}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.miniPlayerPlayBtn} activeOpacity={0.8}>
              <Ionicons
                name="pause"
                size={18}
                color="#FFFFFF"
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer + "40",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  headerLogoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {},
  iconButtonBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 220,
  },
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
    color: "#FFFFFF",
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
    color: "#FFFFFF",
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
  sectionContainer: {
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  sectionTitleFull: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionAction: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  trackCard: {
    width: 140,
  },
  trackImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  trackImage: {
    width: "100%",
    height: "100%",
  },
  trackPlayOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(10, 10, 15, 0.7)",
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "500",
  },
  bentoGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    height: 360,
  },
  bentoLarge: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  bentoLargeContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  bentoLargeTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    lineHeight: 30,
    fontFamily: theme.typography.headline,
  },
  bentoLargeSubtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },
  bentoRightColumn: {
    flex: 1,
    gap: 12,
  },
  bentoSmallGroup1: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 16,
    padding: 18,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
  },
  bentoSmallGroup2: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 18,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "10",
  },
  bentoSmallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  discoverBadge: {
    backgroundColor: theme.colors.secondary + "18",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discoverText: {
    color: theme.colors.secondary,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  bentoSmallTitle: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: "700",
  },
  bentoSmallSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  moodButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: "transparent",
  },
  moodButtonActive: {
    backgroundColor: theme.colors.primaryContainer + "18",
    borderColor: theme.colors.primaryContainer + "40",
  },
  moodLabel: {
    fontWeight: "600",
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
  },
  moodLabelActive: {
    color: theme.colors.primary,
  },
  miniPlayer: {
    position: "absolute",
    bottom: 100,
    left: 12,
    right: 12,
  },
  miniPlayerGlass: {
    backgroundColor: theme.colors.surfaceContainer + "E6",
    borderRadius: 16,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
    overflow: "hidden",
    elevation: 10,
  },
  miniPlayerProgress: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 2,
    backgroundColor: theme.colors.primary,
    width: "65%",
    borderRadius: 1,
  },
  miniPlayerImage: {
    width: 46,
    height: 46,
    borderRadius: 10,
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
    marginTop: 1,
    fontWeight: "500",
  },
  miniPlayerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingRight: 4,
  },
  miniPlayerActionBtn: {
    padding: 4,
  },
  miniPlayerPlayBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
  },
});
