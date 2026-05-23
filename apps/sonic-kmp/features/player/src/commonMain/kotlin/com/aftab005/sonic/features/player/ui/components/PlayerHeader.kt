package com.aftab005.sonic.features.player.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExpandMore
import androidx.compose.material.icons.filled.MoreHoriz
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import com.aftab005.sonic.core.ui.theme.*

/**
 * Player header island bar.
 * Mirrors UnifiedPlayerHeader.tsx:
 *   - Rounded pill (22dp corners), subtle white border + translucent surface bg
 *   - Left: chevron-down (back), Center: album/title text, Right: ellipsis (options)
 *
 * Volume toggle is deferred to a later phase.
 */
@Composable
fun PlayerHeader(
    title: String?,
    topPaddingDp: Float,
    onBack: () -> Unit,
    onOptionsPress: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(top = topPaddingDp.dp + 12.dp)
            .padding(horizontal = 32.mScaled)
            .zIndex(100f),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 44.vScaled)
                .clip(RoundedCornerShape(22.mScaled))
                .border(
                    width = 1.dp,
                    color = Color.White.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(22.mScaled)
                )
                .background(SonicTheme.colors.surface.copy(alpha = 0.4f))
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(min = 44.vScaled)
                    .padding(horizontal = 8.mScaled, vertical = 2.vScaled),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Box(
                    modifier = Modifier
                        .size(40.mScaled)
                        .clip(RoundedCornerShape(20.mScaled))
                        .clickable { onBack() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.ExpandMore,
                        contentDescription = "Close",
                        tint = SonicTheme.colors.onSurface,
                        modifier = Modifier.size(22.mScaled)
                    )
                }

                Text(
                    text = (title ?: "Sonic Player").uppercase(),
                    color = SonicTheme.colors.onSurfaceVariant,
                    fontSize = 11.mTextScaled,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = 1.5.mTextScaled,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.weight(1f)
                )

                Box(
                    modifier = Modifier
                        .size(40.mScaled)
                        .clip(RoundedCornerShape(20.mScaled))
                        .clickable { onOptionsPress() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.MoreHoriz,
                        contentDescription = "Options",
                        tint = SonicTheme.colors.onSurface,
                        modifier = Modifier.size(18.mScaled)
                    )
                }
            }
        }
    }
}

