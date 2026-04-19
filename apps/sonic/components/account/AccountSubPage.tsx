import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AccountSubPageProps {
  title: string;
  children: React.ReactNode;
  useScroll?: boolean;
}

export const AccountSubPage = ({
  title,
  children,
  useScroll = true,
}: AccountSubPageProps) => {
  const router = useRouter();

  return (
    <ScreenWrapper useScroll={useScroll} containerStyle={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.onSurface}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>{children}</View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surfaceContainer,
  },
  title: {
    fontFamily: theme.typography.headline,
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.onSurface,
  },
  placeholder: {
    width: 44,
  },
  content: {
    flex: 1,
  },
});
