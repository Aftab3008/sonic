import { PageHeader } from "@/components/ui/PageHeader";
import { authClient } from "@/lib/auth/auth-client";
import { FC, useMemo } from "react";
import { ViewStyle } from "react-native";
import { SharedValue } from "react-native-reanimated";

export const HomeGreetingHeader: FC<{
  style?: ViewStyle;
  scrollY?: SharedValue<number>;
}> = ({ style, scrollY }) => {
  const { data: session } = authClient.useSession();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const user = session?.user;
  const userName = user?.name || "there";

  return (
    <PageHeader
      title={userName}
      subtitle={`${greeting},`}
      style={style}
      scrollY={scrollY}
    />
  );
};
