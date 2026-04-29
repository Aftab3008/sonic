import {
  AlbumIcon,
  ArtistIcon,
  FolderIcon,
  PlaylistIcon,
} from "@/components/ui/Icons";
import { theme, withAlpha } from "@/constants/theme";
import { moderateScale, scale, verticalScale } from "@/lib/scaling";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CategoryCardProps {
  title: string;
  count: string;
  Icon: React.FC<any>;
  onPress: () => void;
  accentColor: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  count,
  Icon,
  onPress,
  accentColor,
}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={styles.card}
    onPress={onPress}
  >
    <View style={[styles.iconContainer, { backgroundColor: withAlpha(accentColor, 0.15) }]}>
      <Icon size={24} color={accentColor} />
    </View>
    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardCount}>{count}</Text>
    </View>
  </TouchableOpacity>
);

export const LibraryCategoryGrid = () => {
  const router = useRouter();

  const categories = [
    {
      title: "Playlists",
      count: "34",
      Icon: PlaylistIcon,
      onPress: () => {},
      accentColor: "#FCD34D", // Amber
    },
    {
      title: "Artists",
      count: "112",
      Icon: ArtistIcon,
      onPress: () => {},
      accentColor: "#67E8F9", // Cyan
    },
    {
      title: "Albums",
      count: "98",
      Icon: AlbumIcon,
      onPress: () => {},
      accentColor: "#C4B5FD", // Lavender
    },
    {
      title: "Local Files",
      count: "45",
      Icon: FolderIcon,
      onPress: () => router.push("/local-files"),
      accentColor: "#6EE7B7", // Emerald
    },
  ];

  return (
    <View style={styles.container}>
      {categories.map((cat, index) => (
        <View key={index} style={styles.cardWrapper}>
          <CategoryCard {...cat} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: scale(16),
    marginBottom: verticalScale(24),
  },
  cardWrapper: {
    width: "50%",
    padding: scale(8),
  },
  card: {
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.4),
    borderRadius: moderateScale(20),
    padding: scale(16),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    minHeight: verticalScale(100),
    justifyContent: "space-between",
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    marginTop: verticalScale(12),
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontFamily: theme.typography.headline,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  cardCount: {
    fontSize: moderateScale(13),
    fontFamily: theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    marginTop: verticalScale(2),
  },
});
