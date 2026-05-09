package com.aftab005.sonic.core.player

import com.aftab005.sonic.core.player.model.PlayerTrack
import kotlinx.coroutines.flow.StateFlow

/**
 * Common interface for the audio player engine.
 * Platform implementations wrap Media3 ExoPlayer (Android) and AVQueuePlayer (iOS).
 *
 * This is the single API consumed by ViewModels and UI composables.
 */
interface SonicPlayer {

    /** Current playback state (playing, paused, buffering, etc.) */
    val playbackState: StateFlow<PlaybackState>

    /** Currently active track, or null if nothing is loaded */
    val currentTrack: StateFlow<PlayerTrack?>

    /** Real-time playback progress (position + duration in seconds) */
    val progress: StateFlow<PlaybackProgress>

    /** Current playback queue */
    val queue: StateFlow<List<PlayerTrack>>

    /** Replace the queue with a new list of tracks */
    suspend fun setQueue(tracks: List<PlayerTrack>)

    /** Play a specific track. If not in queue, it is appended first. */
    suspend fun playTrack(track: PlayerTrack)

    /** Resume playback of the current track */
    suspend fun play()

    /** Pause playback */
    suspend fun pause()

    /** Skip to the next track in queue */
    suspend fun skipToNext()

    /** Skip to the previous track in queue */
    suspend fun skipToPrevious()

    /** Seek to a position in seconds */
    suspend fun seekTo(positionSec: Float)

    /** Clear the queue and stop playback */
    suspend fun clearQueue()

    /** Release all player resources */
    fun release()
}
