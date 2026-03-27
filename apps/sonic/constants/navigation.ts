import {
  HomeTabIcon,
  DiscoveryTabIcon,
  LibraryTabIcon,
  SearchTabIcon,
} from "@/components/ui/Icons";
import { FC } from "react";
import { SvgProps } from "react-native-svg";

export interface TabIconProps extends SvgProps {
  focused?: boolean;
  size?: number;
  color?: string;
}

export type TabRouteName = "index" | "discovery" | "library" | "search";

export interface TabConfigItem {
  name: TabRouteName;
  label: string;
  Icon: FC<TabIconProps>;
}

export const TABS_CONFIG: TabConfigItem[] = [
  { name: "index", label: "Home", Icon: HomeTabIcon },
  { name: "discovery", label: "Discover", Icon: DiscoveryTabIcon },
  { name: "library", label: "Library", Icon: LibraryTabIcon },
  { name: "search", label: "Search", Icon: SearchTabIcon },
];
