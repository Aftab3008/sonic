import { theme, withAlpha } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { FeaturedShowcase } from "../../../components/home/main/FeaturedShowcase";
import { HomeGreetingHeader } from "../../../components/home/main/HomeGreetingHeader";
import { MadeForYou } from "../../../components/home/main/MadeForYou";
import { MoodGrid } from "../../../components/home/main/MoodGrid";
import { QuickAccessGrid } from "../../../components/home/main/QuickAccessGrid";
import { RecentlyPlayed } from "../../../components/home/recently-played";
import { ProfileSettingsSheet } from "../../../components/settings/ProfileSettingsSheet";
import { ScreenWrapper } from "../../../components/ui/ScreenWrapper";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";

import { useGetHomeDiscovery } from "@/hooks/use-discovery";
import { usePlayerStore } from "@/lib/player/store";

export default function HomeScreen() {
  const playTrack = usePlayerStore((state) => state.playTrack);
  const sheetRef = useRef<BottomSheetModal>(null);

  const { data: discovery } = useGetHomeDiscovery();

  const tracks = discovery?.recent || [];
  const albums = discovery?.madeForYou || [];
  const featuredAlbum = discovery?.featured;

  const fallbackTracks = useMemo(
    () => [
      {
        title: "Neon Nights",
        artist: "Cyber-Pop Collective",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuATjk5Wc_UjwJhHCuw1UM7fsH_T4vrbYFAYq95Akx409Fd39ko-ZFZkReKv2X2fGyG4EmduGfWXTmU4XURHDO4p_G65PWPjBl7uXa-T2-X1C4LNGaDZosAvc7aGaIHUK3NCLKzK6ElkYg6Z1pvxb45VFWCICXp6EvOSFwJAkGk62xfojI3FqhpFw4XpyKLUFF-GzNTfWceodocignIbCy1AfZCkt1mxL8DmUH1c6ApPrNV9m0lV9wRI90BuOFV0EX5Ilar9eqPzwDKS",
      },
      {
        title: "Retro Soul",
        artist: "The Groove Band",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuA1x87qGdYWHefAHGSWdHct4VdDxM90_WT2AwUbEBcXf5LYxgAEoUWt4X7NDjiVWEwTAspEB8fxv_CRH3jWBXyHUNuLuzjI63rZ6gH9W5f3qtNyIxRY3bG_K6t0UNytMo_ZlZEQZvwODRlGibU6PBdoqenIy38rUa5sZdT9WWghNeU3iPIL9vYLXND6D37P2c2xo8oYvZYgdsJdCeaDLxIbh2LQ-JSwMwCr-2igzljatuFMbOGWBk5UbcsVVLwAMBUBWm3ilugeBDxO",
      },
      {
        title: "Silent Echo",
        artist: "Acoustic Dreams",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBg4NHkIsurO9L_XrD2fCBduzSG0DhCI4viHh3VxbUkT_d3MvPzLofUqGhK0YhFFMXCPqSNmOLuzgEVAx2tkXgDi10N2qE_ihVgjkGrNd8V0DQgGg2_UzUgkDYG9RwhIIMNOOgeKuAejXIAVdq4TOqhc2epaF_C59355Nlt1mnT4casw6y43y3RcGluhkoZzOTXqVplz-iVg1JemFChskQfJNQiYOdrA5S0BaCG0s61u8sE6MOC7rgkrXpSRtWdlJXm0N1WG40mNh8X",
      },
      {
        title: "Stellar Voyage",
        artist: "Intergalactic Beats",
        image:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCfXXVc6dXQJhlW-igG8vdpy5Q4TTD_OCjwk0hCY0HSLYjPmmp0gI5AfoaKZrHBFwCkfeNMc2oqPRAQjhzv1_u64VJzT3_TfA_n1wjiZpqGBOvQR3_Ui8eVBm7x3xlBBSRH0gnt_EoDFLnXrP0qJmarqGf8DGY2V70iTrw6D6UTHx6D4PabSZNv0Xun7yvpDWoJhH9Dgf8XNi5l-5RjbBaGZ1xbJZeQDzC89cykwNs4Hd7dkrzJ9cxKU7qJuSN32bzLBnD6yJGACaQg",
      },
    ],
    [],
  );

  return (
    <ScreenWrapper>
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient
          colors={[
            withAlpha(theme.colors.primaryContainer, 0.4),
            theme.colors.background,
          ]}
          style={styles.bgGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.6 }}
        />
      </View>
      <HomeGreetingHeader onProfilePress={() => sheetRef.current?.present()} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <QuickAccessGrid tracks={tracks} onTrackPress={playTrack} />

        <FeaturedShowcase
          album={featuredAlbum}
          onPlay={() => {
            const firstTrack = featuredAlbum?.tracks?.[0];
            if (firstTrack) {
              playTrack(firstTrack);
            }
          }}
        />

        <RecentlyPlayed
          tracks={tracks}
          fallbackTracks={fallbackTracks}
          onTrackPress={playTrack}
        />

        <MadeForYou />

        <MoodGrid />
      </ScrollView>

      <ProfileSettingsSheet ref={sheetRef} />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 220,
  },
  bgGradient: {
    height: 400,
  },
});
