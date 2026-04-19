import { AccountHero } from "@/components/account/AccountHero";
import { AccountSettingsList } from "@/components/account/AccountSettingsList";
import { AccountStats } from "@/components/account/AccountStats";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function AccountScreen() {
  const router = useRouter();

  return (
    <ScreenWrapper useScroll containerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
      </View>

      <AccountHero />
      <AccountStats />
      <AccountSettingsList />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceContainer,
  },
});
