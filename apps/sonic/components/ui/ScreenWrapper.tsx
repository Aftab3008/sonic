import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";

interface ScreenWrapperProps {
  children: React.ReactNode;
  useScroll?: boolean;
  containerStyle?: object;
  contentContainerStyle?: object;
}

export function ScreenWrapper({
  children,
  useScroll = false,
  containerStyle,
  contentContainerStyle,
}: ScreenWrapperProps) {
  const insets = useSafeAreaInsets();

  const Container = useScroll ? ScrollView : View;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Container
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
          containerStyle,
        ]}
        contentContainerStyle={
          useScroll
            ? [styles.scrollContent, contentContainerStyle]
            : contentContainerStyle
        }
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
