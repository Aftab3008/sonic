package com.aftab005.sonic.features.search.presentation

import com.aftab005.sonic.features.search.data.SearchAlbumResult
import com.aftab005.sonic.features.search.data.SearchArtistResult
import com.aftab005.sonic.features.search.data.SearchSongResult

enum class SearchFilter(val label: String, val apiType: String) {
    ALL("All", "all"),
    SONGS("Songs", "songs"),
    ALBUMS("Albums", "albums"),
    ARTISTS("Artists", "artists"),
}

data class SearchUiState(
    val query: String = "",
    val isLoading: Boolean = false,
    val songs: List<SearchSongResult> = emptyList(),
    val albums: List<SearchAlbumResult> = emptyList(),
    val artists: List<SearchArtistResult> = emptyList(),
    val error: String? = null,
    val activeFilter: SearchFilter = SearchFilter.ALL,
    val hasSearched: Boolean = false,
    val processingTimeMs: Long = 0,
) {
    val isEmpty: Boolean
        get() = songs.isEmpty() && albums.isEmpty() && artists.isEmpty()

    val totalResults: Int
        get() = songs.size + albums.size + artists.size
}
