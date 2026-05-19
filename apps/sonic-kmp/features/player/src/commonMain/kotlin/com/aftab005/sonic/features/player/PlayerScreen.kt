package com.aftab005.sonic.features.player

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.zIndex
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.player.components.*
import com.aftab005.sonic.features.player.presentation.PlayerIntent
import com.aftab005.sonic.features.player.presentation.PlayerUiState
import com.aftab005.sonic.features.player.presentation.PlayerViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun PlayerScreen(onBack: () -> Unit, viewModel: PlayerViewModel = koinViewModel()) {
    val state by viewModel.uiState.collectAsStateWithLifecycle()

    when (val s = state) {
        is PlayerUiState.Empty -> {
            Box(
                    modifier = Modifier.fillMaxSize().statusBarsPadding(),
                    contentAlignment = Alignment.Center
            ) { Text(text = "No track playing", color = SonicTheme.colors.onSurface) }
        }
        is PlayerUiState.Active -> {
            ActivePlayerScreen(
                    state = s,
                    onBack = onBack,
                    onPlayPause = { viewModel.handleIntent(PlayerIntent.PlayPause) },
                    onSkipNext = { viewModel.handleIntent(PlayerIntent.SkipNext) },
                    onSkipPrevious = { viewModel.handleIntent(PlayerIntent.SkipPrevious) },
                    onSeek = { viewModel.handleIntent(PlayerIntent.SeekTo(it)) }
            )
        }
    }
}

@Composable
private fun ActivePlayerScreen(
        state: PlayerUiState.Active,
        onBack: () -> Unit,
        onPlayPause: () -> Unit,
        onSkipNext: () -> Unit,
        onSkipPrevious: () -> Unit,
        onSeek: (Float) -> Unit
) {
    Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
        PlayerBackground(artworkUrl = state.track.artworkUrl)

        Column(
                modifier =
                        Modifier.fillMaxSize()
                                .statusBarsPadding()
                                .verticalScroll(rememberScrollState())
                                .padding(horizontal = SonicTheme.dimensions.screenPadding)
                                .padding(top = 84.vScaled, bottom = 32.vScaled),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.sectionSpacing)
        ) {
            Box(modifier = Modifier.fillMaxWidth().padding(horizontal = 32.mScaled), contentAlignment = Alignment.Center) {
                PlayerAlbumArt(
                        artworkUrl = state.track.artworkUrl,
                        modifier = Modifier.fillMaxWidth()
                )
            }

            Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing)
            ) {
                PlayerMetadata(title = state.track.title, artist = state.track.artist)

                PlayerProgress(
                        positionSec = state.positionSec,
                        durationSec = state.durationSec,
                        onSeek = onSeek
                )

                PlayerPlaybackControls(
                        isPlaying = state.isPlaying,
                        isBuffering = state.isBuffering,
                        onPlayPause = onPlayPause,
                        onSkipNext = onSkipNext,
                        onSkipPrevious = onSkipPrevious
                )

                PlayerUtilities()
            }
        }

        PlayerHeader(
                title = state.track.albumTitle,
                topPaddingDp = 0f,
                onBack = onBack,
                modifier =
                        Modifier.statusBarsPadding()
                                .zIndex(
                                        1f
                                )
                )
    }
}
