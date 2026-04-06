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
