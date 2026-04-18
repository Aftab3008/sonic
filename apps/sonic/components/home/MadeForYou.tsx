import { ThemedText } from "@/components/themed-text";
import { theme, withAlpha } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const MadeForYou: FC = () => {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionTitleFull}>Made for You</ThemedText>
      <View style={styles.bentoGrid}>
        <TouchableOpacity style={styles.bentoLarge} activeOpacity={0.85}>
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuCEKxDLPbZx6QLpYrNVuURdY1sqE14fJMH5ZBnWm5fG_dygoFp1lIpDmh_vS_2mcqHHbAuUDV-lEqwqT5yBC9U_ZeRlwDmfqJdZxXyodptiXHEvIhkffAOpwQwBx3o-r7IIpI_wzw5nB7P1UYwWjgu09pSSX__MSGKO5s0fK7Qd3nVD13sAYt0iCex293os6fdO0lnNhI55Nc4XLdN-sgu0PTmPb8Uua9LKTFUI4xM9A7TRlDgDy0wfLSBc1XVCDgMrP8knevtJ05vl"
            style={StyleSheet.absoluteFillObject}
            transition={300}
            contentFit="cover"
          />
          <LinearGradient
            colors={[
              theme.colors.transparent,
              withAlpha(theme.colors.primaryContainer, 0.85),
            ]}
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
            <Ionicons name="heart" size={22} color={theme.colors.tertiary} />
            <View>
              <Text style={styles.bentoSmallTitle}>Liked Tracks</Text>
              <Text style={styles.bentoSmallSubtitle}>428 gems saved</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 40,
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
    color: theme.colors.white,
    lineHeight: 30,
    fontFamily: theme.typography.headline,
  },
  bentoLargeSubtitle: {
    color: withAlpha(theme.colors.white, 0.7),
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
});
