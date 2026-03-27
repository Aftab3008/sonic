import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../../constants/theme";
import { ScreenWrapper } from "../../../components/ui/ScreenWrapper";
import { LinearGradient } from "expo-linear-gradient";

export default function SearchScreen() {
  const [query, setQuery] = useState("");

  const recentSearches = [
    "Neon Nights",
    "The Weeknd",
    "Lofi beats",
    "Indie playlist",
    "Jazz Theory",
  ];

  const trendingSearches = [
    { title: "Vibe Theory", subtitle: "Artist", icon: "person-outline" as const },
    { title: "Refractions", subtitle: "Album", icon: "disc-outline" as const },
    { title: "Neo-Soul Revival", subtitle: "Playlist", icon: "list-outline" as const },
    { title: "Midnight Techno", subtitle: "Genre", icon: "musical-notes-outline" as const },
  ];

  const quickCategories = [
    { label: "New Releases", icon: "sparkles-outline" as const, colors: ["#7C3AED", "#4C1D95"] as const },
    { label: "Charts", icon: "trending-up-outline" as const, colors: ["#0891B2", "#164E63"] as const },
    { label: "Podcasts", icon: "mic-outline" as const, colors: ["#D97706", "#78350F"] as const },
    { label: "Live Events", icon: "radio-outline" as const, colors: ["#E11D48", "#881337"] as const },
    { label: "Audiobooks", icon: "book-outline" as const, colors: ["#059669", "#064E3B"] as const },
    { label: "Made for You", icon: "heart-outline" as const, colors: ["#C026D3", "#581C87"] as const },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.outline}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="What do you want to listen to?"
              placeholderTextColor={theme.colors.outline + "80"}
              value={query}
              onChangeText={setQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
                <Ionicons name="close-circle" size={20} color={theme.colors.outline} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Browse</Text>
          <View style={styles.categoryGrid}>
            {quickCategories.map((cat, idx) => (
              <TouchableOpacity key={idx} style={styles.categoryCard} activeOpacity={0.8}>
                <LinearGradient
                  colors={cat.colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}
                >
                  <Ionicons name={cat.icon} size={22} color="#FFFFFF" />
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Trending Searches</Text>
            <Ionicons name="trending-up" size={18} color={theme.colors.primary} />
          </View>
          <View style={styles.trendingList}>
            {trendingSearches.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.trendingItem} activeOpacity={0.7}>
                <View style={styles.trendingNumber}>
                  <Text style={styles.trendingNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.trendingIconBg}>
                  <Ionicons name={item.icon} size={18} color={theme.colors.primary} />
                </View>
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingTitle}>{item.title}</Text>
                  <Text style={styles.trendingSubtitle}>{item.subtitle}</Text>
                </View>
                <Ionicons name="arrow-forward" size={16} color={theme.colors.outline} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleNoPad}>Recent Searches</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentChips}>
            {recentSearches.map((search, idx) => (
              <TouchableOpacity key={idx} style={styles.recentChip} activeOpacity={0.7}>
                <Ionicons name="time-outline" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={styles.recentChipText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 8,
  },
  headerTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 28,
  },
  searchContainer: {
    height: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    gap: 12,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "20",
  },
  searchInput: {
    flex: 1,
    height: "100%",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.body,
    fontSize: 15,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.onSurface,
    paddingHorizontal: 20,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleNoPad: {
    fontFamily: theme.typography.headline,
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  clearText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    height: 80,
  },
  categoryGradient: {
    flex: 1,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryLabel: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  trendingList: {
    paddingHorizontal: 20,
    gap: 4,
  },
  trendingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 14,
  },
  trendingNumber: {
    width: 24,
    alignItems: "center",
  },
  trendingNumberText: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.onSurfaceVariant,
    fontFamily: theme.typography.headline,
  },
  trendingIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.primaryContainer + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  trendingInfo: {
    flex: 1,
  },
  trendingTitle: {
    color: theme.colors.onSurface,
    fontSize: 15,
    fontWeight: "600",
  },
  trendingSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  recentChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 10,
  },
  recentChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
  },
  recentChipText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 13,
    fontWeight: "500",
  },
});
