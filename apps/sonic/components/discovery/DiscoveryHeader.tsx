import { ThemedText } from "@/components/themed-text";
import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { verticalScale } from "@/lib/scaling";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DiscoveryHeaderProps {
  scrollY: SharedValue<number>;
  onProfilePress?: () => void;
}

export const DiscoveryHeader: React.FC<DiscoveryHeaderProps> = ({
  scrollY,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const headerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withAlpha(
        theme.colors.surface,
        interpolate(scrollY.value, [0, 100], [0, 0.95], Extrapolation.CLAMP),
      ),
      borderBottomColor: withAlpha(
        theme.colors.outlineVariant,
        interpolate(scrollY.value, [0, 100], [0, 0.1], Extrapolation.CLAMP),
      ),
      borderBottomWidth: 1,
    };
  });

  return (
    <Animated.View
      style={[
        styles.header,
        headerStyle,
        { paddingTop: insets.top + verticalScale(20) },
      ]}
    >
      <View>
        <ThemedText style={styles.greeting}>Explore,</ThemedText>
        <ThemedText style={styles.headerTitle}>New Sounds</ThemedText>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButtonAction} activeOpacity={0.7}>
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: verticalScale(12),
    zIndex: 200,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  greeting: {
    fontFamily: theme.typography.body,
    fontSize: 16,
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    marginBottom: 2,
  },
  headerTitle: {
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
  iconButtonAction: {
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
