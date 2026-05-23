package com.aftab005.sonic.features.player.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.*

/**
 * Track metadata row: title, artist, and favorite button.
 * Mirrors PlayerMetadata.tsx:
 *   - Title: 30sp bold, centered
 *   - Artist: 17sp, 0.8 alpha, centered
 *   - Heart button: absolutely positioned right
 */
@Composable
fun PlayerMetadata(
    title: String?,
    artist: String?,
    onLike: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxWidth()
            .heightIn(min = 64.vScaled),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(horizontal = 48.mScaled)
        ) {
            Text(
                text = title ?: "Unknown Track",
                color = SonicTheme.colors.onSurface,
                fontSize = 28.mTextScaled, 
                fontWeight = FontWeight.Black,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center,
                letterSpacing = (-0.5).sp
            )

            Spacer(modifier = Modifier.height(SonicTheme.dimensions.cardSpacing / 4))

            Text(
                text = artist ?: "Unknown Artist",
                color = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.8f),
                fontSize = 16.mTextScaled,
                fontWeight = FontWeight.SemiBold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                textAlign = TextAlign.Center
            )
        }

        // Favorite button — positioned absolute right
        Box(
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .padding(end = 4.mScaled)
                .clickable { onLike() }
        ) {
            Icon(
                imageVector = Icons.Outlined.FavoriteBorder,
                contentDescription = "Like",
                tint = SonicTheme.colors.onSurface,
                modifier = Modifier.size(24.scaled) // Standard scaling
            )
        }
    }
}
