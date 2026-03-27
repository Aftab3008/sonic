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
      }}
    >
      {TABS_CONFIG.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}
