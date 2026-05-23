package com.aftab005.sonic.root

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.ui.components.BackHandler
import com.aftab005.sonic.features.player.presentation.PlayerIntent
import com.aftab005.sonic.features.player.presentation.PlayerUiState
import com.aftab005.sonic.features.player.presentation.PlayerViewModel
import com.aftab005.sonic.features.player.ui.PlayerSheet
import com.aftab005.sonic.features.player.ui.components.MiniPlayer

@Composable
fun AuthenticatedPlayerUI(playerViewModel: PlayerViewModel, showTabBar: @Composable () -> Unit) {
    val playerState by playerViewModel.uiState.collectAsStateWithLifecycle()
    val hasActiveTrack by playerViewModel.hasActiveTrack.collectAsStateWithLifecycle()
    var isPlayerVisible by remember { mutableStateOf(false) }

    BackHandler(enabled = isPlayerVisible) {
        isPlayerVisible = false
    }

    Box(modifier = Modifier.fillMaxSize()) {
        if (hasActiveTrack && !isPlayerVisible) {
            val activeState = playerState as? PlayerUiState.Active
            if (activeState != null) {
                MiniPlayer(
                    track = activeState.track,
                    isPlaying = activeState.isPlaying,
                    isBuffering = activeState.isBuffering,
                    positionSec = activeState.positionSec,
                    durationSec = activeState.durationSec,
                    onPress = { isPlayerVisible = true },
                    onPlayPause = { playerViewModel.handleIntent(PlayerIntent.PlayPause) },
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        }

        showTabBar()

        PlayerSheet(visible = isPlayerVisible, onDismiss = { isPlayerVisible = false })
    }
}
