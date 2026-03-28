import { moderateFontScale, verticalScale } from "@/lib/scaling";
import Animated from "react-native-reanimated";

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: moderateFontScale(28),
        lineHeight: verticalScale(32),
        marginTop: verticalScale(-6),
        animationName: {
          "50%": { transform: [{ rotate: "25deg" }] },
        },
        animationIterationCount: 4,
        animationDuration: "300ms",
      }}
    >
      👋
    </Animated.Text>
  );
}
