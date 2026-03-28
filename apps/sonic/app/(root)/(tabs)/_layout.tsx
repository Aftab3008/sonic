import { Tabs } from "expo-router";
import React from "react";
import CustomTabBar from "../../../components/ui/CustomTabBar";
import { TABS_CONFIG } from "../../../constants/navigation";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
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
  );
}
