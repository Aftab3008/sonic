package com.aftab005.sonic.features.discovery.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.features.discovery.data.DiscoveryRepository
import com.aftab005.sonic.features.discovery.data.GenresDetailsResponse
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class DiscoveryViewModel(
    private val discoveryRepository: DiscoveryRepository
): ViewModel() {
    private val _uiState = MutableStateFlow<DiscoveryUiState>(DiscoveryUiState.Loading)
    val uiState: StateFlow<DiscoveryUiState> = _uiState.asStateFlow()

    private var lastSuccessData: GenresDetailsResponse ? = null

    init {
        handleIntent(DiscoveryIntent.LoadGenre)
    }

    fun handleIntent(intent: DiscoveryIntent){
        when(intent){
            is DiscoveryIntent.LoadGenre -> loadGenres(false)
            is DiscoveryIntent.RefreshGenre -> loadGenres(true)
        }
    }

    private fun loadGenres(forceRefresh: Boolean) {
        if (!forceRefresh && (_uiState.value is DiscoveryUiState.Success || _uiState.value is DiscoveryUiState.Refreshing)) {
            return
        }

        if (forceRefresh || _uiState.value is DiscoveryUiState.Error) {
            _uiState.value = lastSuccessData
                ?.let {
                    DiscoveryUiState.Refreshing(it)
                } ?: DiscoveryUiState.Loading
        }

        viewModelScope.launch {
            discoveryRepository.getGenresDetails(forceRefresh)
                .onSuccess { data ->
                    lastSuccessData = data
                    _uiState.value = DiscoveryUiState.Success(data)
                }
                .onError { error ->
                    val message = when (error) {
                        is SonicError.Api           -> error.message
                        is SonicError.Network       -> "Network error. Please check your connection."
                        is SonicError.Serialization -> "Data processing error."
                        is SonicError.Unknown       -> error.message ?: "An unexpected error occurred."
                        else                        -> "An unexpected error occurred."
                    }
                    _uiState.value = DiscoveryUiState.Error(message)
                }
        }
    }
}