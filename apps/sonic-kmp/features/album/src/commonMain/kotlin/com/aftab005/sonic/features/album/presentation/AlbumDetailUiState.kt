package com.aftab005.sonic.features.album.presentation

import com.aftab005.sonic.core.network.models.AlbumDetail

sealed class AlbumDetailUiState {
    data object Loading : AlbumDetailUiState()
    data class Success(val album: AlbumDetail) : AlbumDetailUiState()
    data class Error(val message: String) : AlbumDetailUiState()
}
