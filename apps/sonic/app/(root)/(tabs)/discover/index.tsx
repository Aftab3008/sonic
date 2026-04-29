import { CollapsibleSearchBar } from "@/components/discovery/CollapsibleSearchBar";
import { DiscoveryBentoGrid } from "@/components/discovery/DiscoveryBentoGrid";
import { DiscoveryHeader } from "@/components/discovery/DiscoveryHeader";
import { SpotlightCarousel } from "@/components/discovery/SpotlightCarousel";
import { ScreenWrapper } from "@/components/ui/ScreenWrapper";
import { BentoSkeleton, CardSkeleton } from "@/components/ui/Skeleton";
import { theme, withAlpha } from "@/constants/theme";
import { scale, verticalScale } from "@/lib/scaling";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DiscoveryScreen() {
  const scrollY = useSharedValue(0);
  const insets = useSafeAreaInsets();

  const carouselItems = useMemo(
    () => [
      {
        id: "1",
        title: "Neon Nights",
        subtitle: "New Release from Cyber-Pop Collective",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuATjk5Wc_UjwJhHCuw1UM7fsH_T4vrbYFAYq95Akx409Fd39ko-ZFZkReKv2X2fGyG4EmduGfWXTmU4XURHDO4p_G65PWPjBl7uXa-T2-X1C4LNGaDZosAvc7aGaIHUK3NCLKzK6ElkYg6Z1pvxb45VFWCICXp6EvOSFwJAkGk62xfojI3FqhpFw4XpyKLUFF-GzNTfWceodocignIbCy1AfZCkt1mxL8DmUH1c6ApPrNV9m0lV9wRI90BuOFV0EX5Ilar9eqPzwDKS",
        tag: "FEATURED",
      },
      {
        id: "2",
        title: "Retro Soul",
        subtitle: "The Groove Band",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA1x87qGdYWHefAHGSWdHct4VdDxM90_WT2AwUbEBcXf5LYxgAEoUWt4X7NDjiVWEwTAspEB8fxv_CRH3jWBXyHUNuLuzjI63rZ6gH9W5f3qtNyIxRY3bG_K6t0UNytMo_ZlZEQZvwODRlGibU6PBdoqenIy38rUa5sZdT9WWghNeU3iPIL9vYLXND6D37P2c2xo8oYvZYgdsJdCeaDLxIbh2LQ-JSwMwCr-2igzljatuFMbOGWBk5UbcsVVLwAMBUBWm3ilugeBDxO",
        tag: "NEW ALBUM",
      },
      {
        id: "3",
        title: "Silent Echo",
        subtitle: "Acoustic Dreams",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBg4NHkIsurO9L_XrD2fCBduzSG0DhCI4viHh3VxbUkT_d3MvPzLofUqGhK0YhFFMXCPqSNmOLuzgEVAx2tkXgDi10N2qE_ihVgjkGrNd8V0DQgGg2_UzUgkDYG9RwhIIMNOOgeKuAejXIAVdq4TOqhc2epaF_C59355Nlt1mnT4casw6y43y3RcGluhkoZzOTXqVplz-iVg1JemFChskQfJNQiYOdrA5S0BaCG0s61u8sE6MOC7rgkrXpSRtWdlJXm0N1WG40mNh8X",
        tag: "PLAYLIST",
      },
    ],
    [],
  );

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handle = requestIdleCallback(() => {
      setIsReady(true);
    });
    return () => cancelIdleCallback(handle);
  }, []);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  return (
    <ScreenWrapper>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[
            withAlpha(theme.colors.primaryContainer, 0.2),
            theme.colors.background,
          ]}
          style={styles.bgGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />
      </View>

      <DiscoveryHeader scrollY={scrollY} />

      <CollapsibleSearchBar scrollY={scrollY} topInset={insets.top} />

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isReady ? (
          <>
            <SpotlightCarousel items={carouselItems} />
            <DiscoveryBentoGrid />
          </>
        ) : (
          <>
            <View style={styles.carouselSkeleton}>
              <CardSkeleton />
            </View>
            <View style={styles.bentoSkeleton}>
              <BentoSkeleton />
            </View>
          </>
        )}

        <View style={styles.bottomSpacer} />
      </Animated.ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: verticalScale(132),
    paddingBottom: verticalScale(200),
  },
  carouselSkeleton: {
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
    paddingHorizontal: scale(20),
  },
  bentoSkeleton: {
    marginTop: verticalScale(16),
    paddingHorizontal: scale(20),
  },
  bottomSpacer: {
    height: verticalScale(60),
  },
  bgGradient: {
    height: verticalScale(320),
  },
});
