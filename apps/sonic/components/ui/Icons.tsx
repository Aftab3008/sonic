import { ASSETS } from "@/constants/assets";
import { TabIconProps } from "@/constants/navigation";
import { Image } from "expo-image";
import Svg, { Circle, Path, Rect } from "react-native-svg";

export const AppleIcon = ({ size = 20, color = "currentColor" }) => (
  <Image
    source={ASSETS.appleLogo}
    style={{ width: size, height: size }}
    contentFit="contain"
    tintColor={color === "currentColor" ? undefined : color}
  />
);

export const GoogleIcon = ({ size = 20, color = "currentColor" }) => (
  <Image
    source={ASSETS.googleLogo}
    style={{ width: size, height: size }}
    contentFit="contain"
    tintColor={color === "currentColor" ? undefined : color}
  />
);

export const HomeTabIcon = ({
  size = 24,
  color = "currentColor",
  focused = false,
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    {focused ? (
      <Path
        fill={color}
        d="M12 3 L2 10.5 h3 V21 h5 v-7 h4 v7 h5 v-10.5 h3 L12 3 Z"
      />
    ) : (
      <>
        <Path
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10 L12 3.5 L21 10 V20 a1 1 0 0 1-1 1 H4 a1 1 0 0 1-1-1 V10 Z"
        />
        <Path
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 21 V12 h6 v9"
        />
      </>
    )}
  </Svg>
);

export const DiscoveryTabIcon = ({
  size = 24,
  color = "currentColor",
  focused = false,
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    {focused ? (
      <>
        <Circle cx="12" cy="12" r="10" fill={color} opacity="0.25" />
        <Circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          fill={color}
          strokeLinejoin="round"
          d="M16.24 7.76 l-2.12 6.36 l-6.36 2.12 l2.12-6.36 Z"
        />
      </>
    ) : (
      <>
        <Circle
          cx="12"
          cy="12"
          r="10"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          d="M16.24 7.76 l-2.12 6.36 l-6.36 2.12 l2.12-6.36 Z"
        />
      </>
    )}
  </Svg>
);

export const LibraryTabIcon = ({
  size = 24,
  color = "currentColor",
  focused = false,
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    {focused ? (
      <>
        <Rect x="3" y="10" width="18" height="11" rx="2" fill={color} />
        <Path
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          d="M7 6 h10 M5 8 h14"
        />
      </>
    ) : (
      <>
        <Rect
          x="3"
          y="10"
          width="18"
          height="11"
          rx="2"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          d="M7 6 h10 M5 8 h14"
        />
      </>
    )}
  </Svg>
);

export const SearchTabIcon = ({
  size = 24,
  color = "currentColor",
  focused = false,
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    {focused ? (
      <>
        <Circle cx="11" cy="11" r="8" fill={color} />
        <Path
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          d="M21 21 l-4.35-4.35"
        />
      </>
    ) : (
      <>
        <Circle
          cx="11"
          cy="11"
          r="8"
          fill="none"
          stroke={color}
          strokeWidth="2"
        />
        <Path
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          d="M21 21 l-4.35-4.35"
        />
      </>
    )}
  </Svg>
);

export const HeartIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Path
      fill={color}
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    />
  </Svg>
);

export const PlaylistIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Path
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
    />
  </Svg>
);

export const ArtistIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Path
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
    />
  </Svg>
);

export const AlbumIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Circle cx="12" cy="12" r="10" fill="none" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="12" r="3" fill="none" stroke={color} strokeWidth="2" />
  </Svg>
);

export const FolderIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Path
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
    />
  </Svg>
);

export const SettingsIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Path
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
    />
  </Svg>
);

export const MoreIcon = ({
  size = 24,
  color = "currentColor",
  ...props
}: TabIconProps) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} {...props}>
    <Circle cx="12" cy="12" r="1" fill={color} stroke={color} strokeWidth="2" />
    <Circle cx="19" cy="12" r="1" fill={color} stroke={color} strokeWidth="2" />
    <Circle cx="5" cy="12" r="1" fill={color} stroke={color} strokeWidth="2" />
  </Svg>
);
