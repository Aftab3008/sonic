package com.aftab005.sonic.features.search.data

import kotlinx.serialization.Serializable

@Serializable
data class SearchSongResult(
    val id: String,
    val title: String,
    val albumId: String,
    val albumPublicId: String = "",
    val albumTitle: String,
    val albumType: String,
    val coverImageUrl: String? = null,
    val audioUrl: String? = null,
    val durationMs: Long? = null,
    val isExplicit: Boolean = false,
    val hasLyrics: Boolean = false,
    val artists: List<String> = emptyList(),
    val artistIds: List<String> = emptyList(),
    val genres: List<String> = emptyList(),
    val playCount: Long = 0,
)

@Serializable
data class SearchAlbumResult(
    val id: String,
    val publicId: String = "",
    val title: String,
    val albumType: String,
    val coverImageUrl: String? = null,
    val releaseDate: String = "",
    val artists: List<String> = emptyList(),
    val artistIds: List<String> = emptyList(),
    val trackCount: Int = 0,
)

@Serializable
data class SearchArtistResult(
    val id: String,
    val name: String,
    val slug: String = "",
    val bio: String? = null,
    val imageUrl: String? = null,
    val isVerified: Boolean = false,
    val monthlyListeners: Int = 0,
)

@Serializable
data class SearchResponse(
    val songs: List<SearchSongResult> = emptyList(),
    val albums: List<SearchAlbumResult> = emptyList(),
    val artists: List<SearchArtistResult> = emptyList(),
    val query: String = "",
    val processingTimeMs: Long = 0,
)