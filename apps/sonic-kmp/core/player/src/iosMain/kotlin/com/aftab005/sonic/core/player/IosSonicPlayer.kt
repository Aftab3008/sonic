package com.aftab005.sonic.core.player

import com.aftab005.sonic.core.player.model.PlayerTrack
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import platform.AVFAudio.AVAudioSession
import platform.AVFAudio.AVAudioSessionCategoryPlayback
import platform.AVFAudio.AVAudioSessionInterruptionNotification
import platform.AVFAudio.AVAudioSessionInterruptionTypeKey
import platform.AVFAudio.setActive
import platform.AVFoundation.AVPlayerItem
import platform.AVFoundation.AVPlayerItemDidPlayToEndTimeNotification
import platform.AVFoundation.AVPlayerItemStatusFailed
import platform.AVFoundation.AVPlayerTimeControlStatusPaused
import platform.AVFoundation.AVPlayerTimeControlStatusPlaying
import platform.AVFoundation.AVPlayerTimeControlStatusWaitingToPlayAtSpecifiedRate
import platform.AVFoundation.AVQueuePlayer
import platform.AVFoundation.addPeriodicTimeObserverForInterval
import platform.AVFoundation.advanceToNextItem
import platform.AVFoundation.currentItem
import platform.AVFoundation.duration
import platform.AVFoundation.insertItem
import platform.AVFoundation.pause
import platform.AVFoundation.play
import platform.AVFoundation.rate
import platform.AVFoundation.removeAllItems
import platform.AVFoundation.removeTimeObserver
import platform.AVFoundation.seekToTime
import platform.AVFoundation.timeControlStatus
import platform.CoreMedia.CMTimeGetSeconds
import platform.CoreMedia.CMTimeMakeWithSeconds
import platform.Foundation.NSData
import platform.Foundation.NSNotification
import platform.Foundation.NSNotificationCenter
import platform.Foundation.NSOperationQueue
import platform.Foundation.NSURL
import platform.Foundation.dataWithContentsOfURL
import platform.MediaPlayer.MPChangePlaybackPositionCommandEvent
import platform.MediaPlayer.MPMediaItemArtwork
import platform.MediaPlayer.MPMediaItemPropertyAlbumTitle
import platform.MediaPlayer.MPMediaItemPropertyArtist
import platform.MediaPlayer.MPMediaItemPropertyArtwork
import platform.MediaPlayer.MPMediaItemPropertyPlaybackDuration
import platform.MediaPlayer.MPMediaItemPropertyTitle
import platform.MediaPlayer.MPNowPlayingInfoCenter
import platform.MediaPlayer.MPNowPlayingInfoPropertyElapsedPlaybackTime
import platform.MediaPlayer.MPNowPlayingInfoPropertyPlaybackRate
import platform.MediaPlayer.MPRemoteCommandCenter
import platform.UIKit.UIImage
import platform.darwin.dispatch_get_main_queue

class IosSonicPlayer : SonicPlayer {
    private companion object {
        const val PREFETCH_BUFFER_SECONDS = 10.0
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main)

    private val avPlayer = AVQueuePlayer()
    private var timeObserver: Any? = null
    private var endObserver: Any? = null
    private var interruptionObserver: Any? = null
    private val queueMutex = Mutex()

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

    init {
        setupAudioSession()
        setupRemoteCommands()
        setupTimeObserver()
        setupNotifications()
        avPlayer.automaticallyWaitsToMinimizeStalling = true
    }

    @OptIn(ExperimentalForeignApi::class)
    private fun setupAudioSession() {
        try {
            val session = AVAudioSession.sharedInstance()
            session.setCategory(AVAudioSessionCategoryPlayback, error = null)
            session.setActive(true, error = null)
        } catch (e: Exception) {
            println("[IosSonicPlayer] Audio session setup failed: ${e.message}")
        }
    }

    private fun setupRemoteCommands() {
        val commandCenter = MPRemoteCommandCenter.sharedCommandCenter()

        commandCenter.playCommand.addTargetWithHandler { _ ->
            scope.launch { play() }
            0
        }

        commandCenter.pauseCommand.addTargetWithHandler { _ ->
            scope.launch { pause() }
            0
        }

        commandCenter.nextTrackCommand.addTargetWithHandler { _ ->
            scope.launch { skipToNext() }
            0
        }

        commandCenter.previousTrackCommand.addTargetWithHandler { _ ->
            scope.launch { skipToPrevious() }
            0
        }

        commandCenter.changePlaybackPositionCommand.addTargetWithHandler { event ->
            val posEvent = event as? MPChangePlaybackPositionCommandEvent
            posEvent?.let {
                scope.launch { seekTo(it.positionTime.toFloat()) }
            }
            0
        }
    }

