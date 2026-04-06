import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedText } from "../../../components/themed-text";
import { ScreenWrapper } from "../../../components/ui/ScreenWrapper";
import { theme, withAlpha } from "../../../constants/theme";

export default function DiscoveryScreen() {
  const genres = useMemo(
    () => [
      {
        title: "Pop",
        icon: "sparkles",
        colors: ["#7C3AED", "#4C1D95"] as const,
      },
      {
        title: "Hip-Hop",
        icon: "options",
        colors: ["#0D9488", "#134E4A"] as const,
      },
      { title: "Rock", icon: "flash", colors: ["#D97706", "#9A3412"] as const },
      { title: "Indie", icon: "book", colors: ["#E11D48", "#881337"] as const },
      {
        title: "Electronic",
        icon: "radio-outline",
        colors: ["#0284C7", "#1E3A5F"] as const,
      },
      {
        title: "K-Pop",
        icon: "heart",
        colors: ["#C026D3", "#581C87"] as const,
      },
    ],
    [],
  );

  const creators = useMemo(
    () => [
      {
        name: "Luna Vibe",
        type: "Soul Artist",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCyS47vlApRrkUc3btAp8PYXmbbROeOwfznQ31_94xx33T87_YnaR54Q1aI8eOMK1tnlGPshrdlJ6aFgDTuzoC25jOwHaqFDrKZtoCLZTq97_kYqoq22nBuwbOe0UGn8nPEelobbwuBYeJFjnLLohC_gwKhhZZT9yyyU2bznFQke3z3t9Tk5GpQX6MPw-U_tWhAC6OFx2leB4QG6SVMB6jV3AMWC79o1bYcsFki7df8m7Uq0weVYIf00DaI7dJKnMZ48YNFP2z1C0ee",
        ring: theme.colors.primaryContainer,
      },
      {
        name: "The Jazz Theory",
        type: "Podcast",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBkwJLZ5V8GloYEeLsp99mO-mR7Uwpggcp0Xv3xfthj3h6aYPnWjX3oQ14CdHe1Tfxkvayg1fM8lZ7XewGoNwHMT8Uw3wa75OfNG0za-HaBvHPnhtPT7YDFWt_yaTT75TCi_rxTjQjINPxTLBZQ5lyINu4ZmmMMu-HYUnv0gMbuYtmTt_8cfTG2MMpSaLFzVomcSEXoB0eAOyBGPPqktK7MKSeE1iiqzxy_0SjDFNR1uUALpWLS2T-LrMMoBpOJ4amhxHr1WTxGHdIr",
        ring: theme.colors.secondaryContainer,
      },
      {
        name: "Synesthesia",
        type: "Producer",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBegpJznwSs6-9v8mwQbl7tj1sOamhfhjZoF8DqS2lV9h-DVWikCSXBKgDpX7j2kff0PyCZE6289XuA7NVXdcsBpLXnxu1POphkqYZTCGgZQj_otEXA-LNYRdNOS5yWST2Ram-QbyjvYpMM3Tm_q4Ooc-sczMIg4BlxrZD1pdfTYlPEA3IpzBezpV2D4sGqI1qBjuM-hVP1mzpnDTFRNSzWdGudfGjf3fsyj4Gk-Q43ZIjA-Zxdv_Q2YyQE56tBxhWwYH3pfxWq0Sm4",
        ring: theme.colors.tertiaryContainer,
      },
      {
        name: "The Beat Lab",
        type: "Tutorials",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuD11N9m70FdD5dWfPFI-3isZde32t4mxSS3yiPzPl-nf0MKgpjh7DV-AgWXMOPwnHn9AM93gyIRTiXpXikyoRrg6UWDQHDwjzwf1Kw0fmEU-QPB8a4mCuWIKU3BvaVq9TtwXszGPFfUvZF8TGyLyMAz_TEGKkCZRwRvA5yNCDMBGxgS-27cpJeQGj927pRS---u8MEnlrTGXZ-xKDx9zMQLoIEDoecQh5XYbEbcl8LfAlClu111plS68qJr4oYWzAtz7AbCXPQAowS-",
        ring: theme.colors.primaryContainer,
      },
    ],
    [],
  );

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.profileContainer}>
            <Image
              source="https://lh3.googleusercontent.com/aida-public/AB6AXuA1U3ZmRJQJ77r4nktTyT5hmLX-zZA1EhG1t4I4FTHW6ZUU01-PovW0Yo_SHm1gSJ-7SLPkKYvuVVrMUpBh8EWLke_oF1awLk4LpcTAXGt4ufbXbu_RqQbETjg8OxGEBEXx2089ZFwNlXrbYknQ0Pu-A-_giFakVlaQmedpSxZlx5jUIcp5v1sEiPXXkYOd4kcgA_QRtzAzgG3xeiYsDLn3g7ul05Xwl2O3JoUQDuFUKcF1rXl8TT5WmNwFMzewShZHOxZPeHKFRL6s"
              style={styles.profileImage}
              transition={200}
              contentFit="cover"
            />
          </View>
          <ThemedText style={styles.headerTitle}>Discover</ThemedText>
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
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.outline}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Artists, songs, or podcasts"
              placeholderTextColor={theme.colors.outline + "80"}
            />
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons
                name="mic-outline"
                size={20}
                color={theme.colors.outline}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Trending Now</ThemedText>
          <View style={styles.trendingGrid}>
            <TouchableOpacity style={styles.trendingMain} activeOpacity={0.85}>
              <Image
                source="https://lh3.googleusercontent.com/aida-public/AB6AXuD1saWMSV6xq7zRx0XShrRkEGNhae8p66qNYUFQrpOUWjdBCbZwenzPewHQnSF0VGNyoEQPFlVaAgErtP6QZBfX_J65xrXkkgxxNHxaXzTLiCCQBdIoqcY_LLe9UQXLk8Bnvs5S9FW1Zkmp8nHezHuie0_X5kW3xrFckyZMOauqrkYCcKB7AO7SZa1aAEOggNnpJYKiD1Oy0XcHtqST4lh4TCmW94DYRTVuaXJ6LKSaQh9P6IB9MIgEuleykEEHuS2b6la7kCGlzCLS"
                style={StyleSheet.absoluteFillObject}
                transition={300}
                contentFit="cover"
              />
              <LinearGradient
                colors={[
                  "transparent",
                  withAlpha(theme.colors.surfaceDim, 0.9),
                ]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.trendingMainContent}>
                <View style={styles.editorBadge}>
                  <ThemedText style={styles.editorBadgeText}>
                    EDITOR'S PICK
                  </ThemedText>
                </View>
                <ThemedText style={styles.trendingMainTitle}>
                  Neo-Soul Revival
                </ThemedText>
                <ThemedText style={styles.trendingMainSubtitle}>
                  Experience the newest wave of urban rhythm
                </ThemedText>
              </View>
            </TouchableOpacity>

            <View style={styles.trendingSide}>
              <TouchableOpacity
                style={styles.trendingSideCard}
                activeOpacity={0.8}
              >
                <Image
                  source="https://lh3.googleusercontent.com/aida-public/AB6AXuAI1mnSvpDCBUA2CMAt2OXyXIa9y2dp1mkQbFn4VvSUgSRVSLriYgvYK54JLNo3woCoNUVel1qIPbkNkoOOIpiKT9eg3Af7TFtAbJ4QIXnMp9dTKBjXpTojZTILQnLopHT8o0SMJcFgzFBboKQWB-Hi5JB2Ny_e8N5Rw83q3WOXXx92EizdZxfjAZI3rezswkzrLPgzbSx2mGWRdpm28_rQfH8uXcbGc_arK96Og0mYLGfKQ_4aPLn25PwPG1vFYpCRGrQ48qmSyq51"
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}
                  transition={300}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={[
                    "transparent",
                    withAlpha(theme.colors.surfaceDim, 0.7),
                  ]}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.trendingSideContent}>
                  <Text style={styles.trendingSideTitle}>Midnight Techno</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.trendingSideCard}
                activeOpacity={0.8}
              >
                <Image
                  source="https://lh3.googleusercontent.com/aida-public/AB6AXuDVh8ItPeHuH-Cv_M6pYdbszxH2j0AvOQyHTOPgdAKbrunleJ_QFhYEluk9YDauys6ayLn4ki5s9_KoX1rve5zg_xhh_aHg60-wJPNbAofqYkNH8mHOq0E_eRU7lbGLpYBdBEYbRm0RWkuK91AFDX6XKHNYQHqVf0NJRryeUSI3WsgczdYURvNkayKUTk4rz08Bpjlsmm-My23Ln5PDIvHtovmwuxB2QrHJAL-3vpm7GVGTl7ZQWqZRe5sN0z5WUFK2GGK6v_OvX8US"
                  style={[StyleSheet.absoluteFillObject, { opacity: 0.5 }]}
                  transition={300}
                  contentFit="cover"
                />
                <LinearGradient
                  colors={[
                    "transparent",
                    withAlpha(theme.colors.surfaceDim, 0.7),
                  ]}
                  style={StyleSheet.absoluteFillObject}
                />
                <View style={styles.trendingSideContent}>
                  <Text style={styles.trendingSideTitle}>Lofi Study</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitleNoPad}>Browse All</ThemedText>
            <TouchableOpacity activeOpacity={0.7}>
              <ThemedText style={styles.seeAllAction}>See All</ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.genreGrid}>
            {genres.map((genre, idx) => (
              <TouchableOpacity
                key={genre.title}
                style={styles.genreCardWrapper}
                activeOpacity={0.8}
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <LinearGradient
                  colors={genre.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.genreCard}
                >
                  <ThemedText style={styles.genreTitle}>
                    {genre.title}
                  </ThemedText>
                  <Ionicons
                    name={genre.icon as any}
                    size={56}
                    color={withAlpha(theme.colors.white, 0.15)}
                    style={styles.genreIcon}
                  />
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <ThemedText style={styles.sectionTitle}>Creators On Fire</ThemedText>
          <FlatList
            data={creators}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.creatorCard}
                activeOpacity={0.8}
                onPress={() =>
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                }
              >
                <View
                  style={[
                    styles.creatorImageWrapper,
                    { borderColor: item.ring },
                  ]}
                >
                  <Image
                    source={item.image}
                    style={styles.creatorImage}
                    transition={300}
                    contentFit="cover"
                  />
                </View>
                <ThemedText style={styles.creatorName} numberOfLines={1}>
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.creatorType} numberOfLines={1}>
                  {item.type}
                </ThemedText>
              </TouchableOpacity>
            )}
          />
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 24,
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
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
    paddingBottom: 140,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 24,
  },
  searchContainer: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "20",
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.body,
    fontSize: 15,
  },
  sectionContainer: {
    marginBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    paddingHorizontal: 20,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  sectionTitleNoPad: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  seeAllAction: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  trendingGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    height: 400,
    gap: 12,
  },
  trendingMain: {
    flex: 7,
    borderRadius: 16,
    overflow: "hidden",
  },
  trendingMainContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  editorBadge: {
    backgroundColor: theme.colors.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  editorBadgeText: {
    color: theme.colors.white,
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
  },
  trendingMainTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.white,
    marginBottom: 6,
  },
  trendingMainSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "500",
  },
  trendingSide: {
    flex: 5,
    gap: 12,
  },
  trendingSideCard: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerLow,
    borderRadius: 16,
    overflow: "hidden",
  },
  trendingSideContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },
  trendingSideTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.white,
  },
  genreGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  genreCardWrapper: {
    width: "47%",
    height: 100,
  },
  genreCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    position: "relative",
    overflow: "hidden",
  },
  genreTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.white,
    zIndex: 10,
  },
  genreIcon: {
    position: "absolute",
    right: -6,
    bottom: -6,
    transform: [{ rotate: "12deg" }],
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 24,
  },
  creatorCard: {
    width: 120,
    alignItems: "center",
  },
  creatorImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 2.5,
  },
  creatorImage: {
    width: "100%",
    height: "100%",
  },
  creatorName: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: 14,
    textAlign: "center",
  },
  creatorType: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
    fontWeight: "500",
  },
});
