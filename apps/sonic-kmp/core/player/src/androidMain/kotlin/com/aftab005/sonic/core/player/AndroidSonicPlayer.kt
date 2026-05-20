package com.aftab005.sonic.core.player

import android.app.Application
import android.content.ComponentName
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
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
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

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

    private val _currentIndex = MutableStateFlow(-1)
    override val currentIndex: StateFlow<Int> = _currentIndex.asStateFlow()

    private val _progress = MutableStateFlow(PlaybackProgress())
    override val progress: StateFlow<PlaybackProgress> = _progress.asStateFlow()

    private val _queue = MutableStateFlow<List<PlayerTrack>>(emptyList())

    override val queue: StateFlow<List<PlayerTrack>> = _queue.asStateFlow()

    private val trackList = mutableListOf<PlayerTrack>()
    private val queueMutex = Mutex()

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
            val index = controller?.currentMediaItemIndex ?: -1
            _currentIndex.value = index
            _currentTrack.value = trackList.getOrNull(index)
        }

        override fun onPlayerError(error: androidx.media3.common.PlaybackException) {
            _playbackState.value = PlaybackState.Error(error.message ?: "Playback error")
        }
    }

    private fun mapPlaybackState(exoState: Int, isPlaying: Boolean): PlaybackState {
        return when (exoState) {
            Player.STATE_BUFFERING -> PlaybackState.Buffering
            Player.STATE_READY -> when {
                isPlaying -> PlaybackState.Playing
                controller?.playWhenReady == true -> PlaybackState.Ready
                else -> PlaybackState.Paused
            }
            Player.STATE_ENDED -> PlaybackState.Idle
            Player.STATE_IDLE -> PlaybackState.Idle
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

    override suspend fun setQueue(
        tracks: List<PlayerTrack>,
        startIndex: Int,
        playWhenReady: Boolean
    ) {
        queueMutex.withLock {
            val sanitized = tracks.filter { it.url.isNotBlank() }
            trackList.clear()
            trackList.addAll(sanitized)
            _queue.value = trackList.toList()

            if (sanitized.isEmpty()) {
                controller?.let { ctrl ->
                    ctrl.stop()
                    ctrl.clearMediaItems()
                }
                _currentIndex.value = -1
                _currentTrack.value = null
                _playbackState.value = PlaybackState.Idle
                _progress.value = PlaybackProgress()
                return
            }

            val safeStartIndex = startIndex.coerceIn(0, sanitized.lastIndex)
            _currentIndex.value = safeStartIndex
            _currentTrack.value = trackList.getOrNull(safeStartIndex)

            controller?.let { ctrl ->
                ctrl.stop()
                ctrl.setMediaItems(sanitized.map { it.toMediaItem() }, safeStartIndex, 0L)
                ctrl.prepare()
                if (playWhenReady) {
                    ctrl.play()
                } else {
                    _playbackState.value = PlaybackState.Ready
                }
            }
        }
    }

    override suspend fun playFromQueue(index: Int) {
        queueMutex.withLock {
            if (trackList.isEmpty()) return
            val safeIndex = index.coerceIn(0, trackList.lastIndex)
            controller?.let { ctrl ->
                if (ctrl.mediaItemCount > safeIndex) {
                    ctrl.seekToDefaultPosition(safeIndex)
                    ctrl.prepare()
                    ctrl.play()
                    _currentIndex.value = safeIndex
                    _currentTrack.value = trackList.getOrNull(safeIndex)
                }
            }
        }
    }

    override suspend fun playTrack(track: PlayerTrack) {
        if (track.url.isBlank()) return
        setQueue(listOf(track), startIndex = 0, playWhenReady = true)
    }

    override suspend fun play() {
        controller?.let { ctrl ->
            if (ctrl.mediaItemCount == 0 && trackList.isNotEmpty()) {
                playFromQueue(_currentIndex.value.takeIf { it >= 0 } ?: 0)
            } else {
                ctrl.play()
            }
        }
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
        if (track.url.isBlank()) return
        queueMutex.withLock {
            trackList.add(track)
            _queue.value = trackList.toList()
            controller?.addMediaItem(track.toMediaItem())
        }
    }

    override suspend fun removeFromQueueAt(index: Int) {
        queueMutex.withLock {
            if (index !in trackList.indices) return
            val removedCurrent = index == _currentIndex.value
            trackList.removeAt(index)
            _queue.value = trackList.toList()

            controller?.let { ctrl ->
                if (index < ctrl.mediaItemCount) {
                    ctrl.removeMediaItem(index)
                }

                if (trackList.isEmpty()) {
                    ctrl.stop()
                    _currentIndex.value = -1
                    _currentTrack.value = null
                    _playbackState.value = PlaybackState.Idle
                    _progress.value = PlaybackProgress()
                    return
                }

                val oldIndex = _currentIndex.value
                val newIndex = when {
                    removedCurrent -> oldIndex.coerceAtMost(trackList.lastIndex)
                    index < oldIndex -> oldIndex - 1
                    else -> oldIndex
                }.coerceIn(0, trackList.lastIndex)

                if (removedCurrent &&
                    ctrl.mediaItemCount > 0 &&
                    newIndex in 0 until ctrl.mediaItemCount &&
                    ctrl.currentMediaItemIndex != newIndex
                ) {
                    ctrl.seekToDefaultPosition(newIndex)
                }

                // ExoPlayer can auto-shift current index after removeMediaItem(), so we prefer
                // controller-reported index when valid and fall back to computed newIndex.
                val syncedIndex = ctrl.currentMediaItemIndex
                    .takeIf { it in trackList.indices }
                    ?: newIndex

                _currentIndex.value = syncedIndex
                _currentTrack.value = trackList.getOrNull(syncedIndex)
            }
        }
    }

    override suspend fun removeFromQueue(track: PlayerTrack) {
        val index = trackList.indexOfFirst { it.id == track.id }
        if (index >= 0) removeFromQueueAt(index)
    }

    override suspend fun clearQueue() {
        queueMutex.withLock {
            controller?.stop()
            controller?.clearMediaItems()
            trackList.clear()
            _queue.value = emptyList()
            _currentIndex.value = -1
            _currentTrack.value = null
            _playbackState.value = PlaybackState.Idle
            _progress.value = PlaybackProgress()
        }
    }

    override fun release() {
        controller?.removeListener(playerListener)
        controllerFuture?.let { MediaController.releaseFuture(it) }
        controller = null
        _currentIndex.value = -1
        _currentTrack.value = null
        _playbackState.value = PlaybackState.Idle
        _progress.value = PlaybackProgress()
        trackList.clear()
        _queue.value = emptyList()
        scope.cancel()
    }
}
