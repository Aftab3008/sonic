package com.aftab005.sonic.features.album.presentation

sealed class AlbumDetailIntent {
    /** Load (or reload) the album by its ID */
    data class LoadAlbum(val albumId: String) : AlbumDetailIntent()

    /** Play a specific track, with the full album as the queue context */
    data class PlayTrack(val trackIndex: Int) : AlbumDetailIntent()

    /** Start playback from the first track */
    data object PlayAll : AlbumDetailIntent()

    /** Shuffle all tracks and start playback */
    data object Shuffle : AlbumDetailIntent()
}
