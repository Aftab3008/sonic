import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FC, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HomeGreetingHeaderProps {
  onProfilePress?: () => void;
}

export const HomeGreetingHeader: FC<HomeGreetingHeaderProps> = ({
  onProfilePress,
}) => {
  const { data: session } = authClient.useSession();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const user = session?.user;
  const userName = user?.name || "there";

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={0.7}
          onPress={onProfilePress}
        >
          <Image
            source={user?.image || "https://avatar.iran.liara.run/public/30"}
            style={styles.profileImage}
            contentFit="cover"
            transition={200}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(12),
  },
  greeting: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  userName: {
    fontFamily: theme.typography.headline,
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.onSurface,
    letterSpacing: -0.8,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  iconButton: {
    padding: 4,
  },
  profileButton: {
    marginLeft: 4,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: withAlpha(theme.colors.primary, 0.3),
  },
});