    @OptIn(ExperimentalForeignApi::class)
    private fun setupTimeObserver() {
        val interval = CMTimeMakeWithSeconds(0.25, 600)
        timeObserver = avPlayer.addPeriodicTimeObserverForInterval(interval, dispatch_get_main_queue()) { time ->
            val pos = CMTimeGetSeconds(time).toFloat()
            val dur = avPlayer.currentItem?.duration?.let { CMTimeGetSeconds(it).toFloat() } ?: 0f
            val validDur = if (dur.isNaN() || dur.isInfinite()) 0f else dur
            val validPos = if (pos.isNaN() || pos.isInfinite()) 0f else pos
            _progress.value = PlaybackProgress(positionSec = validPos, durationSec = validDur)

            val currentItem = avPlayer.currentItem
            if (currentItem?.status == AVPlayerItemStatusFailed) {
                _playbackState.value = PlaybackState.Error("Playback failed")
            } else {
                _playbackState.value = when (avPlayer.timeControlStatus) {
                    AVPlayerTimeControlStatusPlaying -> PlaybackState.Playing
                    AVPlayerTimeControlStatusPaused -> {
                        if (_currentTrack.value != null) PlaybackState.Paused else PlaybackState.Idle
                    }
                    AVPlayerTimeControlStatusWaitingToPlayAtSpecifiedRate -> PlaybackState.Buffering
                    else -> _playbackState.value
                }
            }
        }
    }

    private fun setupNotifications() {
        endObserver = NSNotificationCenter.defaultCenter.addObserverForName(
            AVPlayerItemDidPlayToEndTimeNotification,
            null,
            NSOperationQueue.mainQueue
        ) { _ ->
            scope.launch {
                queueMutex.withLock {
                    if (_currentIndex.value < trackList.lastIndex) {
                        _currentIndex.value += 1
                        _currentTrack.value = trackList.getOrNull(_currentIndex.value)
                        updateNowPlayingInfo()
                    } else {
                        _playbackState.value = PlaybackState.Idle
                    }
                }
            }
        }

        interruptionObserver = NSNotificationCenter.defaultCenter.addObserverForName(
            AVAudioSessionInterruptionNotification,
            null,
            NSOperationQueue.mainQueue
        ) { notification ->
            handleInterruption(notification)
        }
    }

    private fun handleInterruption(notification: NSNotification?) {
        val userInfo = notification?.userInfo ?: return
        val type = (userInfo[AVAudioSessionInterruptionTypeKey] as? platform.Foundation.NSNumber)?.unsignedLongValue ?: return

        if (type == platform.AVFAudio.AVAudioSessionInterruptionTypeBegan) {
            scope.launch { pause() }
        } else {
            val options = (userInfo[platform.AVFAudio.AVAudioSessionInterruptionOptionKey] as? platform.Foundation.NSNumber)?.unsignedLongValue
            if (options == platform.AVFAudio.AVAudioSessionInterruptionOptionShouldResume) {
                scope.launch { play() }
            }
        }
    }

    private fun updateNowPlayingInfo() {
        val track = _currentTrack.value ?: return
        val expectedTrackId = track.id
        val info = mutableMapOf<Any?, Any?>(
            MPMediaItemPropertyTitle to track.title,
            MPMediaItemPropertyArtist to track.artist,
            MPNowPlayingInfoPropertyElapsedPlaybackTime to _progress.value.positionSec.toDouble(),
            MPNowPlayingInfoPropertyPlaybackRate to avPlayer.rate.toDouble()
        )
        track.albumTitle?.let { info[MPMediaItemPropertyAlbumTitle] = it }
        track.durationMs?.let { info[MPMediaItemPropertyPlaybackDuration] = it.toDouble() / 1000.0 }

        scope.launch(Dispatchers.Default) {
            val url = NSURL.URLWithString(track.artworkUrl) ?: return@launch
            val data = NSData.dataWithContentsOfURL(url) ?: return@launch
            val image = UIImage.imageWithData(data) ?: return@launch
            val artwork = MPMediaItemArtwork(image)

            launch(Dispatchers.Main) {
                if (_currentTrack.value?.id != expectedTrackId) return@launch
                val currentInfo = MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo?.toMutableMap() ?: info.toMutableMap()
                currentInfo[MPMediaItemPropertyArtwork] = artwork
                MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo = currentInfo
            }
        }

        MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo = info
    }

    @OptIn(ExperimentalForeignApi::class)
    private fun createPlayerItem(track: PlayerTrack): AVPlayerItem? {
        if (track.url.isBlank()) return null
        val url = NSURL.URLWithString(track.url) ?: return null
        val item = AVPlayerItem(uRL = url)
        item.preferredForwardBufferDuration = PREFETCH_BUFFER_SECONDS
        item.canUseNetworkResourcesForLiveStreamingWhilePaused = true
        return item
    }

