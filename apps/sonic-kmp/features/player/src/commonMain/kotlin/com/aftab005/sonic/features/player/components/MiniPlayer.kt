package com.aftab005.sonic.features.player.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.player.model.PlayerTrack
import com.aftab005.sonic.core.ui.theme.*

/**
 * Compact mini player bar rendered above the tab bar.
 * Mirrors MiniPlayer.tsx pixel-perfectly:
 *   - Position: absolute bottom, overlaying tab bar
 *   - Container: rounded top corners (28dp), rgba(16,16,24,0.95) bg, 0.08 alpha white border
 *   - Content: circular artwork (48dp, vinyl-hole center dot), title+artist, heart, play/pause (40dp circle)
 *   - Progress: 2dp thin bar at top, primary color fill
 */
@Composable
fun MiniPlayer(
    track: PlayerTrack,
    isPlaying: Boolean,
    isBuffering: Boolean,
    positionSec: Float,
    durationSec: Float,
    onPress: () -> Unit,
    onPlayPause: () -> Unit,
    onLike: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    val progressFraction = if (durationSec > 0f) (positionSec / durationSec).coerceIn(0f, 1f) else 0f

    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(topStart = 28.mScaled, topEnd = 28.mScaled))
            .border(
                width = 1.dp,
                color = Color.White.copy(alpha = 0.08f),
                shape = RoundedCornerShape(topStart = 28.mScaled, topEnd = 28.mScaled)
            )
            .shadow(
                elevation = 10.dp,
                shape = RoundedCornerShape(topStart = 28.mScaled, topEnd = 28.mScaled),
                ambientColor = SonicTheme.colors.primaryContainer,
                spotColor = SonicTheme.colors.primaryContainer
            )
            .background(Color(0xF2101018)) 
            .clickable { onPress() }
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(2.vScaled)
                .align(Alignment.TopStart)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.White.copy(alpha = 0.1f))
            )
            Box(
                modifier = Modifier
                    .fillMaxHeight()
                    .fillMaxWidth(progressFraction)
                    .background(SonicTheme.colors.primary)
            )
        }

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 68.vScaled) 
                .padding(horizontal = SonicTheme.dimensions.screenPadding)
                .padding(top = 10.vScaled, bottom = 102.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.scaled)
                    .clip(CircleShape)
                    .background(SonicTheme.colors.surfaceContainer),
                contentAlignment = Alignment.Center
            ) {
                AsyncImage(
                    model = track.artworkUrl,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize().clip(CircleShape)
                )
                Box(
                    modifier = Modifier
                        .size(12.scaled)
                        .clip(CircleShape)
                        .background(SonicTheme.colors.surfaceContainerLowest)
                        .border(1.5.dp, SonicTheme.colors.surfaceBright, CircleShape)
                )
            }

            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 14.mScaled),
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = track.title,
                    color = Color.White,
                    fontSize = 15.mTextScaled,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(2.mScaled))
                Text(
                    text = track.artist,
                    color = Color.White.copy(alpha = 0.6f),
                    fontSize = 13.mTextScaled,
                    fontWeight = FontWeight.Medium,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }

            // Like Button
            Box(
                modifier = Modifier
                    .padding(end = 4.mScaled)
                    .size(40.scaled)
                    .clickable { onLike() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Outlined.FavoriteBorder,
                    contentDescription = "Like",
                    tint = Color.White.copy(alpha = 0.8f),
                    modifier = Modifier.size(22.scaled)
                )
            }

            Box(
                modifier = Modifier
                    .size(40.scaled)
                    .clip(CircleShape)
                    .background(SonicTheme.colors.primary)
                    .clickable { onPlayPause() },
                contentAlignment = Alignment.Center
            ) {
                if (isBuffering) {
                    CircularProgressIndicator(
                        color = SonicTheme.colors.onPrimary,
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp
                    )
                } else {
                    Icon(
                        imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = if (isPlaying) "Pause" else "Play",
                        tint = SonicTheme.colors.onPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}
