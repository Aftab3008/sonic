package com.aftab005.sonic.features.home.presentation

import com.aftab005.sonic.core.network.models.HomeDiscoveryResponse

sealed class HomeUiState {
    object Loading : HomeUiState()
    data class Refreshing(val previousData: HomeDiscoveryResponse) : HomeUiState()
    data class Success(val data: HomeDiscoveryResponse) : HomeUiState()
    data class Error(val message: String) : HomeUiState()
}
