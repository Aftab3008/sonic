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

export type TabRouteName =
  | "home/index"
  | "discover/index"
  | "library/index"
  | "search/index";

export interface TabConfigItem {
  name: TabRouteName;
  label: string;
  Icon: FC<TabIconProps>;
}

export const TABS_CONFIG: TabConfigItem[] = [
  { name: "home/index", label: "Home", Icon: HomeTabIcon },
  { name: "discover/index", label: "Discover", Icon: DiscoveryTabIcon },
  { name: "library/index", label: "Library", Icon: LibraryTabIcon },
  { name: "search/index", label: "Search", Icon: SearchTabIcon },
];