    private fun rebuildQueueFrom(index: Int, playWhenReady: Boolean) {
        if (trackList.isEmpty()) {
            avPlayer.pause()
            avPlayer.removeAllItems()
            _currentIndex.value = -1
            _currentTrack.value = null
            _playbackState.value = PlaybackState.Idle
            _progress.value = PlaybackProgress()
            return
        }

        val safeIndex = index.coerceIn(0, trackList.lastIndex)
        avPlayer.pause()
        avPlayer.removeAllItems()

        for (i in safeIndex..trackList.lastIndex) {
            createPlayerItem(trackList[i])?.let { avPlayer.insertItem(it, afterItem = null) }
        }

        _currentIndex.value = safeIndex
        _currentTrack.value = trackList.getOrNull(safeIndex)
        _playbackState.value = PlaybackState.Loading
        updateNowPlayingInfo()

        if (playWhenReady) {
            avPlayer.play()
        } else {
            _playbackState.value = PlaybackState.Ready
        }
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
            rebuildQueueFrom(startIndex, playWhenReady)
        }
    }

    override suspend fun playFromQueue(index: Int) {
        queueMutex.withLock {
            if (trackList.isEmpty()) return
            rebuildQueueFrom(index, playWhenReady = true)
        }
    }

    override suspend fun playTrack(track: PlayerTrack) {
        if (track.url.isBlank()) return
        setQueue(listOf(track), startIndex = 0, playWhenReady = true)
    }

    override suspend fun play() {
        if (_currentTrack.value == null && trackList.isNotEmpty()) {
            playFromQueue(_currentIndex.value.takeIf { it >= 0 } ?: 0)
            return
        }
        avPlayer.play()
        updateNowPlayingInfo()
    }

    override suspend fun pause() {
        avPlayer.pause()
        updateNowPlayingInfo()
    }

    override suspend fun skipToNext() {
        queueMutex.withLock {
            if (_currentIndex.value < trackList.lastIndex) {
                _currentIndex.value += 1
                _currentTrack.value = trackList.getOrNull(_currentIndex.value)
                avPlayer.advanceToNextItem()
                avPlayer.play()
                updateNowPlayingInfo()
            }
        }
    }

    override suspend fun skipToPrevious() {
        queueMutex.withLock {
            if (_progress.value.positionSec > 3f) {
                seekTo(0f)
                return@withLock
            }
            if (_currentIndex.value > 0) {
                rebuildQueueFrom(_currentIndex.value - 1, playWhenReady = true)
            }
        }
    }

    @OptIn(ExperimentalForeignApi::class)
    override suspend fun seekTo(positionSec: Float) {
        val time = CMTimeMakeWithSeconds(positionSec.toDouble(), 600)
        avPlayer.seekToTime(time)
        updateNowPlayingInfo()
    }

    override suspend fun addToQueue(track: PlayerTrack) {
        if (track.url.isBlank()) return
        queueMutex.withLock {
            trackList.add(track)
            _queue.value = trackList.toList()
            if (_currentIndex.value >= 0) {
                // Rebuild from current index so AVQueuePlayer receives the newly appended
                // item in its internal queue and keeps next-track handoff seamless.
                val wasPlaying = _playbackState.value is PlaybackState.Playing
                rebuildQueueFrom(_currentIndex.value, playWhenReady = wasPlaying)
            }
        }
    }

    override suspend fun removeFromQueueAt(index: Int) {
        queueMutex.withLock {
            if (index !in trackList.indices) return
            val wasPlaying = _playbackState.value is PlaybackState.Playing
            trackList.removeAt(index)
            _queue.value = trackList.toList()

            if (trackList.isEmpty()) {
                avPlayer.pause()
                avPlayer.removeAllItems()
                _currentIndex.value = -1
                _queue.value = emptyList()
                _currentTrack.value = null
                _playbackState.value = PlaybackState.Idle
                _progress.value = PlaybackProgress()
                MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo = null
                return
            }

            val nextIndex = when {
                index < _currentIndex.value -> _currentIndex.value - 1
                index == _currentIndex.value -> _currentIndex.value.coerceAtMost(trackList.lastIndex)
                else -> _currentIndex.value
            }.coerceIn(0, trackList.lastIndex)

            rebuildQueueFrom(nextIndex, playWhenReady = wasPlaying)
        }
    }

    override suspend fun removeFromQueue(track: PlayerTrack) {
        val index = trackList.indexOfFirst { it.id == track.id }
        if (index >= 0) removeFromQueueAt(index)
    }

    override suspend fun clearQueue() {
        queueMutex.withLock {
            avPlayer.pause()
            avPlayer.removeAllItems()
            trackList.clear()
            _currentIndex.value = -1
            _queue.value = emptyList()
            _currentTrack.value = null
            _playbackState.value = PlaybackState.Idle
            _progress.value = PlaybackProgress()
            MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo = null
        }
    }

    @OptIn(ExperimentalForeignApi::class)
    override fun release() {
        timeObserver?.let { avPlayer.removeTimeObserver(it) }
        endObserver?.let { NSNotificationCenter.defaultCenter.removeObserver(it) }
        interruptionObserver?.let { NSNotificationCenter.defaultCenter.removeObserver(it) }
        avPlayer.pause()
        avPlayer.removeAllItems()

        try {
            AVAudioSession.sharedInstance().setActive(false, error = null)
        } catch (e: Exception) {
            println("[IosSonicPlayer] Audio session deactivation failed: ${e.message}")
        }

        MPNowPlayingInfoCenter.defaultCenter().nowPlayingInfo = null
        _currentTrack.value = null
        _currentIndex.value = -1
        _playbackState.value = PlaybackState.Idle
        _progress.value = PlaybackProgress()
        trackList.clear()
        _queue.value = emptyList()

        scope.cancel()
    }
}
