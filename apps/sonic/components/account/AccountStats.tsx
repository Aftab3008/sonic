import { theme, withAlpha } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface StatItemProps {
  label: string;
  value: string;
  isLast?: boolean;
}

const StatItem = ({ label, value }: StatItemProps) => (
  <View style={styles.statBox}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export const AccountStats = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <StatItem label="Followers" value="12.4K" />
          <View style={styles.dividerVertical} />
          <StatItem label="Following" value="842" />
        </View>

        <View style={styles.dividerHorizontal} />

        <View style={styles.row}>
          <StatItem label="Artists" value="156" />
          <View style={styles.dividerVertical} />
          <StatItem label="Liked" value="3,204" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  card: {
    backgroundColor: withAlpha(theme.colors.surfaceContainer, 0.6),
    borderRadius: 24,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.3),
    padding: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.onSurface,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dividerVertical: {
    width: 1,
    height: 40,
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.3),
  },
  dividerHorizontal: {
    height: 1,
    width: "90%",
    alignSelf: "center",
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.3),
  },
});
