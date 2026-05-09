package com.aftab005.sonic.core.player

import android.content.Intent
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService

/**
 * Foreground service that hosts the ExoPlayer instance and MediaSession.
 *
 * Mirrors the responsibilities of Expo's PlaybackService.ts:
 * - Background audio playback
 * - Lock-screen / notification controls
 * - Media session for remote control events (play, pause, next, previous, seek)
 *
 * The service lifecycle matches Expo's AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification:
 * when the task is removed, playback stops and the notification is dismissed.
 */
@OptIn(UnstableApi::class)
class MediaPlaybackService : MediaSessionService() {

    private var player: ExoPlayer? = null
    private var mediaSession: MediaSession? = null

    override fun onCreate() {
        super.onCreate()

        val audioAttributes = AudioAttributes.Builder()
            .setUsage(C.USAGE_MEDIA)
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .build()

        player = ExoPlayer.Builder(this)
            .setAudioAttributes(audioAttributes, /* handleAudioFocus = */ true)
            .setHandleAudioBecomingNoisy(true)
            .build()

        mediaSession = MediaSession.Builder(this, player!!)
            .build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    override fun onTaskRemoved(rootIntent: Intent?) {
        player?.let { exoPlayer ->
            if (!exoPlayer.playWhenReady || exoPlayer.mediaItemCount == 0) {
                stopSelf()
            }
        }
    }

    override fun onDestroy() {
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        player = null
        super.onDestroy()
    }
}
