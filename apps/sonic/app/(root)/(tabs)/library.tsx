import {
  moderateFontScale,
  moderateScale,
  scale,
  verticalScale,
} from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScreenWrapper } from "../../../components/ui/ScreenWrapper";
import { theme, withAlpha } from "../../../constants/theme";

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Playlists", "Artists", "Albums", "Podcasts"];

  const recentTracks = [
    {
      title: "After Hours",
      artist: "The Weeknd",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYOphgJD9EAavg-Ke5Zta-aBuaRmEX5Hikbr02MoGJD9PR5MUct8pXjODCRI4Q1zbne0PMGcXDx42f6tHsSmFRcnPEl_s3e2PwxMkSLZpP3MkCzS5w6U8NJgMGCoNKmK3tdeszupXbMgsgBzh3Ya8GTN50MUd0fX9pVJbrzJrMyIdgn1lbMCiL_LnmJBOyffIbXSwg7aKUKca8l0UYrVmZjBiWQrkhAkBQFdhckLeDgOJ7TKlLRHfaCl1LpK5ltBltDSh3eQYg28sv",
      showChart: true,
    },
    {
      title: "Moonlight",
      artist: "Kali Uchis",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAV9s0sUXVH00-YUpwmHqGiIEJGJvBCqgHsILtYQ2IB8GhUYtH1PDpPSjVSZ2UNz_pogMO1NO0Fs4v5aCjYDR38x1vMEu0SPmYZoyudxaEBbjtMhmw2h8Wtn6ec4kNFeMXX6-lJ8M90GCUUSUmfJND3B4nWn12pHcGJ2HdmBEpKoaIw5AAm4N8GT33Px77yD6ZlWlssTnJEXNyAj-mKJi5wvAImmpeS3NO7yLoOC8ipxm3HWInmjMAhKfmGXQURLBXEL26t6kZX3U_8",
      showChart: false,
    },
    {
      title: "Digital Silence",
      artist: "Peter McPoland",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAwWLsh_e98QHZ8ntwnZr1PDEExnkG_TykT0-IcemTCJRPHOZTcEudCknDvWWoNiy_c_IdwYzr6bSgv15Kt655Tv3kYMRn3g3atbd-5G7IL8roNgrZZ4EcciqDw3qg7QhbRx9EeSRQc5G8QwMiQZbfzjZ8vO-DbOa5BwBxhQMhQ-JMzsMMjWaVgV8Ym5FLWMUXowkf1asNxFfysfhBMqYDiXrzV06Ue7lzXNl86jAJ87-n8MfXlKFQ4OHPHoh7aAKtmtxixt3nzk81S",
      showChart: false,
    },
    {
      title: "Echoes of Silence",
      artist: "Metric",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBIH_VzFwKwAi9LnSo7Qcoj1d1WwiXqnxgV-jwjxKPVGgKUy1PaYVbLWaKHZxhaAhIuAYmHKubU4md6XOFrXaWvpUso4N2pB4Nur74eWYL9kBlgJ6-f1JTMil8u8NTUr_BocVeyeD47e4-Vhgi-BXY4JwbuTCByqzoukIIBSFcRdFPACcILzb4ic_Rnv9Rh73h7fN16YwJE5q_piJ7fNkbDWVjZFdjkqvPXdveCkdfWDwQDdPC4a6oaYa515H4ndelZw4BBnl2ZTP-C",
      showChart: false,
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <Image
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCSy7BAqDPi0t6f8xtMl7LUB9EEW1EGIt7bGB_xDOTzsHWYXMfJvnzzl1utABdRh5tpyJcXGUv5Dh7_xjfOWoakTuD1cdE_TaLyjV1KyS3Tj-RGZLjBxBrnl1DEfvl8qyltDu8q6qlczdgK0t8aA5ihi7i9fhYgrqxYZKwgP0K3oCk8oYXzYaMhmDxuNL0Me8JkiYlFh4_U_rOyqeTa1_2lAiRSTsW4rpLCyxiXwU-wdKJwmzJMrPNHgf59GpZjj1_F97KrP7Yk7TuH",
              }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.headerTitle}>Library</Text>
        </View>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <View style={styles.iconButtonBg}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={theme.colors.onSurface}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.libraryHeader}>
          <View style={styles.libraryHeaderTopRow}>
            <View>
              <Text style={styles.collectionLabel}>COLLECTION</Text>
              <Text style={styles.libraryTitle}>Your Library</Text>
            </View>
            <TouchableOpacity style={styles.createButton} activeOpacity={0.8}>
              <LinearGradient
                colors={[theme.colors.primaryContainer, theme.colors.primary]}
                style={styles.createButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={18} color={theme.colors.white} />
                <Text style={styles.createButtonText}>Create</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.outline}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your library..."
              placeholderTextColor={theme.colors.outline + "80"}
            />
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {tabs.map((tab, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.tabButton,
                  activeTab === idx && styles.tabButtonActive,
                ]}
                onPress={() => setActiveTab(idx)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === idx && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bentoSection}>
          <View style={styles.bentoRow}>
            <TouchableOpacity
              style={styles.bentoLargeItem}
              activeOpacity={0.85}
            >
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyef_nmua5MyXGca_huxyFxlfCkNEVVL5qpco_-MTlRtSWqjd_6XRGhjigSol0Qpx0Lfo4lDir8jFZdAa5x8WoVLiKHKqCR9psjmUO9NVhs4grt5HjwkEhQelbFLDf1n_mvOdoV1sBEwxbLYpJ2zKP-NjtLMkHq5p2lZxm5GWDz8bZkXfX7LUz5Q-uVtUwTbHP5-xEK7PoY1THRonlMAvDVM091AGwdRib2y4T8gq6S7GkvMoSbNUY8AgZcNsA6k0Y0mjfPhNnwzmV",
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={[
                  theme.colors.transparent,
                  withAlpha(theme.colors.background, 0.85),
                ]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.bentoLargeContent}>
                <View style={styles.likedIconBg}>
                  <Ionicons
                    name="heart"
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.bentoLargeTitle}>Liked{"\n"}Songs</Text>
                <Text style={styles.bentoLargeSubtitle}>1,248 tracks</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.bentoSmallColumn}>
              <TouchableOpacity
                style={styles.bentoSmallItem}
                activeOpacity={0.8}
              >
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDehWqKaMg9RzNaDA-6LpoRYati_NhoPtXY_57uAddWi2OZpDU8LjVn_SIZ5xJu1MV_BawqWeK39eL3O64zmA_d-2VQ-W3m3Ixr2oP0QsSVE11Qsm7yxPQ9Fil0gNA_rXp-763EKtyIrATwCxbNA7jduAfXzghs708IA-Sbm3sUC8jCRmDpEUj-WUZ7FGO9D-9s_VEljgezOcqMUsC2PgNhAoGgtZdcRhX_8WMQg3NUu0_iP7nD_vXVh19sfh_1mtG36iLJK_d3FQ9v",
                  }}
                  style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                  colors={[
                    theme.colors.transparent,
                    withAlpha(theme.colors.background, 0.7),
                  ]}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.bentoSmallText}>Late Night</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.bentoSmallItem}
                activeOpacity={0.8}
              >
                <Image
                  source={{
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBs2rKkfkcEECoglAT-_SLMr0QlKnk6fWIStpZUX0G_2s5K4NbRXHSK2fpsP2pS94B8NTuc_2UPJ7Ki0bilSkDOYm3CW4shUYte0OmRH5hC7msYbCVvsjn7nfIhQe6iJr_Jf8zT3O7AnU-Uc4zCE7vj507z1OvIiHIg10Rncdz9hdaE-GRTINjlnQn_zwxy3n5hEFlk7f8ZuL2UaljJDv5hgrX1IGzqnaNLSJ6RS3sO6R_3nTC-iSVro4RHmbZsI3ETSXhHObrVOtO0",
                  }}
                  style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient
                  colors={[
                    theme.colors.transparent,
                    withAlpha(theme.colors.background, 0.7),
                  ]}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.bentoSmallText}>Energy Boost</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bentoRow}>
            <TouchableOpacity style={styles.bentoHalfItem} activeOpacity={0.8}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn-CKgnn-vm_PLxxYb-cs1I6PH0IGxcyZTRVR9tGx76IPnlqvKJcuPPv9vzUC91MHFrL92hBvG9RQ9CfM2EMUywdGJe71vttNg_1O3pjuV_ZBKutuleKjHn1zwxjS_f_xTchnNJzpOD0oVzoC6-vd_FHwU2XAbBiru-eJIrTPobjomuy8tr41ARUa8yrdkiAAq0HSHBNfOg2sn92vIvd4-41gfYbbHtDbDoS4yGEAHlMgfJdCEiXOdjxPbGG_J6DUhVX697UJQ8q_j",
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={[
                  theme.colors.transparent,
                  withAlpha(theme.colors.background, 0.7),
                ]}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.bentoSmallText}>Focus Flow</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bentoHalfItem} activeOpacity={0.8}>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvZ4D1EqgWr90NLA7Ov0vCxob57ygGUvyGXD_YrkPEPgbL_wvLKLayzeBvcLbNTtmHUIRFmRAzq5108lyIXCXzeAtFNeZW-CCIWj4wKiUtUDu1lktLrI8y0MTG7wiQsuKtcFfPUPbv778e8EZQlepkSkm6Q1ag08OTw60pDmfyhTF8DXKe-CaIPAaXWZDKLtY57E3zmZdP9CzrHzzCLN-qqtvL7cM4xyKs4y85H9JL5mzFIKjmiz5cg9FS9_J8Z0ApgYkmaw4pdQBJ",
                }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient
                colors={[
                  theme.colors.transparent,
                  withAlpha(theme.colors.background, 0.7),
                ]}
                style={StyleSheet.absoluteFillObject}
              />
              <Text style={styles.bentoSmallText}>Indie Radar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Tracks</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.recentSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentList}>
            {recentTracks.map((track, idx) => (
              <View key={idx}>
                <TouchableOpacity style={styles.trackItem} activeOpacity={0.7}>
                  <View style={styles.trackImageWrapper}>
                    <Image
                      source={{ uri: track.image }}
                      style={styles.trackImage}
                    />
                  </View>
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackArtist}>{track.artist}</Text>
                  </View>
                  <View style={styles.trackActions}>
                    {track.showChart && (
                      <Ionicons
                        name="bar-chart"
                        size={18}
                        color={theme.colors.secondary}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.moreButton}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="ellipsis-vertical"
                        size={18}
                        color={theme.colors.outline}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                {idx < recentTracks.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
    paddingVertical: moderateScale(12),
    paddingTop: moderateScale(8),
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(14),
  },
  profileContainer: {
    width: scale(38),
    height: scale(38),
    borderRadius: moderateScale(19),
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer + "40",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(24),
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  iconButton: {},
  iconButtonBg: {
    width: scale(38),
    height: scale(38),
    borderRadius: moderateScale(12),
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: verticalScale(140),
  },
  libraryHeader: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(16),
  },
  libraryHeaderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: moderateScale(24),
  },
  collectionLabel: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: moderateFontScale(10),
    letterSpacing: 2.5,
    marginBottom: moderateScale(6),
  },
  libraryTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(38),
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -1,
  },
  createButton: {
    marginBottom: moderateScale(4),
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(11),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  createButtonText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: moderateFontScale(14),
  },
  searchContainer: {
    height: verticalScale(48),
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: moderateScale(14),
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
  },
  searchIcon: {
    marginRight: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.body,
    fontSize: moderateFontScale(15),
  },
  tabsContainer: {
    paddingLeft: moderateScale(20),
    marginTop: moderateScale(24),
  },
  tabsScroll: {
    gap: moderateScale(8),
    paddingRight: moderateScale(20),
  },
  tabButton: {
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(18),
    borderRadius: moderateScale(12),
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  tabButtonActive: {
    backgroundColor: theme.colors.primaryContainer + "25",
    borderWidth: 1,
    borderColor: theme.colors.primaryContainer + "40",
  },
  tabText: {
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(14),
  },
  tabTextActive: {
    fontWeight: "700",
    color: theme.colors.primary,
  },
  bentoSection: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(24),
    gap: moderateScale(12),
  },
  bentoRow: {
    flexDirection: "row",
    height: verticalScale(180),
    gap: moderateScale(12),
  },
  bentoLargeItem: {
    flex: 1,
    borderRadius: moderateScale(16),
    overflow: "hidden",
  },
  bentoLargeContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: moderateScale(20),
  },
  likedIconBg: {
    width: scale(42),
    height: scale(42),
    borderRadius: moderateScale(14),
    backgroundColor: theme.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: moderateScale(12),
  },
  bentoLargeTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(28),
    fontWeight: "800",
    color: theme.colors.white,
    lineHeight: moderateFontScale(32),
  },
  bentoLargeSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(13),
    marginTop: moderateScale(4),
    fontWeight: "500",
  },
  bentoSmallColumn: {
    flex: 1,
    gap: moderateScale(12),
  },
  bentoSmallItem: {
    flex: 1,
    borderRadius: moderateScale(16),
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: moderateScale(14),
  },
  bentoSmallText: {
    color: theme.colors.white,
    fontWeight: "700",
    fontSize: moderateFontScale(16),
  },
  bentoHalfItem: {
    flex: 1,
    height: verticalScale(140),
    borderRadius: moderateScale(16),
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: moderateScale(14),
  },
  recentSection: {
    paddingHorizontal: moderateScale(20),
    marginTop: moderateScale(36),
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: moderateScale(20),
  },
  recentTitle: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(20),
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  recentSeeAll: {
    color: theme.colors.primary,
    fontSize: moderateFontScale(13),
    fontWeight: "600",
  },
  recentList: {
    gap: moderateScale(2),
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(12),
    borderRadius: moderateScale(14),
  },
  trackImageWrapper: {
    width: scale(52),
    height: scale(52),
    borderRadius: moderateScale(10),
    overflow: "hidden",
    marginRight: moderateScale(14),
  },
  trackImage: {
    width: "100%",
    height: "100%",
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: theme.colors.onSurface,
    fontWeight: "700",
    fontSize: moderateFontScale(15),
    marginBottom: moderateScale(2),
  },
  trackArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: moderateFontScale(13),
    fontWeight: "500",
  },
  trackActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(14),
  },
  moreButton: {
    padding: moderateScale(4),
  },
  divider: {
    height: 1,
    marginHorizontal: moderateScale(12),
    backgroundColor: theme.colors.outlineVariant + "15",
  },
});
