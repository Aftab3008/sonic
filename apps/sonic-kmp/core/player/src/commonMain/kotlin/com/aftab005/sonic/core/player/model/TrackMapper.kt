package com.aftab005.sonic.core.player.model

import com.aftab005.sonic.core.network.models.AlbumDetail
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
 * Maps a standalone [Track] (with optional embedded AlbumCard) to a [PlayerTrack].
 *
 * Artwork fallback chain: track.coverImageUrl → album.coverImageUrl → FALLBACK
 * Title: overrideTitle → recording.title → "Unknown Track"
 * Artist: recording.artists joined by ", " → "Unknown Artist"
 */
fun Track.toPlayerTrack(): PlayerTrack {
    val audioUrl = recording.audioUrl.orEmpty()

    val artwork = listOf(coverImageUrl, album?.coverImageUrl)
        .firstOrNull { !it.isNullOrBlank() }
        ?: FALLBACK_ARTWORK

    val trackTitle = overrideTitle?.takeIf { it.isNotBlank() } ?: recording.title

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
        albumTitle = album?.title,
    )
}

/**
 * Maps a [Track] from an [AlbumDetail] context to a [PlayerTrack].
 * Uses the album's cover as artwork fallback when track has no individual cover.
 */
fun Track.toPlayerTrack(albumDetail: AlbumDetail): PlayerTrack {
    val audioUrl = recording.audioUrl.orEmpty()

    val artwork = listOf(coverImageUrl, albumDetail.coverImageUrl)
        .firstOrNull { !it.isNullOrBlank() }
        ?: FALLBACK_ARTWORK

    val trackTitle = overrideTitle?.takeIf { it.isNotBlank() } ?: recording.title

    val trackArtist = recording.artists
        ?.joinToString(", ") { it.artist.name }
        ?.takeIf { it.isNotBlank() }
        ?: albumDetail.artists?.firstOrNull()?.artist?.name
        ?: "Unknown Artist"

    return PlayerTrack(
        id = id,
        url = audioUrl,
        title = trackTitle,
        artist = trackArtist,
        artworkUrl = artwork,
        durationMs = recording.durationMs,
        isHls = isHlsUrl(audioUrl),
        albumTitle = albumDetail.title,
    )
}
