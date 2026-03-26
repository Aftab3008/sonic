import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { theme } from '../../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function LibraryScreen() {
  
  const tabs = ['Playlists', 'Artists', 'Albums', 'Podcasts'];

  const recentTracks = [
    { title: 'After Hours', artist: 'The Weeknd', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYOphgJD9EAavg-Ke5Zta-aBuaRmEX5Hikbr02MoGJD9PR5MUct8pXjODCRI4Q1zbne0PMGcXDx42f6tHsSmFRcnPEl_s3e2PwxMkSLZpP3MkCzS5w6U8NJgMGCoNKmK3tdeszupXbMgsgBzh3Ya8GTN50MUd0fX9pVJbrzJrMyIdgn1lbMCiL_LnmJBOyffIbXSwg7aKUKca8l0UYrVmZjBiWQrkhAkBQFdhckLeDgOJ7TKlLRHfaCl1LpK5ltBltDSh3eQYg28sv', showChart: true },
    { title: 'Moonlight', artist: 'Kali Uchis', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAV9s0sUXVH00-YUpwmHqGiIEJGJvBCqgHsILtYQ2IB8GhUYtH1PDpPSjVSZ2UNz_pogMO1NO0Fs4v5aCjYDR38x1vMEu0SPmYZoyudxaEBbjtMhmw2h8Wtn6ec4kNFeMXX6-lJ8M90GCUUSUmfJND3B4nWn12pHcGJ2HdmBEpKoaIw5AAm4N8GT33Px77yD6ZlWlssTnJEXNyAj-mKJi5wvAImmpeS3NO7yLoOC8ipxm3HWInmjMAhKfmGXQURLBXEL26t6kZX3U_8', showChart: false },
    { title: 'Digital Silence', artist: 'Peter McPoland', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAwWLsh_e98QHZ8ntwnZr1PDEExnkG_TykT0-IcemTCJRPHOZTcEudCknDvWWoNiy_c_IdwYzr6bSgv15Kt655Tv3kYMRn3g3atbd-5G7IL8roNgrZZ4EcciqDw3qg7QhbRx9EeSRQc5G8QwMiQZbfzjZ8vO-DbOa5BwBxhQMhQ-JMzsMMjWaVgV8Ym5FLWMUXowkf1asNxFfysfhBMqYDiXrzV06Ue7lzXNl86jAJ87-n8MfXlKFQ4OHPHoh7aAKtmtxixt3nzk81S', showChart: false },
    { title: 'Echoes of Silence', artist: 'Metric', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIH_VzFwKwAi9LnSo7Qcoj1d1WwiXqnxgV-jwjxKPVGgKUy1PaYVbLWaKHZxhaAhIuAYmHKubU4md6XOFrXaWvpUso4N2pB4Nur74eWYL9kBlgJ6-f1JTMil8u8NTUr_BocVeyeD47e4-Vhgi-BXY4JwbuTCByqzoukIIBSFcRdFPACcILzb4ic_Rnv9Rh73h7fN16YwJE5q_piJ7fNkbDWVjZFdjkqvPXdveCkdfWDwQDdPC4a6oaYa515H4ndelZw4BBnl2ZTP-C', showChart: false },
  ];

  return (
    <ScreenWrapper>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSy7BAqDPi0t6f8xtMl7LUB9EEW1EGIt7bGB_xDOTzsHWYXMfJvnzzl1utABdRh5tpyJcXGUv5Dh7_xjfOWoakTuD1cdE_TaLyjV1KyS3Tj-RGZLjBxBrnl1DEfvl8qyltDu8q6qlczdgK0t8aA5ihi7i9fhYgrqxYZKwgP0K3oCk8oYXzYaMhmDxuNL0Me8JkiYlFh4_U_rOyqeTa1_2lAiRSTsW4rpLCyxiXwU-wdKJwmzJMrPNHgf59GpZjj1_F97KrP7Yk7TuH' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.headerTitle}>Sonic</Text>
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.primaryFixed} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section / Library Header */}
        <View style={styles.libraryHeader}>
          <View style={styles.libraryHeaderTopRow}>
            <View>
              <Text style={styles.collectionLabel}>COLLECTION</Text>
              <Text style={styles.libraryTitle}>Your Library</Text>
            </View>
            <TouchableOpacity style={styles.createButton}>
              <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryContainer]}
                style={styles.createButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons name="add" size={18} color={theme.colors.onPrimaryContainer} />
                <Text style={styles.createButtonText}>Create Playlist</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={theme.colors.outline} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search your library..."
              placeholderTextColor={theme.colors.outline}
            />
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
            {tabs.map((tab, idx) => (
              <TouchableOpacity key={idx} style={[styles.tabButton, idx === 0 && styles.tabButtonActive]}>
                <Text style={[styles.tabText, idx === 0 && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Playlists (Editorial Bento) */}
        <View style={styles.bentoSection}>
           <View style={styles.bentoRow}>
             <TouchableOpacity style={styles.bentoLargeItem}>
                <Image 
                   source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyef_nmua5MyXGca_huxyFxlfCkNEVVL5qpco_-MTlRtSWqjd_6XRGhjigSol0Qpx0Lfo4lDir8jFZdAa5x8WoVLiKHKqCR9psjmUO9NVhs4grt5HjwkEhQelbFLDf1n_mvOdoV1sBEwxbLYpJ2zKP-NjtLMkHq5p2lZxm5GWDz8bZkXfX7LUz5Q-uVtUwTbHP5-xEK7PoY1THRonlMAvDVM091AGwdRib2y4T8gq6S7GkvMoSbNUY8AgZcNsA6k0Y0mjfPhNnwzmV' }}
                   style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
                <View style={styles.bentoLargeContent}>
                   <View style={styles.likedIconBg}>
                      <Ionicons name="heart" size={24} color={theme.colors.primary} />
                   </View>
                   <Text style={styles.bentoLargeTitle}>Liked{'\n'}Songs</Text>
                   <Text style={styles.bentoLargeSubtitle}>1,248 tracks</Text>
                </View>
             </TouchableOpacity>

             <View style={styles.bentoSmallColumn}>
                <TouchableOpacity style={styles.bentoSmallItem}>
                  <Image 
                     source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDehWqKaMg9RzNaDA-6LpoRYati_NhoPtXY_57uAddWi2OZpDU8LjVn_SIZ5xJu1MV_BawqWeK39eL3O64zmA_d-2VQ-W3m3Ixr2oP0QsSVE11Qsm7yxPQ9Fil0gNA_rXp-763EKtyIrATwCxbNA7jduAfXzghs708IA-Sbm3sUC8jCRmDpEUj-WUZ7FGO9D-9s_VEljgezOcqMUsC2PgNhAoGgtZdcRhX_8WMQg3NUu0_iP7nD_vXVh19sfh_1mtG36iLJK_d3FQ9v' }}
                     style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFillObject} />
                  <Text style={styles.bentoSmallText}>Late Night</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.bentoSmallItem}>
                  <Image 
                     source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBs2rKkfkcEECoglAT-_SLMr0QlKnk6fWIStpZUX0G_2s5K4NbRXHSK2fpsP2pS94B8NTuc_2UPJ7Ki0bilSkDOYm3CW4shUYte0OmRH5hC7msYbCVvsjn7nfIhQe6iJr_Jf8zT3O7AnU-Uc4zCE7vj507z1OvIiHIg10Rncdz9hdaE-GRTINjlnQn_zwxy3n5hEFlk7f8ZuL2UaljJDv5hgrX1IGzqnaNLSJ6RS3sO6R_3nTC-iSVro4RHmbZsI3ETSXhHObrVOtO0' }}
                     style={StyleSheet.absoluteFillObject}
                  />
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFillObject} />
                  <Text style={styles.bentoSmallText}>Energy Boost</Text>
                </TouchableOpacity>
             </View>
           </View>

           <View style={styles.bentoRow}>
             <TouchableOpacity style={styles.bentoHalfItem}>
                <Image 
                   source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAn-CKgnn-vm_PLxxYb-cs1I6PH0IGxcyZTRVR9tGx76IPnlqvKJcuPPv9vzUC91MHFrL92hBvG9RQ9CfM2EMUywdGJe71vttNg_1O3pjuV_ZBKutuleKjHn1zwxjS_f_xTchnNJzpOD0oVzoC6-vd_FHwU2XAbBiru-eJIrTPobjomuy8tr41ARUa8yrdkiAAq0HSHBNfOg2sn92vIvd4-41gfYbbHtDbDoS4yGEAHlMgfJdCEiXOdjxPbGG_J6DUhVX697UJQ8q_j' }}
                   style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.bentoSmallText}>Focus Flow</Text>
             </TouchableOpacity>

             <TouchableOpacity style={styles.bentoHalfItem}>
                <Image 
                   source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvZ4D1EqgWr90NLA7Ov0vCxob57ygGUvyGXD_YrkPEPgbL_wvLKLayzeBvcLbNTtmHUIRFmRAzq5108lyIXCXzeAtFNeZW-CCIWj4wKiUtUDu1lktLrI8y0MTG7wiQsuKtcFfPUPbv778e8EZQlepkSkm6Q1ag08OTw60pDmfyhTF8DXKe-CaIPAaXWZDKLtY57E3zmZdP9CzrHzzCLN-qqtvL7cM4xyKs4y85H9JL5mzFIKjmiz5cg9FS9_J8Z0ApgYkmaw4pdQBJ' }}
                   style={StyleSheet.absoluteFillObject}
                />
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={StyleSheet.absoluteFillObject} />
                <Text style={styles.bentoSmallText}>Indie Radar</Text>
             </TouchableOpacity>
           </View>
        </View>

        {/* Saved Tracks (Glassmorphism List) */}
        <View style={styles.recentSection}>
           <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Tracks</Text>
              <TouchableOpacity>
                 <Text style={styles.recentSeeAll}>See all</Text>
              </TouchableOpacity>
           </View>
           
           <View style={styles.recentList}>
              {recentTracks.map((track, idx) => (
                 <View key={idx}>
                    <TouchableOpacity style={styles.trackItem}>
                       <View style={styles.trackImageWrapper}>
                          <Image source={{ uri: track.image }} style={styles.trackImage} />
                       </View>
                       <View style={styles.trackInfo}>
                          <Text style={styles.trackTitle}>{track.title}</Text>
                          <Text style={styles.trackArtist}>{track.artist}</Text>
                       </View>
                       <View style={styles.trackActions}>
                          {track.showChart && (
                             <Ionicons name="bar-chart" size={18} color={theme.colors.secondary} />
                          )}
                          <TouchableOpacity style={styles.moreButton}>
                             <Ionicons name="ellipsis-vertical" size={20} color={theme.colors.outline} />
                          </TouchableOpacity>
                       </View>
                    </TouchableOpacity>
                    {idx < recentTracks.length - 1 && (
                       <LinearGradient 
                         colors={['transparent', 'rgba(203, 195, 215, 0.1)', 'transparent']}
                         start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                         style={styles.divider}
                       />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingTop: 48,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceContainerHigh,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(208, 188, 255, 0.2)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    letterSpacing: -0.5,
  },
  iconButton: {
    opacity: 0.8,
  },
  scrollContent: {
    paddingBottom: 120, // space for tab bar
  },
  libraryHeader: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  libraryHeaderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  collectionLabel: {
    color: theme.colors.primary,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  libraryTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 44,
    fontWeight: '800',
    color: theme.colors.onSurface,
    letterSpacing: -1,
  },
  createButton: {
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    marginBottom: 4,
  },
  createButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 9999,
    gap: 8,
  },
  createButtonText: {
    color: theme.colors.onPrimaryContainer,
    fontWeight: '700',
    fontSize: 14,
  },
  searchContainer: {
    height: 56,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: theme.colors.onSurface,
    fontFamily: theme.typography.body,
    fontSize: 16,
  },
  tabsContainer: {
    paddingLeft: 24,
    marginTop: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(73, 68, 84, 0.1)',
  },
  tabsScroll: {
    gap: 32,
    paddingRight: 24,
  },
  tabButton: {
    paddingBottom: 16,
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontWeight: '500',
    color: theme.colors.outline,
    fontSize: 16,
  },
  tabTextActive: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  bentoSection: {
    paddingHorizontal: 24,
    marginTop: 40,
    gap: 16,
  },
  bentoRow: {
    flexDirection: 'row',
    height: 180,
    gap: 16,
  },
  bentoLargeItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bentoLargeContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  likedIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(208, 188, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bentoLargeTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 36,
  },
  bentoLargeSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    marginTop: 4,
  },
  bentoSmallColumn: {
    flex: 1,
    gap: 16,
  },
  bentoSmallItem: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
  },
  bentoSmallText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  bentoHalfItem: {
    flex: 1,
    height: 140, // Different height for the second row
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    padding: 16,
  },
  recentSection: {
    paddingHorizontal: 24,
    marginTop: 48,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  recentTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  recentSeeAll: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  recentList: {
    gap: 4,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  trackImageWrapper: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 16,
  },
  trackImage: {
    width: '100%',
    height: '100%',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: theme.colors.onSurface,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  trackArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  moreButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    width: '100%',
  }
});
