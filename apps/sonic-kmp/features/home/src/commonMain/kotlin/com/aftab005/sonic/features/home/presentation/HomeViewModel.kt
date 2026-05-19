package com.aftab005.sonic.features.home.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.models.HomeDiscoveryResponse
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.player.SonicPlayer
import com.aftab005.sonic.core.player.model.toPlayerTrack
import com.aftab005.sonic.features.home.data.HomeRepository
import com.aftab005.sonic.features.home.util.FallbackDataProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed class HomeUiState {
    object Loading : HomeUiState()
    data class Success(val data: HomeDiscoveryResponse) : HomeUiState()
    data class Error(val message: String) : HomeUiState()
}

sealed class HomeIntent {
    object LoadDiscovery : HomeIntent()
    object RefreshDiscovery : HomeIntent()
}

class HomeViewModel(
    private val homeRepository: HomeRepository,
    private val player: SonicPlayer
) : ViewModel() {

    val fallbackTracks = FallbackDataProvider.fallbackTracks

    private val _uiState = MutableStateFlow<HomeUiState>(HomeUiState.Loading)
    val uiState: StateFlow<HomeUiState> = _uiState.asStateFlow()

    init {
        handleIntent(HomeIntent.LoadDiscovery)
    }

    fun handleIntent(intent: HomeIntent) {
        when (intent) {
            is HomeIntent.LoadDiscovery -> loadDiscovery(forceRefresh = false)
            is HomeIntent.RefreshDiscovery -> loadDiscovery(forceRefresh = true)
        }
    }

    fun playTrack(track: Track) {
        viewModelScope.launch {
            player.playTrack(track.toPlayerTrack())
        }
    }

    private fun loadDiscovery(forceRefresh: Boolean) {
        viewModelScope.launch {
            if (forceRefresh || _uiState.value is HomeUiState.Error) {
                _uiState.value = HomeUiState.Loading
            }
            
            homeRepository.getHomeDiscovery(forceRefresh)
                .onSuccess { data ->
                    _uiState.value = HomeUiState.Success(data)
                }
                .onError { error ->
                    if (error is SonicError.Api && error.code == 401) {
                        homeRepository.clearCache()
                    }
                    val message = when (error) {
                        is SonicError.Api -> error.message
                        is SonicError.Network -> "Network error. Please check your connection."
                        is SonicError.Serialization -> "Data processing error."
                        is SonicError.Unknown -> error.message ?: "An unexpected error occurred."
                        else -> "An unexpected error occurred."
                    }
                    _uiState.value = HomeUiState.Error(message)
                }
        }
    }
}
