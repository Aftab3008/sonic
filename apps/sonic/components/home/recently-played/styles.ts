import { theme, withAlpha } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: theme.typography.headline,
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.onSurface,
    letterSpacing: -0.3,
  },
  sectionAction: {
    color: theme.colors.primary,
    fontWeight: "600",
    fontSize: 13,
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  trackCard: {
    width: 140,
  },
  trackImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 10,
    position: "relative",
  },
  trackImage: {
    width: "100%",
    height: "100%",
  },
  trackPlayOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: withAlpha(theme.colors.surfaceDim, 0.7),
    alignItems: "center",
    justifyContent: "center",
  },
  trackTitle: {
    color: theme.colors.onSurface,
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 2,
  },
  trackArtist: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "500",
  },
});
