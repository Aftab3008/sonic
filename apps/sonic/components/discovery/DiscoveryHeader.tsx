import { PageHeader } from "@/components/ui/PageHeader";
import { FC } from "react";
import { SharedValue } from "react-native-reanimated";

interface DiscoveryHeaderProps {
  scrollY: SharedValue<number>;
  onProfilePress?: () => void;
}

export const DiscoveryHeader: FC<DiscoveryHeaderProps> = ({ scrollY }) => {
  return (
    <PageHeader
      title="New Sounds"
      subtitle="Explore,"
      scrollY={scrollY}
      style={{ position: "absolute", top: 0, left: 0, right: 0 }}
    />
  );
};
