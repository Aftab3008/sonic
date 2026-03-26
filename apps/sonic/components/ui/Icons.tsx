import React from "react";
import { Image } from "expo-image";
import Svg, { Path } from "react-native-svg";
import { ASSETS } from "@/constants/assets";

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
