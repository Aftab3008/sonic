package com.aftab005.sonic.features.player.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Lens
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
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.ui.theme.*

/**
 * Album art display for the player screen.
 * Mirrors PlayerAlbumArt.tsx:
 *   - 1:1 aspect ratio, 32dp rounded corners
 *   - 0.1 alpha white border
 *   - Shadow elevation
 *   - HI-RES badge: aperture icon + "HI-RES" text (top-right)
 */
@Composable
fun PlayerAlbumArt(
    artworkUrl: String?,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .aspectRatio(1f)
            .shadow(
                elevation = 12.dp,
                shape = RoundedCornerShape(32.mScaled),
                ambientColor = Color.Black,
                spotColor = Color.Black
            ),
        contentAlignment = Alignment.Center
    ) {
        AsyncImage(
            model = artworkUrl,
            contentDescription = "Album artwork",
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(32.mScaled))
                .border(
                    width = 1.dp,
                    color = Color.White.copy(alpha = 0.1f),
                    shape = RoundedCornerShape(32.mScaled)
                )
        )

        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 20.vScaled, end = 20.mScaled)
                .clip(RoundedCornerShape(14.mScaled))
                .background(SonicTheme.colors.surface.copy(alpha = 0.4f))
                .border(
                    width = 1.dp,
                    color = Color.White.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(14.mScaled)
                )
                .padding(horizontal = 14.mScaled, vertical = 8.vScaled)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(6.mScaled)
            ) {
                Icon(
                    imageVector = Icons.Outlined.Lens,
                    contentDescription = null,
                    tint = SonicTheme.colors.secondary,
                    modifier = Modifier.size(12.mScaled)
                )
                Text(
                    text = "HI-RES",
                    color = Color.White,
                    fontSize = 9.mTextScaled,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 2.mTextScaled
                )
            }
        }
    }
}
