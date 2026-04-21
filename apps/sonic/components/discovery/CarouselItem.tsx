import { theme, withAlpha } from "@/constants/theme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CarouselItemProps } from "./types/carousel";

export const CarouselItem = ({ item, onPress }: CarouselItemProps) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress?.(item)}
    >
      <Image
        source={item.image}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={300}
      />
      <LinearGradient
        colors={[
          theme.colors.transparent,
          withAlpha(theme.colors.primaryContainer, 0.9),
        ]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 1 }}
      />
      <View style={styles.cardContent}>
        {item.tag && (
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        )}
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {item.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 220,
    marginTop: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  cardContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  tagBadge: {
    backgroundColor: theme.colors.secondary + "40",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagText: {
    color: theme.colors.white,
    fontFamily: theme.typography.body,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.white,
    lineHeight: 32,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: 14,
    fontWeight: "500",
    color: withAlpha(theme.colors.white, 0.8),
  },
});
