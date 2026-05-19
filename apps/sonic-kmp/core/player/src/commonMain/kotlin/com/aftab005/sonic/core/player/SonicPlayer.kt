package com.aftab005.sonic.core.player

import com.aftab005.sonic.core.player.model.PlayerTrack
import kotlinx.coroutines.flow.StateFlow

interface SonicPlayer {
    val playbackState: StateFlow<PlaybackState>

    val currentTrack: StateFlow<PlayerTrack?>

    val progress: StateFlow<PlaybackProgress>

    val queue: StateFlow<List<PlayerTrack>>

    suspend fun setQueue(tracks: List<PlayerTrack>)

    suspend fun playTrack(track: PlayerTrack)

    suspend fun play()

    suspend fun pause()

    suspend fun skipToNext()

    suspend fun skipToPrevious()

    suspend fun seekTo(positionSec: Float)

    suspend fun addToQueue(track: PlayerTrack)

    suspend fun removeFromQueue(track: PlayerTrack)

    suspend fun clearQueue()

    fun release()
}
