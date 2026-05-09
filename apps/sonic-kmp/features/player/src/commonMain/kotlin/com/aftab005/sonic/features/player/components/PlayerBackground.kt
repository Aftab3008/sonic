package com.aftab005.sonic.features.player.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.ui.theme.SonicTheme
import androidx.compose.foundation.background

/**
 * Full-screen blurred background layer for the player screen.
 * Mirrors PlayerBackground.tsx:
 *   - Blurred artwork image (blur radius 70) at 50% opacity, oversized 120%
 *   - Gradient overlay: bgColors[0]@40%, bgColors[1]@80%, background@98%
 */
@Composable
fun PlayerBackground(
    artworkUrl: String?,
    modifier: Modifier = Modifier
) {
    Box(modifier = modifier.fillMaxSize()) {
        if (artworkUrl != null) {
            AsyncImage(
                model = artworkUrl,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxSize()
                    .blur(70.dp),
                alpha = 0.5f
            )
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colorStops = arrayOf(
                            0.0f to SonicTheme.colors.background.copy(alpha = 0.4f),
                            0.4f to SonicTheme.colors.surface.copy(alpha = 0.8f),
                            1.0f to SonicTheme.colors.background.copy(alpha = 0.98f)
                        )
                    )
                )
        )
    }
}
