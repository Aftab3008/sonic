package com.aftab005.sonic.features.home.ui.components.content

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.ui.components.VanguardSectionHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun RecentlyPlayedSection(
    tracks: List<Track>,
    onTrackPress: (Track) -> Unit,
    onViewHistory: () -> Unit,
    modifier: Modifier = Modifier,
) {
    if (tracks.isEmpty()) return

    Column(modifier = modifier.fillMaxWidth()) {
        VanguardSectionHeader(
            title = "Recently Played",
            actionText = "View History",
            onSeeAllClick = onViewHistory,
        )

        Spacer(modifier = Modifier.height(SonicTheme.dimensions.cardSpacing))

        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = SonicTheme.dimensions.screenPadding),
            horizontalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing),
        ) {
            items(tracks, key = { it.id }) { track ->
                val onClick = remember(track.id) { { onTrackPress(track) } }
                RecentlyPlayedItem(
                    track = track,
                    onClick = onClick,
                )
            }
        }
    }
}

@Composable
private fun RecentlyPlayedItem(
    track: Track,
    onClick: () -> Unit,
) {
    val itemSize = 120.scaled

    val title = remember(track.id) {
        track.overrideTitle?.takeIf { it.isNotBlank() } ?: track.recording.title
    }
    val artist = remember(track.id) {
        track.recording.artists?.firstOrNull()?.artist?.name ?: "Artist"
    }
    val imageUrl = remember(track.id) {
        track.coverImageUrl?.takeIf { it.isNotBlank() } ?: track.album?.coverImageUrl
    }

    Column(
        modifier = Modifier
            .width(itemSize)
            .clickable(onClick = onClick),   // ✅ clickable(onClick=) avoids lambda wrapping overhead
    ) {
        Box(
            modifier = Modifier
                .size(itemSize)
                .clip(RoundedCornerShape(12.scaled)),
        ) {
            AsyncImage(
                model = imageUrl,
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
            )

            Box(
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(8.scaled)
                    .size(28.scaled)
                    .background(Color.Black.copy(alpha = 0.6f), RoundedCornerShape(8.scaled))
                    .border(0.5.scaled, Color.White.copy(alpha = 0.2f), RoundedCornerShape(8.scaled)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(16.scaled),
                )
            }
        }

        Spacer(modifier = Modifier.height(8.vScaled))

        Text(
            text = title,
            color = SonicTheme.colors.onSurface,
            fontSize = 13.mTextScaled,
            fontWeight = FontWeight.Bold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )

        Text(
            text = artist,
            color = SonicTheme.colors.onSurfaceVariant,
            fontSize = 11.mTextScaled,
            fontWeight = FontWeight.Medium,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
    }
}