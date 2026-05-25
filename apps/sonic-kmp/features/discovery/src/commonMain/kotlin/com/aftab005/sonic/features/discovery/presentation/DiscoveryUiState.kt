package com.aftab005.sonic.features.discovery.presentation

import com.aftab005.sonic.features.discovery.data.GenresDetailsResponse


sealed class DiscoveryUiState {
    object Loading : DiscoveryUiState()
    data class Success(val data: GenresDetailsResponse) : DiscoveryUiState()
    data class Error(val message: String) : DiscoveryUiState()
    data class Refreshing(val previousData: GenresDetailsResponse) : DiscoveryUiState()
}