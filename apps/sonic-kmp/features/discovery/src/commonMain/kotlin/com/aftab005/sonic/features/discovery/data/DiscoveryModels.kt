package com.aftab005.sonic.features.discovery.data

import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.network.models.Track
import kotlinx.serialization.Serializable

@Serializable
data class Genre(
    val name: String,
    val slug: String,
    val icon: String? = null,
    val primaryColor: String? = null,
    val secondaryColor: String? = null
)

@Serializable
data class GenreDetail(
    val genre: Genre,
    val albums: List<AlbumCard> = emptyList(),
    val tracks: List<Track> = emptyList()
)

@Serializable
data class GenresDetailsResponse(
    val genres: List<Genre> = emptyList(),
)

