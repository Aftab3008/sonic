package com.aftab005.sonic.features.player.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.SkipNext
import androidx.compose.material.icons.filled.SkipPrevious
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.theme.*

/**
 * Main playback controls: skip previous, play/pause, and skip next.
 * Mirrors PlayerPlaybackControls.tsx:
 *   - Layout: horizontal row, centered
 *   - Play/Pause: 80dp circular button, primary background, shadow
 *   - Skip Buttons: 36dp icons, onSurface color
 */
@Composable
fun PlayerPlaybackControls(
    isPlaying: Boolean,
    isBuffering: Boolean,
    onPlayPause: () -> Unit,
    onSkipNext: () -> Unit,
    onSkipPrevious: () -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.Center,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .padding(horizontal = 20.mScaled)
                .clickable { onSkipPrevious() }
        ) {
            Icon(
                imageVector = Icons.Default.SkipPrevious,
                contentDescription = "Skip Previous",
                tint = SonicTheme.colors.onSurface,
                modifier = Modifier.size(36.mScaled)
            )
        }

        Box(
            modifier = Modifier
                .size(72.scaled) // Slightly reduced from 80 to fit zoomed screens better
                .clip(CircleShape)
                .background(SonicTheme.colors.primary)
                .shadow(
                    elevation = 8.dp,
                    shape = CircleShape,
                    ambientColor = SonicTheme.colors.primary,
                    spotColor = SonicTheme.colors.primary
                )
                .clickable { onPlayPause() },
            contentAlignment = Alignment.Center
        ) {
            if (isBuffering) {
                CircularProgressIndicator(
                    color = SonicTheme.colors.onPrimary,
                    modifier = Modifier.size(28.scaled),
                    strokeWidth = 3.dp
                )
            } else {
                Icon(
                    imageVector = if (isPlaying) Icons.Default.Pause else Icons.Default.PlayArrow,
                    contentDescription = if (isPlaying) "Pause" else "Play",
                    tint = SonicTheme.colors.onPrimary,
                    modifier = Modifier.size(36.scaled)
                )
            }
        }

        Box(
            modifier = Modifier
                .padding(horizontal = 20.mScaled)
                .clickable { onSkipNext() }
        ) {
            Icon(
                imageVector = Icons.Default.SkipNext,
                contentDescription = "Skip Next",
                tint = SonicTheme.colors.onSurface,
                modifier = Modifier.size(36.mScaled)
            )
        }
    }
}
