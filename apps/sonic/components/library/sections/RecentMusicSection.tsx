import { theme } from "@/constants/theme";
import { moderateScale, scale, verticalScale } from "@/lib/scaling";
import { Image } from "expo-image";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface RecentItemProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  onPress: () => void;
}

const RecentItem: React.FC<RecentItemProps> = ({
  title,
  subtitle,
  imageUrl,
  onPress,
}) => (
  <TouchableOpacity
    activeOpacity={0.8}
    style={styles.itemContainer}
    onPress={onPress}
  >
    <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
    <Text style={styles.itemTitle} numberOfLines={1}>
      {title}
    </Text>
    <Text style={styles.itemSubtitle} numberOfLines={1}>
      {subtitle}
    </Text>
  </TouchableOpacity>
);

export const RecentMusicSection = () => {
  const recentPlayed = [
    {
      title: "Neon Nights",
      subtitle: "Cyber-Pop Collective",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuATjk5Wc_UjwJhHCuw1UM7fsH_T4vrbYFAYq95Akx409Fd39ko-ZFZkReKv2X2fGyG4EmduGfWXTmU4XURHDO4p_G65PWPjBl7uXa-T2-X1C4LNGaDZosAvc7aGaIHUK3NCLKzK6ElkYg6Z1pvxb45VFWCICXp6EvOSFwJAkGk62xfojI3FqhpFw4XpyKLUFF-GzNTfWceodocignIbCy1AfZCkt1mxL8DmUH1c6ApPrNV9m0lV9wRI90BuOFV0EX5Ilar9eqPzwDKS",
    },
    {
      title: "Retro Soul",
      subtitle: "The Groove Band",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1x87qGdYWHefAHGSWdHct4VdDxM90_WT2AwUbEBcXf5LYxgAEoUWt4X7NDjiVWEwTAspEB8fxv_CRH3jWBXyHUNuLuzjI63rZ6gH9W5f3qtNyIxRY3bG_K6t0UNytMo_ZlZEQZvwODRlGibU6PBdoqenIy38rUa5sZdT9WWghNeU3iPIL9vYLXND6D37P2c2xo8oYvZYgdsJdCeaDLxIbh2LQ-JSwMwCr-2igzljatuFMbOGWBk5UbcsVVLwAMBUBWm3ilugeBDxO",
    },
    {
      title: "Silent Echo",
      subtitle: "Acoustic Dreams",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg4NHkIsurO9L_XrD2fCBduzSG0DhCI4viHh3VxbUkT_d3MvPzLofUqGhK0YhFFMXCPqSNmOLuzgEVAx2tkXgDi10N2qE_ihVgjkGrNd8V0DQgGg2_UzUgkDYG9RwhIIMNOOgeKuAejXIAVdq4TOqhc2epaF_C59355Nlt1mnT4casw6y43y3RcGluhkoZzOTXqVplz-iVg1JemFChskQfJNQiYOdrA5S0BaCG0s61u8sE6MOC7rgkrXpSRtWdlJXm0N1WG40mNh8X",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {recentPlayed.map((item, index) => (
          <RecentItem key={index} {...item} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(12),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(24),
    marginBottom: verticalScale(16),
  },
  sectionTitle: {
    fontSize: moderateScale(20),
    fontFamily: theme.typography.headline,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  seeAll: {
    fontSize: moderateScale(14),
    fontFamily: theme.typography.body,
    color: theme.colors.primary,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(20),
  },
  itemContainer: {
    width: scale(120),
    marginRight: scale(16),
  },
  image: {
    width: scale(120),
    height: scale(120),
    borderRadius: moderateScale(16),
    backgroundColor: theme.colors.surfaceBright,
  },
  itemTitle: {
    fontSize: moderateScale(14),
    fontFamily: theme.typography.headline,
    fontWeight: "600",
    color: theme.colors.onSurface,
    marginTop: verticalScale(8),
  },
  itemSubtitle: {
    fontSize: moderateScale(12),
    fontFamily: theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    marginTop: verticalScale(2),
  },
});
