import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { VanguardSectionHeader } from "../home/main/VanguardSectionHeader";

export const DiscoveryBentoGrid: FC = () => {
  const genres = ["Synthwave", "Cyber-Pop", "Lofi Beats", "Neo-Soul"];

  return (
    <View style={styles.container}>
      <VanguardSectionHeader title="Explore Charts" />

      <View style={styles.bentoGrid}>
        <TouchableOpacity style={styles.bentoLarge} activeOpacity={0.85}>
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuA1x87qGdYWHefAHGSWdHct4VdDxM90_WT2AwUbEBcXf5LYxgAEoUWt4X7NDjiVWEwTAspEB8fxv_CRH3jWBXyHUNuLuzjI63rZ6gH9W5f3qtNyIxRY3bG_K6t0UNytMo_ZlZEQZvwODRlGibU6PBdoqenIy38rUa5sZdT9WWghNeU3iPIL9vYLXND6D37P2c2xo8oYvZYgdsJdCeaDLxIbh2LQ-JSwMwCr-2igzljatuFMbOGWBk5UbcsVVLwAMBUBWm3ilugeBDxO"
            style={StyleSheet.absoluteFillObject}
            transition={300}
            contentFit="cover"
          />
          <LinearGradient
            colors={[
              theme.colors.transparent,
              withAlpha(theme.colors.secondaryContainer, 0.95),
            ]}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.bentoLargeContent}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>TRENDING NOW</Text>
            </View>
            <Text style={styles.bentoLargeTitle}>Global{"\n"}Top 50</Text>
            <Text style={styles.bentoLargeSubtitle}>
              The most played tracks right now
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.bentoRightColumn}>
          <TouchableOpacity style={styles.bentoSmallGroup1} activeOpacity={0.8}>
            <View style={styles.bentoSmallHeader}>
              <Ionicons name="flame" size={22} color={theme.colors.error} />
            </View>
            <View>
              <Text style={styles.bentoSmallTitle}>Viral 100</Text>
              <Text style={styles.bentoSmallSubtitle}>Catching fire</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.bentoSmallGroup2} activeOpacity={0.8}>
            <View style={styles.bentoSmallHeader}>
              <Ionicons
                name="sparkles"
                size={22}
                color={theme.colors.tertiary}
              />
            </View>
            <View>
              <Text style={styles.bentoSmallTitle}>Rising Stars</Text>
              <Text style={styles.bentoSmallSubtitle}>Next big things</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.vibeBannerContainer}>
        <VanguardSectionHeader title="Vibe Check" />
        <View style={styles.vibeBannerBox}>
          <Text style={styles.vibeBannerSubtitle}>Pick a mood to explore</Text>
          <View style={styles.pillContainer}>
            {genres.map((genre) => (
              <TouchableOpacity
                key={genre}
                style={styles.pill}
                activeOpacity={0.7}
              >
                <Text style={styles.pillText}>{genre}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  bentoGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    height: 320,
  },
  bentoLarge: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  badge: {
    backgroundColor: theme.colors.white + "25",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  badgeText: {
    color: theme.colors.white,
    fontFamily: theme.typography.body,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  bentoLargeContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  bentoLargeTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: theme.colors.white,
    lineHeight: 34,
    fontFamily: theme.typography.headline,
  },
  bentoLargeSubtitle: {
    color: withAlpha(theme.colors.white, 0.8),
    fontSize: 13,
    marginTop: 8,
    fontWeight: "500",
  },
  bentoRightColumn: {
    flex: 0.8,
    gap: 12,
  },
  bentoSmallGroup1: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainer,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
  },
  bentoSmallGroup2: {
    flex: 1,
    backgroundColor: theme.colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 16,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "10",
  },
  bentoSmallHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  bentoSmallTitle: {
    color: theme.colors.onSurface,
    fontSize: 16,
    fontWeight: "700",
  },
  bentoSmallSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    marginTop: 2,
    fontWeight: "500",
  },
  vibeBannerContainer: {
    marginTop: 32,
  },
  vibeBannerBox: {
    marginHorizontal: 20,
    backgroundColor: withAlpha(theme.colors.surfaceContainerHigh, 0.6),
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "15",
  },
  vibeBannerSubtitle: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 16,
  },
  pillContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  pill: {
    backgroundColor: theme.colors.surfaceContainer,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant + "20",
  },
  pillText: {
    color: theme.colors.onSurface,
    fontSize: 14,
    fontWeight: "600",
  },
});
