package com.aftab005.sonic.core.player.model

/**
 * Flattened track representation consumed by the audio player.
 * Maps from the network Track model via [toPlayerTrack].
 */
data class PlayerTrack(
    val id: String,
    val url: String,
    val title: String,
    val artist: String,
    val artworkUrl: String,
    val durationMs: Long?,
    val isHls: Boolean,
    val albumTitle: String? = null
)
