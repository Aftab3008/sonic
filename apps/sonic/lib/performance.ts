import { PixelRatio, useWindowDimensions } from "react-native";

export type PerformanceTier = "low" | "mid" | "high";

export interface TimingDelays {
  phase1: number;
  phase2: number;
}

/**
 * Hook to detect device performance tier based on screen pixels and pixel density.
 * Must be called at top level of component (follows Rules of Hooks).
 * Low-end: < 720p equivalent, Mid: < 1080p, High: rest
 */
export function usePerformanceTier(): PerformanceTier {
  const { width, height } = useWindowDimensions();
  const pixelDensity = PixelRatio.get();
  const pixelCount = width * height * pixelDensity;

  if (pixelCount < 1000000) {
    return "low";
  }
  if (pixelCount < 2500000) {
    return "mid";
  }
  return "high";
}

/**
 * Get adaptive timing delays based on device performance tier.
 * Lower delays = faster mount = smoother experience on capable devices.
 */
export function getAdaptiveDelays(tier: PerformanceTier): TimingDelays {
  switch (tier) {
    case "low":
      return { phase1: 50, phase2: 300 };
    case "mid":
      return { phase1: 30, phase2: 150 };
    case "high":
      return { phase1: 16, phase2: 80 };
  }
}

/**
 * Get animation complexity settings based on performance tier.
 */
export function getAnimationSettings(tier: PerformanceTier) {
  return {
    enableSpringAnimations: tier !== "low",
    enableGestureFeedback: tier !== "low",
    shadowIntensity:
      tier === "low" ? "minimal" : tier === "mid" ? "normal" : "full",
  };
}
