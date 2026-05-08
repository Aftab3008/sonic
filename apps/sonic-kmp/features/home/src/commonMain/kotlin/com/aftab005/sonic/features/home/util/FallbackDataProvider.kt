package com.aftab005.sonic.features.home.util

import com.aftab005.sonic.core.network.models.Artist
import com.aftab005.sonic.core.network.models.ArtistWrapper
import com.aftab005.sonic.core.network.models.Recording
import com.aftab005.sonic.core.network.models.Track

object FallbackDataProvider {
    val fallbackTracks = listOf(
        Track(
            id = "fallback-1",
            trackNumber = 1,
            overrideTitle = "Neon Nights",
            coverImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuATjk5Wc_UjwJhHCuw1UM7fsH_T4vrbYFAYq95Akx409Fd39ko-ZFZkReKv2X2fGyG4EmduGfWXTmU4XURHDO4p_G65PWPjBl7uXa-T2-X1C4LNGaDZosAvc7aGaIHUK3NCLKzK6ElkYg6Z1pvxb45VFWCICXp6EvOSFwJAkGk62xfojI3FqhpFw4XpyKLUFF-GzNTfWceodocignIbCy1AfZCkt1mxL8DmUH1c6ApPrNV9m0lV9wRI90BuOFV0EX5Ilar9eqPzwDKS",
            recording = Recording(
                id = "rec-1",
                title = "Neon Nights",
                artists = listOf(ArtistWrapper(Artist(id = "art-1", name = "Cyber-Pop Collective")))
            )
        ),
        Track(
            id = "fallback-2",
            trackNumber = 1,
            overrideTitle = "Retro Soul",
            coverImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuA1x87qGdYWHefAHGSWdHct4VdDxM90_WT2AwUbEBcXf5LYxgAEoUWt4X7NDjiVWEwTAspEB8fxv_CRH3jWBXyHUNuLuzjI63rZ6gH9W5f3qtNyIxRY3bG_K6t0UNytMo_ZlZEQZvwODRlGibU6PBdoqenIy38rUa5sZdT9WWghNeU3iPIL9vYLXND6D37P2c2xo8oYvZYgdsJdCeaDLxIbh2LQ-JSwMwCr-2igzljatuFMbOGWBk5UbcsVVLwAMBUBWm3ilugeBDxO",
            recording = Recording(
                id = "rec-2",
                title = "Retro Soul",
                artists = listOf(ArtistWrapper(Artist(id = "art-2", name = "The Groove Band")))
            )
        ),
        Track(
            id = "fallback-3",
            trackNumber = 1,
            overrideTitle = "Silent Echo",
            coverImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBg4NHkIsurO9L_XrD2fCBduzSG0DhCI4viHh3VxbUkT_d3MvPzLofUqGhK0YhFFMXCPqSNmOLuzgEVAx2tkXgDi10N2qE_ihVgjkGrNd8V0DQgGg2_UzUgkDYG9RwhIIMNOOgeKuAejXIAVdq4TOqhc2epaF_C59355Nlt1mnT4casw6y43y3RcGluhkoZzOTXqVplz-iVg1JemFChskQfJNQiYOdrA5S0BaCG0s61u8sE6MOC7rgkrXpSRtWdlJXm0N1WG40mNh8X",
            recording = Recording(
                id = "rec-3",
                title = "Silent Echo",
                artists = listOf(ArtistWrapper(Artist(id = "art-3", name = "Acoustic Dreams")))
            )
        ),
        Track(
            id = "fallback-4",
            trackNumber = 1,
            overrideTitle = "Stellar Voyage",
            coverImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCfXXVc6dXQJhlW-igG8vdpy5Q4TTD_OCjwk0hCY0HSLYjPmmp0gI5AfoaKZrHBFwCkfeNMc2oqPRAQjhzv1_u64VJzT3_TfA_n1wjiZpqGBOvQR3_Ui8eVBm7x3xlBBSRH0gnt_EoDFLnXrP0qJmarqGf8DGY2V70iTrw6D6UTHx6D4PabSZNv0Xun7yvpDWoJhH9Dgf8XNi5l-5RjbBaGZ1xbJZeQDzC89cykwNs4Hd7dkrzJ9cxKU7qJuSN32bzLBnD6yJGACaQg",
            recording = Recording(
                id = "rec-4",
                title = "Stellar Voyage",
                artists = listOf(ArtistWrapper(Artist(id = "art-4", name = "Intergalactic Beats")))
            )
        )
    )
}
