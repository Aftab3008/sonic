package com.aftab005.sonic.features.album.components


import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun AlbumDetailTrackRow(
    track: Track,
    trackIndex: Int,
    isPlaying: Boolean = false,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() }
            .padding(horizontal = SonicTheme.dimensions.screenPadding, vertical = 12.vScaled),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.scaled),
    ) {
        Box(
            modifier = Modifier.width(24.scaled),
            contentAlignment = Alignment.Center,
        ) {
            if (isPlaying) {
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = "Now playing",
                    tint = SonicTheme.colors.primary,
                    modifier = Modifier.size(20.scaled),
                )
            } else {
                Text(
                    text = "${track.trackNumber}",
                    color = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.6f),
                    fontSize = 14.mTextScaled,
                    fontWeight = FontWeight.Bold,
                )
            }
        }

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = track.displayTitle,
                color = if (isPlaying) SonicTheme.colors.primary else SonicTheme.colors.onSurface,
                fontSize = 16.mTextScaled,
                fontWeight = if (isPlaying) FontWeight.Bold else FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            
            val artist = track.recording.artists
                ?.joinToString(", ") { it.artist.name }
                ?.takeIf { it.isNotBlank() }
            
            if (artist != null) {
                Text(
                    text = artist,
                    color = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.7f),
                    fontSize = 13.mTextScaled,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    modifier = Modifier.padding(top = 2.vScaled),
                )
            }
        }

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.scaled)
        ) {
            val durationMs = track.recording.durationMs
            if (durationMs != null && durationMs > 0) {
                val mins = durationMs / 60_000
                val secs = (durationMs % 60_000) / 1000
                Text(
                    text = "$mins:${secs.toString().padStart(2, '0')}",
                    color = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.5f),
                    fontSize = 12.mTextScaled,
                    fontWeight = FontWeight.Normal,
                )
            }

            IconButton(
                onClick = { /* More options */ },
                modifier = Modifier.size(24.scaled)
            ) {
                Icon(
                    imageVector = Icons.Default.MoreVert,
                    contentDescription = "More",
                    tint = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.5f),
                    modifier = Modifier.size(20.scaled)
                )
            }
        }
    }
}
