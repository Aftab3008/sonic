package com.aftab005.sonic.core.network.models

import kotlinx.serialization.Serializable

@Serializable
data class Artist(
    val id: String,
    val name: String,
    val slug: String? = null,
    val bio: String? = null,
    val imageUrl: String? = null,
    val isVerified: Boolean = false,
    val monthlyListeners: Int? = null,
)

@Serializable
data class ArtistWrapper(
    val artist: Artist,
)

/**
 * Minimal album representation used in carousels / discovery feeds.
 * No tracks or audio URLs — those are fetched on demand via the album detail endpoint.
 */
@Serializable
data class AlbumCard(
    val id: String,
    val publicId: String,
    val title: String,
    val albumType: String,               // ALBUM | SINGLE | EP | COMPILATION
    val coverImageUrl: String? = null,
    val releaseDate: String? = null,
    val trackCount: Int = 0,
    val artists: List<ArtistWrapper>? = null,
) {
    val isSingle: Boolean get() = albumType == "SINGLE"
}

/**
 * Full album representation fetched on tap.
 * Includes all tracks with recordings and audio URLs.
 */
@Serializable
data class AlbumDetail(
    val id: String,
    val publicId: String,
    val title: String,
    val albumType: String,
    val coverImageUrl: String? = null,
    val releaseDate: String? = null,
    val recordLabel: String? = null,
    val copyright: String? = null,
    val artists: List<ArtistWrapper>? = null,
    val tracks: List<Track> = emptyList(),
) {
    val isSingle: Boolean get() = albumType == "SINGLE"
    val totalDurationMs: Long
        get() = tracks.sumOf { it.recording.durationMs ?: 0L }
}

@Serializable
data class Recording(
    val id: String,
    val title: String,
    val durationMs: Long? = null,
    val audioUrl: String? = null,
    val isExplicit: Boolean = false,
    val hasLyrics: Boolean = false,
    val lyrics: String? = null,
    val artists: List<ArtistWrapper>? = null,
)

@Serializable
data class Track(
    val id: String,
    val trackNumber: Int,
    val discNumber: Int = 1,
    val overrideTitle: String? = null,
    val coverImageUrl: String? = null,
    val playCount: Long = 0,
    val album: AlbumCard? = null,   // present only when track is returned standalone
    val recording: Recording,
) {
    val displayTitle: String get() = overrideTitle?.takeIf { it.isNotBlank() } ?: recording.title
}

@Serializable
data class HomeDiscoveryResponse(
    val featured: AlbumCard? = null,
    val recent: List<Track> = emptyList(),
    val singles: List<AlbumCard> = emptyList(),
    val albums: List<AlbumCard> = emptyList(),
)
