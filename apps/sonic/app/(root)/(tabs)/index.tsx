import { useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";

import { FeaturedAlbum } from "../../../components/home/FeaturedAlbum";
import { HomeHeader } from "../../../components/home/HomeHeader";
import { MadeForYou } from "../../../components/home/MadeForYou";
import { MoodGrid } from "../../../components/home/MoodGrid";
import { RecentlyPlayed } from "../../../components/home/RecentlyPlayed";
import { ScreenWrapper } from "../../../components/ui/ScreenWrapper";

import { useGetAlbums } from "@/hooks/use-album";
import { useGetTracks } from "@/hooks/use-track";
import { usePlayerStore } from "@/lib/player/store";

export default function HomeScreen() {
  const playTrack = usePlayerStore((state) => state.playTrack);

  const { data: tracks = [] } = useGetTracks(3);
  const { data: albums = [] } = useGetAlbums(3);

  const featuredAlbum = albums?.[0];

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
      <HomeHeader />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FeaturedAlbum
          album={featuredAlbum}
          onPlay={() => {
            const firstTrack = tracks?.[0];
            if (firstTrack && firstTrack.recording) {
              playTrack(firstTrack);
            }
          }}
        />

        <RecentlyPlayed
          tracks={tracks as any}
          fallbackTracks={fallbackTracks as any}
          onTrackPress={playTrack}
        />

        <MadeForYou />

        <MoodGrid />
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 220,
  },
});
