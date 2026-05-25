package com.aftab005.sonic.features.home.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.network.models.HomeDiscoveryResponse
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.player.SonicPlayer
import com.aftab005.sonic.core.player.model.toPlayerTrack
import com.aftab005.sonic.features.album.data.AlbumRepository
import com.aftab005.sonic.features.home.data.HomeRepository
import com.aftab005.sonic.features.home.util.FallbackDataProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class HomeViewModel(
    private val homeRepository: HomeRepository,
    private val albumRepository: AlbumRepository,
    private val player: SonicPlayer,
) : ViewModel() {

    val fallbackTracks = FallbackDataProvider.fallbackTracks

    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    private var lastSuccessData: HomeDiscoveryResponse? = null

    init {
        handleIntent(HomeIntent.LoadDiscovery)
    }

    fun handleIntent(intent: HomeIntent) {
        when (intent) {
            is HomeIntent.LoadDiscovery -> loadDiscovery(forceRefresh = false)
            is HomeIntent.RefreshDiscovery -> loadDiscovery(forceRefresh = true)
            is HomeIntent.FetchAndPlaySingle -> fetchAndPlaySingle(intent.card)
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

    fun playTrack(track:Track){
        playQueue(track,listOf(track))
    }

    private fun fetchAndPlaySingle(card: AlbumCard) {
        viewModelScope.launch {
            albumRepository.getAlbumDetail(card.id)
                .onSuccess { detail ->
                    val queue = detail.tracks.map { it.toPlayerTrack(detail) }
                    if (queue.isNotEmpty()) {
                        player.setQueue(tracks = queue, startIndex = 0, playWhenReady = true)
                    }
                }
                .onError { /* Silently fail — user can retry by tapping again */ }
        }
    }

    private fun loadDiscovery(forceRefresh: Boolean) {
        if (!forceRefresh && (_uiState.value is HomeUiState.Success || _uiState.value is HomeUiState.Refreshing)) {
            return
        }

        viewModelScope.launch {
            if (forceRefresh || _uiState.value is HomeUiState.Error) {
                _uiState.value = lastSuccessData
                    ?.let {
                        HomeUiState.Refreshing(
                            it
                        )
                    } ?: HomeUiState.Loading
            }

            homeRepository.getHomeDiscovery(forceRefresh)
                .onSuccess { data ->
                    lastSuccessData = data
                    _uiState.value = HomeUiState.Success(data)
                }
                .onError { error ->
                    if (error is SonicError.Api && error.code == 401) {
                        homeRepository.clearCache()
                    }
                    val message = when (error) {
                        is SonicError.Api           -> error.message
                        is SonicError.Network       -> "Network error. Please check your connection."
                        is SonicError.Serialization -> "Data processing error."
                        is SonicError.Unknown       -> error.message ?: "An unexpected error occurred."
                        else                        -> "An unexpected error occurred."
                    }
                    _uiState.value = HomeUiState.Error(message)
                }
        }
    }
}
