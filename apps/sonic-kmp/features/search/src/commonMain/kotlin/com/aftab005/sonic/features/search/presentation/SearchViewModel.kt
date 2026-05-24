package com.aftab005.sonic.features.search.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.models.SearchSongResult
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.player.SonicPlayer
import com.aftab005.sonic.core.player.model.PlayerTrack
import com.aftab005.sonic.features.search.data.SearchRepository
import kotlinx.coroutines.FlowPreview
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.debounce
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

@OptIn(FlowPreview::class)
class SearchViewModel(
        private val repository: SearchRepository,
        private val player: SonicPlayer,
) : ViewModel() {
    private val _uiState = MutableStateFlow(SearchUiState())
    val uiState: StateFlow<SearchUiState> = _uiState.asStateFlow()
    private val _queryFlow = MutableStateFlow("")

    init {
        _queryFlow
            .debounce(300L)
            .distinctUntilChanged()
            .filter { it.length >= 2 }
            .onEach { query -> performSearch(query) }
            .launchIn(viewModelScope)
    }

    fun onQueryChange(query: String) {
        _queryFlow.value = query

        _uiState.update {
            it.copy(
                query = query
            )
        }

        if (query.length < 2) {
            _uiState.update {
                it.copy(
                    songs = emptyList(),
                    albums = emptyList(),
                    artists = emptyList(),
                    error = null,
                    isLoading = false
                )
            }
        }
    }

    fun onFilterSelect(filter: SearchFilter) {
        if (_uiState.value.activeFilter == filter) return

        _uiState.update {
            it.copy(
                activeFilter = filter
            )
        }

        val currentQuery = _uiState.value.query

        if (currentQuery.length >= 2) {
            performSearch(currentQuery)
        }
    }

    fun clearQuery() {
        _queryFlow.value = ""
        _uiState.value = SearchUiState()
    }

    fun onSongTap(song: SearchSongResult) {
        viewModelScope.launch {
            val audioUrl = song.audioUrl ?: return@launch

            val track =
                PlayerTrack(
                    id = song.id,
                    url = audioUrl,
                    title = song.title,
                    artist = song.artists.joinToString(", "),
                    artworkUrl = song.coverImageUrl ?: "",
                    durationMs = song.durationMs,
                    isHls = audioUrl.contains(".m3u8"),
                    albumTitle = song.albumTitle
                )
            player.setQueue(
                listOf(track),
                startIndex = 0,
                playWhenReady = true
            )
        }
    }

    private fun performSearch(query: String) {
        val filter = _uiState.value.activeFilter

        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    isLoading = true,
                    error = null
                )
            }

            repository
                .search(query = query, type = filter.apiType)
                .onSuccess { response ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            songs = response.songs,
                            albums = response.albums,
                            artists = response.artists,
                            hasSearched = true,
                            processingTimeMs = response.processingTimeMs,
                            )
                    }
                }
                .onError { error ->
                    val message =
                        when (error) {
                            is SonicError.Api -> error.message
                            is SonicError.Network -> "No connection. Check your network."
                            else -> "Search failed. Please try again."
                        }
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = message
                        )
                    }
                }
        }
    }
}
