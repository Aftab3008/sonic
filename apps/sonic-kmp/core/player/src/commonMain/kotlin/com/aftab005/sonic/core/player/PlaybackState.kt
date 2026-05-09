package com.aftab005.sonic.core.player

/**
 * Represents the current state of audio playback.
 * Maps to react-native-track-player's State enum.
 */
sealed class PlaybackState {
    data object Idle : PlaybackState()
    data object Loading : PlaybackState()
    data object Buffering : PlaybackState()
    data object Ready : PlaybackState()
    data object Playing : PlaybackState()
    data object Paused : PlaybackState()
    data class Error(val message: String) : PlaybackState()
}

/**
 * Tracks the current position and total duration of playback.
 * Values are in seconds (matching the Expo useProgress hook output).
 */
data class PlaybackProgress(
    val positionSec: Float = 0f,
    val durationSec: Float = 0f
) {
    val progressFraction: Float
        get() = if (durationSec > 0f) (positionSec / durationSec).coerceIn(0f, 1f) else 0f
}
