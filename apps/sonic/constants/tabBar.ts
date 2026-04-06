import { Dimensions } from "react-native";
import { Easing } from "react-native-reanimated";
import { TABS_CONFIG } from "./navigation";
import { moderateScale, scale, verticalScale } from "../lib/scaling";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
export const TAB_BAR_MAX_WIDTH = scale(420);
export const TAB_BAR_WIDTH = Math.min(
  SCREEN_WIDTH - scale(32),
  TAB_BAR_MAX_WIDTH,
);

export const TABS_COUNT = TABS_CONFIG.length;
export const INNER_PADDING = moderateScale(12);
export const AVAILABLE_WIDTH = TAB_BAR_WIDTH - INNER_PADDING;
export const TAB_WIDTH = AVAILABLE_WIDTH / TABS_COUNT;

export const TAB_TOP = moderateScale(6);
export const TAB_HEIGHT = verticalScale(52);
export const PILL_RADIUS = moderateScale(26);
export const PILL_H_INSET = moderateScale(4);

export const TIMING_CONFIG = {
  duration: 280,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};
