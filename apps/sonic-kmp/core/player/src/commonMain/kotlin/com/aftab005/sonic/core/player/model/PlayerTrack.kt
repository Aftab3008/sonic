package com.aftab005.sonic.core.player.model

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
