package com.aftab005.sonic.core.player

import android.app.Application
import android.content.ComponentName
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.session.MediaController
import androidx.media3.session.SessionToken
import com.aftab005.sonic.core.player.model.PlayerTrack
import com.google.common.util.concurrent.ListenableFuture
import com.google.common.util.concurrent.MoreExecutors
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import androidx.core.net.toUri

/**
 * Android implementation of [SonicPlayer] backed by Media3 ExoPlayer + MediaSession.
 *
 * Uses [MediaController] to communicate with [MediaPlaybackService] which manages
 * the actual ExoPlayer instance and foreground notification.
 */
class AndroidSonicPlayer(
    private val context: Application
) : SonicPlayer {

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    private var controllerFuture: ListenableFuture<MediaController>? = null
    private var controller: MediaController? = null

    private val _playbackState = MutableStateFlow<PlaybackState>(PlaybackState.Idle)
    override val playbackState: StateFlow<PlaybackState> = _playbackState.asStateFlow()

    private val _currentTrack = MutableStateFlow<PlayerTrack?>(null)
    override val currentTrack: StateFlow<PlayerTrack?> = _currentTrack.asStateFlow()

    private val _progress = MutableStateFlow(PlaybackProgress())
    override val progress: StateFlow<PlaybackProgress> = _progress.asStateFlow()

    private val _queue = MutableStateFlow<List<PlayerTrack>>(emptyList())

    override val queue: StateFlow<List<PlayerTrack>> = _queue.asStateFlow()

    private val trackList = mutableListOf<PlayerTrack>()

    init {
        connectToService()
    }

    private fun connectToService() {
        val sessionToken = SessionToken(context, ComponentName(context, MediaPlaybackService::class.java))
        controllerFuture = MediaController.Builder(context, sessionToken).buildAsync()
        controllerFuture?.addListener({
            controller = controllerFuture?.let { future ->
                if (future.isDone && !future.isCancelled) future.get() else null
            }
            controller?.addListener(playerListener)
            startProgressPolling()
        }, MoreExecutors.directExecutor())
    }

    private val playerListener = object : Player.Listener {
        override fun onPlaybackStateChanged(state: Int) {
            _playbackState.value = mapPlaybackState(state,
                controller?.isPlaying == true)
        }

        override fun onIsPlayingChanged(isPlaying: Boolean) {
            _playbackState.value = mapPlaybackState(
                controller?.playbackState ?: Player.STATE_IDLE,
                isPlaying
            )
        }

        override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
            val id = mediaItem?.mediaId
            val track = trackList.firstOrNull { it.id == id }
            _currentTrack.value = track
        }

        override fun onPlayerError(error: androidx.media3.common.PlaybackException) {
            _playbackState.value = PlaybackState.Error(error.message ?: "Playback error")
        }
    }

    private fun mapPlaybackState(exoState: Int, isPlaying: Boolean): PlaybackState {
        return when {
            exoState == Player.STATE_BUFFERING -> PlaybackState.Buffering
            isPlaying -> PlaybackState.Playing
            exoState == Player.STATE_READY -> PlaybackState.Paused
            exoState == Player.STATE_ENDED -> PlaybackState.Idle
            exoState == Player.STATE_IDLE -> PlaybackState.Idle
            else -> PlaybackState.Idle
        }
    }

    private fun startProgressPolling() {
        scope.launch {
            while (isActive) {
                controller?.let { ctrl ->
                    val pos = ctrl.currentPosition.toFloat() / 1000f
                    val dur = ctrl.duration.let { if (it > 0) it.toFloat() / 1000f else 0f }
                    _progress.value = PlaybackProgress(positionSec = pos, durationSec = dur)
                }
                delay(250L)
            }
        }
    }

    private fun PlayerTrack.toMediaItem(): MediaItem {
        val metadata = MediaMetadata.Builder()
            .setTitle(title)
            .setArtist(artist)
            .setAlbumTitle(albumTitle)
            .setArtworkUri(artworkUrl.toUri())
            .build()

        return MediaItem.Builder()
            .setMediaId(id)
            .setUri(url)
            .setMediaMetadata(metadata)
            .build()
    }

    override suspend fun setQueue(tracks: List<PlayerTrack>) {
        trackList.clear()
        trackList.addAll(tracks)
        _queue.value = tracks.toList()

        controller?.let { ctrl ->
            ctrl.stop()
            ctrl.clearMediaItems()
            ctrl.addMediaItems(tracks.map { it.toMediaItem() })
            ctrl.prepare()
        }
    }

    override suspend fun playTrack(track: PlayerTrack) {
        trackList.clear()
        trackList.add(track)
        _queue.value = listOf(track)
        _currentTrack.value = track

        controller?.let { ctrl ->
            ctrl.stop()
            ctrl.clearMediaItems()
            ctrl.addMediaItem(track.toMediaItem())
            ctrl.prepare()
            ctrl.play()
        }
    }

    override suspend fun play() {
        controller?.play()
    }

    override suspend fun pause() {
        controller?.pause()
    }

    override suspend fun skipToNext() {
        controller?.let { ctrl ->
            if (ctrl.hasNextMediaItem()) {
                ctrl.seekToNextMediaItem()
            }
        }
    }

    override suspend fun skipToPrevious() {
        controller?.let { ctrl ->
            if (ctrl.hasPreviousMediaItem()) {
                ctrl.seekToPreviousMediaItem()
            }
        }
    }

    override suspend fun seekTo(positionSec: Float) {
        controller?.seekTo((positionSec * 1000).toLong())
    }

    override suspend fun addToQueue(track: PlayerTrack) {
        trackList.add(track)
        _queue.value = trackList.toList()
        controller?.addMediaItem(track.toMediaItem())
    }

    override suspend fun removeFromQueue(track: PlayerTrack) {
        val index = trackList.indexOfFirst { it.id == track.id }
        if (index != -1) {
            trackList.removeAt(index)
            _queue.value = trackList.toList()
            controller?.let { ctrl ->
                if (index < ctrl.mediaItemCount) {
                    ctrl.removeMediaItem(index)
                }
            }
        }
    }

    override suspend fun clearQueue() {
        controller?.stop()
        controller?.clearMediaItems()
        trackList.clear()
        _queue.value = emptyList()
        _currentTrack.value = null
        _playbackState.value = PlaybackState.Idle
        _progress.value = PlaybackProgress()
    }

    override fun release() {
        controller?.removeListener(playerListener)
        controllerFuture?.let { MediaController.releaseFuture(it) }
        controller = null
        _currentTrack.value = null
        _playbackState.value = PlaybackState.Idle
        _progress.value = PlaybackProgress()
        trackList.clear()
        _queue.value = emptyList()
        scope.cancel()
    }
}
