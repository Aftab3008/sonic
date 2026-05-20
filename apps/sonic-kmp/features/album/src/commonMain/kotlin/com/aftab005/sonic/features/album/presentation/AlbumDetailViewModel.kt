package com.aftab005.sonic.features.album.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.player.SonicPlayer
import com.aftab005.sonic.core.player.model.toPlayerTrack
import com.aftab005.sonic.features.album.data.AlbumRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AlbumDetailViewModel(
    private val albumRepository: AlbumRepository,
    private val player: SonicPlayer,
) : ViewModel() {
    private val _uiState = MutableStateFlow<AlbumDetailUiState>(AlbumDetailUiState.Loading)
    val uiState: StateFlow<AlbumDetailUiState> = _uiState.asStateFlow()

    fun handleIntent(intent: AlbumDetailIntent) {
        when (intent) {
            is AlbumDetailIntent.LoadAlbum -> loadAlbum(intent.albumId)
            is AlbumDetailIntent.PlayTrack -> playTrackAtIndex(intent.trackIndex)
            is AlbumDetailIntent.PlayAll   -> playAll()
            is AlbumDetailIntent.Shuffle   -> shuffle()
        }
    }

    private fun loadAlbum(albumId: String, forceRefresh: Boolean = false) {
        viewModelScope.launch {
            _uiState.value = AlbumDetailUiState.Loading
            albumRepository.getAlbumDetail(albumId, forceRefresh)
                .onSuccess { album -> _uiState.value = AlbumDetailUiState.Success(album) }
                .onError { error ->
                    val message = when (error) {
                        is SonicError.Api     -> error.message
                        is SonicError.Network -> "Network error. Please check your connection."
                        else -> "An unexpected error occurred."
                    }
                    _uiState.value = AlbumDetailUiState.Error(message)
                }
        }
    }

    private fun playTrackAtIndex(index: Int) {
        val album = (uiState.value as? AlbumDetailUiState.Success)?.album ?: return
        viewModelScope.launch {
            val queue = album.tracks.map { it.toPlayerTrack(album) }
            val safeIndex = index.coerceIn(0, queue.lastIndex)
            player.setQueue(tracks = queue, startIndex = safeIndex, playWhenReady = true)
        }
    }

    private fun playAll() {
        val album = (uiState.value as? AlbumDetailUiState.Success)?.album ?: return
        viewModelScope.launch {
            val queue = album.tracks.map { it.toPlayerTrack(album) }
            if (queue.isNotEmpty()) player.setQueue(tracks = queue, startIndex = 0, playWhenReady = true)
        }
    }

    private fun shuffle() {
        val album = (uiState.value as? AlbumDetailUiState.Success)?.album ?: return
        viewModelScope.launch {
            val queue = album.tracks.map { it.toPlayerTrack(album) }.shuffled()
            if (queue.isNotEmpty()) player.setQueue(tracks = queue, startIndex = 0, playWhenReady = true)
        }
    }
}
