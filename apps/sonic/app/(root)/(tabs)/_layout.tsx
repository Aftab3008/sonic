import CustomTabBar from "@/components/tabs/CustomTabBar";
import { Tabs, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import { TABS_CONFIG } from "../../../constants/navigation";
import { MiniPlayer } from "../../../components/player/MiniPlayer";

export default function TabLayout() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          freezeOnBlur: true,
          // lazy: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        {TABS_CONFIG.map((tab) => (
          <Tabs.Screen key={tab.name} name={tab.name} />
        ))}
      </Tabs>
      <MiniPlayer onPress={() => router.push("/player")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
