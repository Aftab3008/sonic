import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export const AccountHero = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <View style={styles.container}>
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={[
            withAlpha(theme.colors.primary, 0.15),
            withAlpha(theme.colors.primary, 0.05),
            "transparent",
          ]}
          style={styles.glow}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarWrapper}>
          <Image
            source={user?.image || "https://avatar.iran.liara.run/public/30"}
            style={styles.avatar}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.badge}>
            <LinearGradient
              colors={[theme.colors.primary, "#8B5CF6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.badgeGradient}
            >
              <Text style={styles.badgeText}>PRO</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.userName}>{user?.name || "Music Lover"}</Text>
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Sonic Pro User</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 32,
    alignItems: "center",
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    top: -100,
  },
  glow: {
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  content: {
    alignItems: "center",
  },
  avatarWrapper: {
    position: "relative",
    marginBottom: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 4,
    borderColor: theme.colors.surfaceContainerHigh,
  },
  badge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: theme.colors.background,
  },
  badgeGradient: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  textContainer: {
    alignItems: "center",
  },
  userName: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.4),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.outlineVariant, 0.3),
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginRight: 8,
  },
  statusText: {
    color: theme.colors.onSurfaceVariant,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
