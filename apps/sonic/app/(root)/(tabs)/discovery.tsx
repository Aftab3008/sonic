import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../../components/ui/ScreenWrapper';
import { theme } from '../../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function DiscoveryScreen() {

  const genres = [
    { title: 'Pop', icon: 'sparkles', colors: ['#7c3aed', '#312e81'] as const },           // violet-600 to indigo-900
    { title: 'Hip-Hop', icon: 'options', colors: ['#10b981', '#115e59'] as const },        // emerald-500 to teal-800
    { title: 'Rock', icon: 'flash', colors: ['#f59e0b', '#c2410c'] as const },             // amber-500 to orange-700
    { title: 'Indie', icon: 'book', colors: ['#f43f5e', '#9d174d'] as const },             // rose-500 to pink-800
    { title: 'Electronic', icon: 'radio-outline', colors: ['#0ea5e9', '#1e40af'] as const },// sky-500 to blue-800
    { title: 'K-Pop', icon: 'heart', colors: ['#d946ef', '#581c87'] as const },            // fuchsia-500 to purple-900
  ];

  const creators = [
    { name: 'Luna Vibe', type: 'Soul Artist', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyS47vlApRrkUc3btAp8PYXmbbROeOwfznQ31_94xx33T87_YnaR54Q1aI8eOMK1tnlGPshrdlJ6aFgDTuzoC25jOwHaqFDrKZtoCLZTq97_kYqoq22nBuwbOe0UGn8nPEelobbwuBYeJFjnLLohC_gwKhhZZT9yyyU2bznFQke3z3t9Tk5GpQX6MPw-U_tWhAC6OFx2leB4QG6SVMB6jV3AMWC79o1bYcsFki7df8m7Uq0weVYIf00DaI7dJKnMZ48YNFP2z1C0ee', ring: theme.colors.primary },
    { name: 'The Jazz Theory', type: 'Podcast', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkwJLZ5V8GloYEeLsp99mO-mR7Uwpggcp0Xv3xfthj3h6aYPnWjX3oQ14CdHe1Tfxkvayg1fM8lZ7XewGoNwHMT8Uw3wa75OfNG0za-HaBvHPnhtPT7YDFWt_yaTT75TCi_rxTjQjINPxTLBZQ5lyINu4ZmmMMu-HYUnv0gMbuYtmTt_8cfTG2MMpSaLFzVomcSEXoB0eAOyBGPPqktK7MKSeE1iiqzxy_0SjDFNR1uUALpWLS2T-LrMMoBpOJ4amhxHr1WTxGHdIr', ring: theme.colors.secondary },
    { name: 'Synesthesia', type: 'Producer', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBegpJznwSs6-9v8mwQbl7tj1sOamhfhjZoF8DqS2lV9h-DVWikCSXBKgDpX7j2kff0PyCZE6289XuA7NVXdcsBpLXnxu1POphkqYZTCGgZQj_otEXA-LNYRdNOS5yWST2Ram-QbyjvYpMM3Tm_q4Ooc-sczMIg4BlxrZD1pdfTYlPEA3IpzBezpV2D4sGqI1qBjuM-hVP1mzpnDTFRNSzWdGudfGjf3fsyj4Gk-Q43ZIjA-Zxdv_Q2YyQE56tBxhWwYH3pfxWq0Sm4', ring: theme.colors.tertiary },
    { name: 'The Beat Lab', type: 'Tutorials', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD11N9m70FdD5dWfPFI-3isZde32t4mxSS3yiPzPl-nf0MKgpjh7DV-AgWXMOPwnHn9AM93gyIRTiXpXikyoRrg6UWDQHDwjzwf1Kw0fmEU-QPB8a4mCuWIKU3BvaVq9TtwXszGPFfUvZF8TGyLyMAz_TEGKkCZRwRvA5yNCDMBGxgS-27cpJeQGj927pRS---u8MEnlrTGXZ-xKDx9zMQLoIEDoecQh5XYbEbcl8LfAlClu111plS68qJr4oYWzAtz7AbCXPQAowS-', ring: theme.colors.primary },
  ];

  return (
    <ScreenWrapper>
      {/* Top App Bar */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1U3ZmRJQJ77r4nktTyT5hmLX-zZA1EhG1t4I4FTHW6ZUU01-PovW0Yo_SHm1gSJ-7SLPkKYvuVVrMUpBh8EWLke_oF1awLk4LpcTAXGt4ufbXbu_RqQbETjg8OxGEBEXx2089ZFwNlXrbYknQ0Pu-A-_giFakVlaQmedpSxZlx5jUIcp5v1sEiPXXkYOd4kcgA_QRtzAzgG3xeiYsDLn3g7ul05Xwl2O3JoUQDuFUKcF1rXl8TT5WmNwFMzewShZHOxZPeHKFRL6s' }}
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
        
        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFillObject} />
            <Ionicons name="search" size={20} color={theme.colors.outline} style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Artists, songs, or podcasts"
              placeholderTextColor={theme.colors.outline}
            />
          </View>
        </View>

        {/* Trending Now */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <View style={styles.trendingGrid}>
            <TouchableOpacity style={styles.trendingMain}>
              <Image 
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1saWMSV6xq7zRx0XShrRkEGNhae8p66qNYUFQrpOUWjdBCbZwenzPewHQnSF0VGNyoEQPFlVaAgErtP6QZBfX_J65xrXkkgxxNHxaXzTLiCCQBdIoqcY_LLe9UQXLk8Bnvs5S9FW1Zkmp8nHezHuie0_X5kW3xrFckyZMOauqrkYCcKB7AO7SZa1aAEOggNnpJYKiD1Oy0XcHtqST4lh4TCmW94DYRTVuaXJ6LKSaQh9P6IB9MIgEuleykEEHuS2b6la7kCGlzCLS' }}
                style={StyleSheet.absoluteFillObject}
              />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={StyleSheet.absoluteFillObject} />
              <View style={styles.trendingMainContent}>
                <View style={styles.editorBadge}>
                  <Text style={styles.editorBadgeText}>EDITOR'S PICK</Text>
                </View>
                <Text style={styles.trendingMainTitle}>Neo-Soul Revival</Text>
                <Text style={styles.trendingMainSubtitle}>Experience the newest wave of urban rhythm</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.trendingSide}>
              <TouchableOpacity style={styles.trendingSideCard}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAI1mnSvpDCBUA2CMAt2OXyXIa9y2dp1mkQbFn4VvSUgSRVSLriYgvYK54JLNo3woCoNUVel1qIPbkNkoOOIpiKT9eg3Af7TFtAbJ4QIXnMp9dTKBjXpTojZTILQnLopHT8o0SMJcFgzFBboKQWB-Hi5JB2Ny_e8N5Rw83q3WOXXx92EizdZxfjAZI3rezswkzrLPgzbSx2mGWRdpm28_rQfH8uXcbGc_arK96Og0mYLGfKQ_4aPLn25PwPG1vFYpCRGrQ48qmSyq51' }}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
                />
                <View style={styles.trendingSideContent}>
                  <Text style={styles.trendingSideTitle}>Midnight Techno</Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.trendingSideCard}>
                <Image 
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVh8ItPeHuH-Cv_M6pYdbszxH2j0AvOQyHTOPgdAKbrunleJ_QFhYEluk9YDauys6ayLn4ki5s9_KoX1rve5zg_xhh_aHg60-wJPNbAofqYkNH8mHOq0E_eRU7lbGLpYBdBEYbRm0RWkuK91AFDX6XKHNYQHqVf0NJRryeUSI3WsgczdYURvNkayKUTk4rz08Bpjlsmm-My23Ln5PDIvHtovmwuxB2QrHJAL-3vpm7GVGTl7ZQWqZRe5sN0z5WUFK2GGK6v_OvX8US' }}
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.6 }]}
                />
                <View style={styles.trendingSideContent}>
                  <Text style={styles.trendingSideTitle}>Lofi Study</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Browse All Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleWithoutPadding}>Browse All</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllAction}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.genreGrid}>
            {genres.map((genre, idx) => (
              <TouchableOpacity key={idx} style={styles.genreCardWrapper}>
                <LinearGradient
                  colors={genre.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.genreCard}
                >
                  <Text style={styles.genreTitle}>{genre.title}</Text>
                  <Ionicons 
                    name={genre.icon as any} 
                    size={64} 
                    color="rgba(255,255,255,0.2)" 
                    style={styles.genreIcon} 
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Creators On Fire */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Creators On Fire</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
            {creators.map((creator, idx) => (
              <TouchableOpacity key={idx} style={styles.creatorCard}>
                <View style={[styles.creatorImageWrapper, { borderColor: creator.ring }]}>
                   <Image source={{ uri: creator.image }} style={styles.creatorImage} />
                </View>
                <Text style={styles.creatorName} numberOfLines={1}>{creator.name}</Text>
                <Text style={styles.creatorType} numberOfLines={1}>{creator.type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
  searchSection: {
    paddingHorizontal: 24,
    marginTop: 16,
    marginBottom: 24,
  },
  searchContainer: {
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(53, 53, 52, 0.4)',
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
  sectionContainer: {
    marginBottom: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.onSurface,
    paddingHorizontal: 24,
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  sectionTitleWithoutPadding: {
    fontFamily: theme.typography.headline,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  seeAllAction: {
    color: theme.colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  trendingGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    height: 420,
    gap: 16,
  },
  trendingMain: {
    flex: 7, // equivalent to col-span-7
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
  },
  trendingMainContent: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
  editorBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  editorBadgeText: {
    color: theme.colors.onPrimaryContainer,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  trendingMainTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  trendingMainSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    opacity: 0.9,
  },
  trendingSide: {
    flex: 5, // equivalent to col-span-5
    gap: 16,
  },
  trendingSideCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingSideContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  trendingSideTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  genreGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
    gap: 16,
  },
  genreCardWrapper: {
    width: '47%', // 2 columns
    height: 112,
  },
  genreCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  genreTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    zIndex: 10,
  },
  genreIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    transform: [{ rotate: '12deg' }],
  },
  horizontalList: {
    paddingHorizontal: 24,
    gap: 32,
  },
  creatorCard: {
    width: 144,
    alignItems: 'center',
  },
  creatorImageWrapper: {
    width: 144,
    height: 144,
    borderRadius: 72,
    overflow: 'hidden',
    marginBottom: 16,
  },
  creatorImage: {
    width: '100%',
    height: '100%',
  },
  creatorName: {
    color: theme.colors.onSurface,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  creatorType: {
    color: theme.colors.outline,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  }
});
