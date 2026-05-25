package com.aftab005.sonic.features.discovery.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.discovery.presentation.GenreDetailUiState
import com.aftab005.sonic.features.discovery.presentation.GenreDetailViewModel
import com.aftab005.sonic.features.discovery.util.parseColorString


@Composable
fun GenreDetailScreen(
    genreSlug: String,
    genreName: String,
    genreViewModel: GenreDetailViewModel,
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
    onBack: () -> Unit
) {
    val genreUiState by genreViewModel.uiState.collectAsStateWithLifecycle()
    val scrollState = rememberLazyListState()

    val scrollOffset = remember {
        derivedStateOf {
            if (scrollState.firstVisibleItemIndex > 0) 1f
            else (scrollState.firstVisibleItemScrollOffset / 500f).coerceIn(0f, 1f)
        }
    }

    LaunchedEffect(genreSlug) {
        genreViewModel.loadGenreDetail(genreSlug)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background)
    ) {
        when (val state = genreUiState) {
            is GenreDetailUiState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = SonicTheme.colors.primary)
                }
            }
            is GenreDetailUiState.Error -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(SonicTheme.dimensions.screenPadding),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Couldn't load genre detail",
                        color = Color.White,
                        fontSize = 20.mTextScaled,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(8.vScaled))
                    Text(
                        text = state.message,
                        color = Color.White.copy(alpha = 0.6f),
                        fontSize = 14.mTextScaled,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(16.vScaled))
                    Button(
                        onClick = { genreViewModel.loadGenreDetail(genreSlug) },
                        colors = ButtonDefaults.buttonColors(containerColor = SonicTheme.colors.primary)
                    ) {
                        Text("Retry", color = Color.White)
                    }
                }
            }
            is GenreDetailUiState.Success -> {
                val detail = state.data
                val primaryColor = remember(detail.genre.primaryColor) {
                    detail.genre.primaryColor?.let { parseColorString(it) } ?: Color(0xFF6200EE)
                }
                val secondaryColor = remember(detail.genre.secondaryColor) {
                    detail.genre.secondaryColor?.let { parseColorString(it) } ?: primaryColor.copy(alpha = 0.6f)
                }

                val headerBrush = remember(primaryColor, secondaryColor) {
                    Brush.verticalGradient(
                        colors = listOf(
                            primaryColor.copy(alpha = 0.35f),
                            Color.Transparent
                        )
                    )
                }

                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    state = scrollState
                ) {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(260.vScaled)
                                .background(headerBrush)
                        ) {
                            Column(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .padding(horizontal = SonicTheme.dimensions.screenPadding)
                                    .padding(bottom = 24.dp),
                                verticalArrangement = Arrangement.Bottom
                            ) {
                                Text(
                                    text = "GENRE",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = SonicTheme.colors.primary,
                                    letterSpacing = 1.5.sp
                                )
                                Spacer(modifier = Modifier.height(6.dp))
                                Text(
                                    text = detail.genre.name,
                                    fontSize = 38.sp,
                                    fontWeight = FontWeight.ExtraBold,
                                    color = Color.White,
                                    lineHeight = 44.sp
                                )
                            }
                        }
                    }

                    if (detail.albums.isNotEmpty()) {
                        item {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 24.dp)
                            ) {
                                Text(
                                    text = "Featured Albums",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White,
                                    modifier = Modifier
                                        .padding(horizontal = SonicTheme.dimensions.screenPadding)
                                        .padding(bottom = 14.dp)
                                )

                                LazyRow(
                                    contentPadding = PaddingValues(horizontal = SonicTheme.dimensions.screenPadding),
                                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    items(detail.albums, key = { it.id }) { album ->
                                        GenreAlbumCard(
                                            album = album,
                                            onClick = { onNavigateToAlbum(SonicRoute.AlbumDetail(album.id)) }
                                        )
                                    }
                                }
                            }
                        }
                    }

                    if (detail.tracks.isNotEmpty()) {
                        item {
                            Text(
                                text = "Popular Tracks",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                modifier = Modifier
                                    .padding(horizontal = SonicTheme.dimensions.screenPadding)
                                    .padding(bottom = 12.dp)
                            )
                        }

                        items(detail.tracks, key = { it.id }) { track ->
                            GenreTrackRow(
                                track = track,
                                onClick = { genreViewModel.playTrack(track) }
                            )
                        }
                    }

                    item {
                        Spacer(modifier = Modifier.height(140.vScaled))
                    }
                }

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
                            text = detail.genre.name,
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
                )
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

@Composable
fun GenreAlbumCard(
    album: AlbumCard,
    onClick: () -> Unit
) {
    val cardSize = 140.scaled
    Column(
        modifier = Modifier
            .width(cardSize)
            .clickable(onClick = onClick)
    ) {
        Box(
            modifier = Modifier
                .size(cardSize)
                .clip(RoundedCornerShape(14.scaled))
                .background(SonicTheme.colors.surfaceContainer)
        ) {
            AsyncImage(
                model = album.coverImageUrl,
                contentDescription = album.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
        Spacer(modifier = Modifier.height(8.vScaled))
        Text(
            text = album.title,
            color = SonicTheme.colors.onSurface,
            fontSize = 13.mTextScaled,
            fontWeight = FontWeight.Bold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
        Text(
            text = album.artists?.firstOrNull()?.artist?.name ?: "Unknown Artist",
            color = SonicTheme.colors.onSurfaceVariant,
            fontSize = 11.mTextScaled,
            fontWeight = FontWeight.Medium,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(top = 2.vScaled)
        )
    }
}

@Composable
fun GenreTrackRow(
    track: Track,
    onClick: () -> Unit
) {
    val title = track.displayTitle
    val artists = remember(track.id) {
        track.recording.artists?.joinToString(", ") { it.artist.name } ?: "Unknown Artist"
    }
    val coverUrl = track.coverImageUrl ?: track.album?.coverImageUrl
    val durationText = remember(track.id) {
        val durationMs = track.recording.durationMs ?: 0L
        val seconds = (durationMs / 1000) % 60
        val minutes = (durationMs / 1000) / 60
        "${minutes}:${seconds.toString().padStart(2, '0')}"
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(horizontal = 16.scaled, vertical = 8.vScaled),
        verticalAlignment = Alignment.CenterVertically
    ) {
        AsyncImage(
            model = coverUrl,
            contentDescription = title,
            modifier = Modifier
                .size(48.scaled)
                .clip(RoundedCornerShape(8.scaled))
                .background(SonicTheme.colors.surface),
            contentScale = ContentScale.Crop
        )
        Spacer(modifier = Modifier.width(12.scaled))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = SonicTheme.colors.onBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 15.mTextScaled
            )
            Text(
                text = artists,
                style = MaterialTheme.typography.bodySmall,
                color = SonicTheme.colors.onBackground.copy(alpha = 0.6f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 13.mTextScaled
            )
        }
        Text(
            text = durationText,
            style = MaterialTheme.typography.bodySmall,
            color = SonicTheme.colors.onBackground.copy(alpha = 0.5f),
            fontSize = 12.mTextScaled
        )
    }
}
