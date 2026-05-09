package com.aftab005.sonic.core.player.model

import com.aftab005.sonic.core.network.models.Track

/**
 * Default fallback artwork URL when track/album has no cover image.
 * Uses a placeholder to avoid crashes (Android ExoPlayer throws on empty artwork string).
 */
private const val FALLBACK_ARTWORK =
    "https://placehold.co/400x400/0F0F17/C4B5FD?text=♪"

/**
 * Detects HLS streams by checking if the URL path ends with .m3u8
 * (strips query parameters to handle signed CloudFront URLs).
 */
private fun isHlsUrl(url: String?): Boolean {
    if (url.isNullOrBlank()) return false
    return url.substringBefore("?").endsWith(".m3u8", ignoreCase = true)
}

/**
 * Maps the network [Track] model to a [PlayerTrack] suitable for the audio engine.
 *
 * Replicates the exact mapping logic from the Expo app's formatTrack():
 * - Artwork fallback chain: track.coverImageUrl → album.coverImageUrl → FALLBACK
 * - Title: overrideTitle → recording.title → "Unknown Track"
 * - Artist: recording.artists joined by ", " → "Unknown Artist"
 * - HLS detection via .m3u8 extension
 */
fun Track.toPlayerTrack(): PlayerTrack {
    val audioUrl = recording.audioUrl.orEmpty()

    // Use first non-null, non-blank artwork. Mirrors Expo's || fallback chain.
    val artwork = listOf(coverImageUrl, album?.coverImageUrl)
        .firstOrNull { !it.isNullOrBlank() }
        ?: FALLBACK_ARTWORK

    val trackTitle = overrideTitle
        ?: recording.title.takeIf { it.isNotBlank() }
        ?: "Unknown Track"

    val trackArtist = recording.artists
        ?.joinToString(", ") { it.artist.name }
        ?.takeIf { it.isNotBlank() }
        ?: "Unknown Artist"

    return PlayerTrack(
        id = id,
        url = audioUrl,
        title = trackTitle,
        artist = trackArtist,
        artworkUrl = artwork,
        durationMs = recording.durationMs,
        isHls = isHlsUrl(audioUrl),
        albumTitle = album?.title
    )
}
