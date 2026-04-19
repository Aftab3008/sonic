import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

export const scale = (size: number) => {
  "worklet";
  return (shortDimension / guidelineBaseWidth) * size;
};

export const verticalScale = (size: number) => {
  "worklet";
  return (longDimension / guidelineBaseHeight) * size;
};

export const moderateScale = (size: number, factor = 0.5) => {
  "worklet";
  return size + (scale(size) - size) * factor;
};

export const moderateFontScale = (size: number, factor = 0.5) => {
  "worklet";
  return size + (scale(size) - size) * factor;
};
