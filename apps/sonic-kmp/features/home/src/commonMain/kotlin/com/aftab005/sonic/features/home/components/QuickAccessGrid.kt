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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled

@Composable
fun QuickAccessGrid(
    tracks: List<Track>,
    onTrackPress: (Track) -> Unit,
    modifier: Modifier = Modifier
) {
    val columns = SonicTheme.dimensions.gridColumns
    val displayTracks = tracks.take(columns * 3) // Show up to 3 rows
    
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
                        onClick = { onTrackPress(track) },
                        modifier = Modifier.weight(1f)
                    )
                }
                // Fill remaining space if row is not full
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
    Row(
        modifier = modifier
            .heightIn(min = 56.scaled)
            .clip(RoundedCornerShape(8.dp))
            .background(Color.White.copy(alpha = 0.05f))
            .border(
                width = 1.dp,
                color = Color.White.copy(alpha = 0.08f),
                shape = RoundedCornerShape(8.dp)
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
                model = track.coverImageUrl?.takeIf { it.isNotBlank() } ?: track.album?.coverImageUrl,
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
        
        Text(
            text = track.overrideTitle?.takeIf { it.isNotBlank() } ?: track.recording.title,
            color = SonicTheme.colors.onSurface,
            fontSize = 12.mTextScaled,
            fontWeight = FontWeight.Bold,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            lineHeight = 15.sp,
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.scaled)
        )
    }
}
