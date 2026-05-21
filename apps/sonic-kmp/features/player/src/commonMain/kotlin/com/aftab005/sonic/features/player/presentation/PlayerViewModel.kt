package com.aftab005.sonic.features.player.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.player.PlaybackState
import com.aftab005.sonic.core.player.SonicPlayer
import com.aftab005.sonic.core.player.model.PlayerTrack
import com.aftab005.sonic.core.player.model.toPlayerTrack
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

sealed class PlayerUiState {
    data object Empty : PlayerUiState()
    data class Active(
        val track: PlayerTrack,
        val isPlaying: Boolean,
        val isBuffering: Boolean,
        val positionSec: Float,
        val durationSec: Float
    ) : PlayerUiState()
}

sealed class PlayerIntent {
    data object PlayPause : PlayerIntent()
    data object SkipNext : PlayerIntent()
    data object SkipPrevious : PlayerIntent()
    data class SeekTo(val positionSec: Float) : PlayerIntent()
    data class PlayTrack(val track: Track) : PlayerIntent()
    data class SetQueueAndPlay(val tracks: List<Track>, val startTrack: Track) : PlayerIntent()
    data class SetTrackAndPlay(val track: Track) : PlayerIntent()
}

/**
 * Player ViewModel following MVI pattern.
 * Bridges the [SonicPlayer] engine with Compose UI via [PlayerUiState].
 */
class PlayerViewModel(
    private val player: SonicPlayer
) : ViewModel() {

    val uiState: StateFlow<PlayerUiState> = combine(
        player.currentTrack,
        player.playbackState,
        player.progress
    ) { track, state, progress ->
        if (track == null) {
            PlayerUiState.Empty
        } else {
            PlayerUiState.Active(
                track = track,
                isPlaying = state is PlaybackState.Playing,
                isBuffering = state is PlaybackState.Buffering || state is PlaybackState.Loading,
                positionSec = progress.positionSec,
                durationSec = progress.durationSec
            )
        }
    }.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        PlayerUiState.Empty
    )
    val hasActiveTrack: StateFlow<Boolean> = player.currentTrack.let { flow ->
        val result = MutableStateFlow(false)
        viewModelScope.launch {
            flow.collect { result.value = it != null }
        }
        result.asStateFlow()
    }

    fun handleIntent(intent: PlayerIntent) {
        viewModelScope.launch {
            when (intent) {
                is PlayerIntent.PlayPause -> {
                    val current = player.playbackState.value
                    if (current is PlaybackState.Playing) {
                        player.pause()
                    } else {
                        player.play()
                    }
                }
                is PlayerIntent.SkipNext -> player.skipToNext()
                is PlayerIntent.SkipPrevious -> player.skipToPrevious()
                is PlayerIntent.SeekTo -> player.seekTo(intent.positionSec)
                is PlayerIntent.PlayTrack -> {
                    player.playTrack(intent.track.toPlayerTrack())
                }
                is PlayerIntent.SetQueueAndPlay -> {
                    val mapped = intent.tracks.map { it.toPlayerTrack() }
                    val startIndex = mapped.indexOfFirst { it.id == intent.startTrack.id }
                        .takeIf { it >= 0 } ?: 0
                    player.setQueue(
                        tracks = mapped,
                        startIndex = startIndex,
                        playWhenReady = true
                    )
                }
                is PlayerIntent.SetTrackAndPlay -> {
                    val playerTrack = intent.track.toPlayerTrack()
                    player.addToQueue(playerTrack)
                    val newIndex = player.queue.value.lastIndex
                    if (newIndex >= 0) {
                        player.playFromQueue(newIndex)
                    }
                }
            }
        }
    }
}
