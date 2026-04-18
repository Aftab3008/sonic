import { ASSETS } from "@/constants/assets";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { FC } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LogoutButton } from "../auth/LogoutButton";

export const HomeHeader: FC = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.profileContainer}>
          <Image
            source="https://lh3.googleusercontent.com/aida-public/AB6AXuDRSNrDXxy1IdxzkLWHCrK5pq7SUAWDnLwYI1Meo76NuieQKPSHuSBSlbMSxBAkWb32pk1YaOCnOJ0VdrYdJvDSrpr9Y0DZkzv628PAo5g2idrdd9_jkv9OrX4HRn31S14541trHfbOiGMSlXBtS45EqsaMYbskMzYfhMZaEfAMVCInhKR5CyEVN1qfmFGrG-4cfH0M4cyr42ycOdJPtMJP99CdYC_gYGlNJD63ODNN4vlBbQQ8_4pBpQhpe_ycgCc5FtNX0pkF6MfF"
            style={styles.profileImage}
            transition={200}
            contentFit="cover"
          />
        </View>
        <View style={styles.headerLogoContainer}>
          <Image
            source={ASSETS.appLogo}
            style={styles.headerLogo}
            contentFit="contain"
          />
        </View>
      </View>
      <View style={styles.headerRight}>
        <LogoutButton />
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <View style={styles.iconButtonBg}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={theme.colors.onSurface}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <View style={styles.iconButtonBg}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={theme.colors.onSurface}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: theme.colors.primaryContainer + "40",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  headerLogoContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
  },
  headerLogo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {},
  iconButtonBg: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceContainerHigh,
    alignItems: "center",
    justifyContent: "center",
  },
});
