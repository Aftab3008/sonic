package com.aftab005.sonic.features.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun QuickAccessGrid(
    tracks: List<Track>,
    modifier: Modifier = Modifier,
    viewModel: HomeViewModel = koinViewModel()
) {
    val columns = SonicTheme.dimensions.gridColumns
    val displayTracks = tracks.take(columns * 3)
    
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = SonicTheme.dimensions.screenPadding),
        verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing)
    ) {
        displayTracks.chunked(columns).forEach { rowTracks ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing)
            ) {
                rowTracks.forEach { track ->
                    QuickAccessCard(
                        track = track,
                        onClick = { viewModel.playTrack(track, displayTracks) },
                        modifier = Modifier.weight(1f)
                    )
                }
                repeat(columns - rowTracks.size) {
                    Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun QuickAccessCard(
    track: Track,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val trackTitle = track.overrideTitle
        ?.takeIf { it.isNotBlank() }
        ?: track.recording.title

    val trackArtist = track.recording.artists
        ?.joinToString(", ") { it.artist.name }
        ?.takeIf { it.isNotBlank() }
        ?: "Unknown Artist"

    val trackImageUrl = track.coverImageUrl
        ?.takeIf { it.isNotBlank() }
        ?: track.album?.coverImageUrl

    Row(
        modifier = modifier
            .height(56.scaled)
            .clip(RoundedCornerShape(8.scaled))
            .background(Color.White.copy(alpha = 0.05f))
            .border(
                width = 1.scaled,
                color = Color.White.copy(alpha = 0.08f),
                shape = RoundedCornerShape(8.scaled)
            )
            .clickable { onClick() },
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(56.scaled)
                .background(SonicTheme.colors.surfaceContainerHighest)
        ) {
            AsyncImage(
                model = trackImageUrl,
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }

        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.scaled),
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = trackTitle,
                color = SonicTheme.colors.onSurface,
                fontSize = 13.mTextScaled,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            
           Spacer(modifier = Modifier.height(1.scaled))
            
            Text(
                text = trackArtist,
                color = SonicTheme.colors.onSurface.copy(alpha = 0.6f),
                fontSize = 11.mTextScaled,
                fontWeight = FontWeight.Medium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
