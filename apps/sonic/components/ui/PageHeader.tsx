import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { moderateFontScale, scale, verticalScale } from "@/lib/scaling";
import { useProfileSheet } from "@/providers/ProfileSheetProvider";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FC } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onProfilePress?: () => void;
  scrollY?: SharedValue<number>;
  showNotifications?: boolean;
  style?: ViewStyle;
}

export const PageHeader: FC<PageHeaderProps> = ({
  title,
  subtitle,
  scrollY,
  showNotifications = true,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { openProfileSheet } = useProfileSheet();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) return {};
    return {
      backgroundColor: withAlpha(
        theme.colors.surface,
        interpolate(
          scrollY.value,
          [0, verticalScale(80)],
          [0, 0.98],
          Extrapolation.CLAMP,
        ),
      ),
      borderBottomColor: withAlpha(
        theme.colors.outlineVariant,
        interpolate(
          scrollY.value,
          [0, verticalScale(80)],
          [0, 0.15],
          Extrapolation.CLAMP,
        ),
      ),
      borderBottomWidth: 1,
    };
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: insets.top + verticalScale(20) },
        animatedStyle,
        style,
      ]}
    >
      <View>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.actions}>
        {showNotifications && (
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Ionicons
              name="notifications-outline"
              size={scale(24)}
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.profileButton}
          activeOpacity={0.7}
          onPress={openProfileSheet}
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
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(16),
    zIndex: 100,
  },
  subtitle: {
    fontFamily: theme.typography.body,
    fontSize: moderateFontScale(14),
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    marginBottom: verticalScale(2),
  },
  title: {
    fontFamily: theme.typography.headline,
    fontSize: moderateFontScale(28),
    fontWeight: "800",
    color: theme.colors.onSurface,
    lineHeight: verticalScale(34),
    letterSpacing: -0.8,
  },
  actions: {
    flexDirection: "row",
    gap: scale(16),
    alignItems: "center",
  },
  iconButton: { padding: scale(4) },
  profileButton: { marginLeft: scale(4) },
  profileImage: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    borderWidth: 1.5,
    borderColor: withAlpha(theme.colors.primary, 0.3),
  },
});
