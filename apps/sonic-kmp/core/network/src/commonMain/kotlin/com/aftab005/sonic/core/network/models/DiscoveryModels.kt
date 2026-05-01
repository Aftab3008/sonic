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
    val monthlyListeners: Int? = null
)

@Serializable
data class ArtistWrapper(
    val artist: Artist
)

@Serializable
data class Album(
    val id: String,
    val title: String,
    val coverImageUrl: String? = null,
    val releaseDate: String? = null,
    val albumType: String? = null,
    val artists: List<ArtistWrapper>? = null
)

@Serializable
data class Recording(
    val id: String,
    val title: String,
    val durationMs: Long? = null,
    val audioUrl: String? = null,
    val isExplicit: Boolean = false,
    val hasLyrics: Boolean = false,
    val lyrics: String? = null,
    val artists: List<ArtistWrapper>? = null
)

@Serializable
data class Track(
    val id: String,
    val trackNumber: Int,
    val overrideTitle: String? = null,
    val coverImageUrl: String? = null,
    val album: Album? = null,
    val recording: Recording
)

@Serializable
data class HomeDiscoveryResponse(
    val featured: Album? = null,
    val recent: List<Track> = emptyList(),
    val madeForYou: List<Album> = emptyList()
)
