package com.aftab005.sonic.features.album.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Shuffle
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun AlbumDetailControls(
    onPlayAll: () -> Unit,
    onShuffle: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = SonicTheme.dimensions.screenPadding)
            .padding(bottom = 20.vScaled),
        horizontalArrangement = Arrangement.spacedBy(16.scaled),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            modifier = Modifier
                .weight(1f)
                .height(56.vScaled)
                .clip(RoundedCornerShape(28.scaled))
                .background(
                    Brush.horizontalGradient(
                        listOf(SonicTheme.colors.primary, SonicTheme.colors.primaryContainer)
                    )
                )
                .clickable { onPlayAll() },
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center,
        ) {
            Icon(
                imageVector = Icons.Default.PlayArrow,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.scaled),
            )
            Spacer(modifier = Modifier.width(8.scaled))
            Text(
                text = "Play",
                color = Color.White,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 16.mTextScaled,
                letterSpacing = 0.5.sp
            )
        }
        Box(
            modifier = Modifier
                .size(56.scaled)
                .clip(CircleShape)
                .background(SonicTheme.colors.surfaceContainer)
                .border(
                    width = 1.scaled,
                    color = SonicTheme.colors.outlineVariant.copy(alpha = 0.2f),
                    shape = CircleShape,
                )
                .clickable { onShuffle() },
            contentAlignment = Alignment.Center,
        ) {
            Icon(
                imageVector = Icons.Default.Shuffle,
                contentDescription = "Shuffle",
                tint = SonicTheme.colors.onSurface,
                modifier = Modifier.size(22.scaled),
            )
        }
    }
}
