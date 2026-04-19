import { theme, withAlpha } from "@/constants/theme";
import { authClient } from "@/lib/auth/auth-client";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { Href, Link, useRouter } from "expo-router";
import React, { forwardRef, useCallback, useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ProfileSettingsSheetRef = BottomSheetModal;

export const ProfileSettingsSheet = forwardRef<ProfileSettingsSheetRef>(
  (_, ref) => {
    const { data: session } = authClient.useSession();
    const router = useRouter();
    const snapPoints = useMemo(() => ["50%", "85%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={0.5}
        />
      ),
      [],
    );

    const handleLogout = async () => {
      await authClient.signOut();
    };

    const onPressButton = useCallback(
      (route: Href) => {
        if (ref && "current" in ref && ref.current) {
          ref.current.dismiss();
        }
        router.push(route);
      },
      [ref, router],
    );

    const user = session?.user;

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            <Image
              source={user?.image || "https://avatar.iran.liara.run/public/30"}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || "Music Lover"}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>428</Text>
              <Text style={styles.statLabel}>Liked</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Playlists</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>84</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <View style={styles.settingsList}>
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => onPressButton("/account")}
            >
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.settingLabel}>Account Details</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="color-filter-outline"
                  size={20}
                  color={theme.colors.secondary}
                />
              </View>
              <Text style={styles.settingLabel}>App Theme</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
              <View style={styles.settingIconContainer}>
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={theme.colors.tertiary}
                />
              </View>
              <Text style={styles.settingLabel}>Playback Quality</Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.onSurfaceVariant}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={theme.colors.error}
            />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.surfaceContainerHigh,
  },
  indicator: {
    backgroundColor: theme.colors.outlineVariant,
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: withAlpha(theme.colors.primary, 0.2),
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.onSurface,
    fontFamily: theme.typography.headline,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.3),
    borderRadius: 20,
    paddingVertical: 16,
    marginBottom: 32,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: withAlpha(theme.colors.outlineVariant, 0.5),
  },
  settingsList: {
    gap: 8,
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: withAlpha(theme.colors.surfaceBright, 0.5),
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.onSurface,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: withAlpha(theme.colors.error, 0.1),
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    marginTop: "auto",
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 16,
    fontWeight: "700",
  },
});
