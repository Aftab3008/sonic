package com.aftab005.sonic.features.discovery.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.player.SonicPlayer
import com.aftab005.sonic.core.player.model.toPlayerTrack
import com.aftab005.sonic.features.discovery.data.DiscoveryRepository
import com.aftab005.sonic.features.discovery.data.GenreDetail
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class GenreDetailUiState {
    object Loading : GenreDetailUiState()
    data class Success(val data: GenreDetail) : GenreDetailUiState()
    data class Error(val message: String) : GenreDetailUiState()
}

class GenreDetailViewModel(
    private val discoveryRepository: DiscoveryRepository,
    private val player: SonicPlayer,
) : ViewModel() {

    private val _uiState = MutableStateFlow<GenreDetailUiState>(GenreDetailUiState.Loading)
    val uiState: StateFlow<GenreDetailUiState> = _uiState.asStateFlow()

    fun loadGenreDetail(slug: String) {
        _uiState.value = GenreDetailUiState.Loading
        viewModelScope.launch {
            discoveryRepository.getGenreDetail(slug)
                .onSuccess { data ->
                    _uiState.value = GenreDetailUiState.Success(data)
                }
                .onError { error ->
                    val message = when (error) {
                        is SonicError.Api           -> error.message
                        is SonicError.Network       -> "Network error. Please check your connection."
                        is SonicError.Serialization -> "Data processing error."
                        is SonicError.Unknown       -> error.message ?: "An unexpected error occurred."
                        else                        -> "An unexpected error occurred."
                    }
                    _uiState.value = GenreDetailUiState.Error(message)
                }
        }
    }

    fun playQueue(track: Track, queueContext: List<Track>) {
        viewModelScope.launch {
            val mappedQueue = queueContext.map { it.toPlayerTrack() }
            val startIndex = queueContext.indexOfFirst { it.id == track.id }
                .takeIf { it >= 0 } ?: 0
            player.setQueue(
                tracks = mappedQueue,
                startIndex = startIndex,
                playWhenReady = true
            )
        }
    }

    fun playTrack(track: Track) {
        playQueue(track, listOf(track))
    }
}
