import { theme, withAlpha } from "@/constants/theme";
import { moderateScale, scale, verticalScale } from "@/lib/scaling";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SettingsIcon } from "@/components/ui/Icons";

interface ProfileHeaderProps {
  username?: string | null;
  avatarUrl?: string | null;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  avatarUrl,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Image
          source={{
            uri: avatarUrl || "https://ui-avatars.com/api/?name=John+Doe",
          }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.greeting}>Hi, {username}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.settingsButton}>
        <SettingsIcon size={24} color={theme.colors.onSurface} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(20),
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    borderWidth: 2,
    borderColor: withAlpha(theme.colors.primary, 0.3),
  },
  textContainer: {
    marginLeft: scale(12),
  },
  greeting: {
    fontSize: moderateScale(20),
    fontFamily: theme.typography.headline,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  handle: {
    fontSize: moderateScale(14),
    fontFamily: theme.typography.body,
    color: theme.colors.onSurfaceVariant,
    marginTop: verticalScale(2),
  },
  settingsButton: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(22),
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.5),
    alignItems: "center",
    justifyContent: "center",
  },
});
