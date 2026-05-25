package com.aftab005.sonic.features.album

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.ui.components.ErrorView
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled
import com.aftab005.sonic.features.album.presentation.AlbumDetailIntent
import com.aftab005.sonic.features.album.presentation.AlbumDetailUiState
import com.aftab005.sonic.features.album.presentation.AlbumDetailViewModel
import com.aftab005.sonic.features.album.ui.components.*
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun AlbumDetailScreen(
    albumId: String,
    onBack: () -> Unit,
    albumViewModel: AlbumDetailViewModel = koinViewModel(),
) {
    val uiState by albumViewModel.uiState.collectAsStateWithLifecycle()
    val scrollState = rememberLazyListState()
    
    val scrollOffset = remember { derivedStateOf { 
        if (scrollState.firstVisibleItemIndex > 0) 1f 
        else (scrollState.firstVisibleItemScrollOffset / 500f).coerceIn(0f, 1f)
    } }

    LaunchedEffect(albumId) {
        albumViewModel.handleIntent(AlbumDetailIntent.LoadAlbum(albumId))
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
    ) {
        when (val state = uiState) {
            is AlbumDetailUiState.Loading -> {
                AlbumDetailSkeleton(modifier = Modifier.padding(top = 56.vScaled))
            }

            is AlbumDetailUiState.Success -> {
                val album = state.album
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    state = scrollState
                ) {
                    item {
                        AlbumDetailHeader(album = album)
                    }

                    item {
                        AlbumDetailControls(
                            onPlayAll = { albumViewModel.handleIntent(AlbumDetailIntent.PlayAll) },
                            onShuffle = { albumViewModel.handleIntent(AlbumDetailIntent.Shuffle) },
                        )
                    }

                    itemsIndexed(
                        items = album.tracks,
                        key = { _, track -> track.id },
                    ) { index, track ->
                        AlbumDetailTrackRow(
                            track = track,
                            trackIndex = index,
                            isPlaying = false, // TODO: wire to player state
                            onClick = { albumViewModel.handleIntent(AlbumDetailIntent.PlayTrack(index)) },
                        )
                    }

                    item { Spacer(modifier = Modifier.height(140.vScaled)) }
                }

                // Sticky Top Bar
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(90.vScaled)
                        .background(
                            SonicTheme.colors.background.copy(alpha = scrollOffset.value * 0.95f)
                        )
                        .statusBarsPadding(),
                    contentAlignment = Alignment.CenterStart
                ) {
                    if (scrollOffset.value > 0.5f) {
                        Text(
                            text = album.title,
                            color = Color.White.copy(alpha = (scrollOffset.value - 0.5f) * 2),
                            fontSize = 16.mTextScaled,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                            modifier = Modifier.padding(horizontal = 60.scaled)
                        )
                    }
                }
            }

            is AlbumDetailUiState.Error -> {
                ErrorView(
                    message = state.message,
                    onRetry = { albumViewModel.handleIntent(AlbumDetailIntent.LoadAlbum(albumId)) }
                )
            }
        }

        IconButton(
            onClick = onBack,
            modifier = Modifier
                .statusBarsPadding()
                .padding(top = 8.vScaled, start = 8.scaled)
                .size(40.scaled)
                .background(
                    Color.Black.copy(alpha = (0.3f * (1f - scrollOffset.value)).coerceAtLeast(0f)),
                    CircleShape
                ),
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = "Back",
                tint = Color.White,
                modifier = Modifier.size(24.scaled)
            )
        }
    }
}
