package com.aftab005.sonic.features.album.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun AlbumDetailSkeleton(modifier: Modifier = Modifier) {
    val shimmerColors = listOf(
        SonicTheme.colors.surfaceContainer,
        SonicTheme.colors.surfaceContainer.copy(alpha = 0.4f),
        SonicTheme.colors.surfaceContainer,
    )
    val transition = rememberInfiniteTransition(label = "shimmer")
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1200f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "shimmer_translate",
    )
    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset(translateAnim - 300f, 0f),
        end = Offset(translateAnim, 0f),
    )

    Column(modifier = modifier.fillMaxWidth()) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(380.vScaled)
                .background(brush),
        )

        Spacer(modifier = Modifier.height(16.vScaled))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = SonicTheme.dimensions.screenPadding),
            horizontalArrangement = Arrangement.spacedBy(16.scaled),
        ) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(56.vScaled)
                    .clip(RoundedCornerShape(28.scaled))
                    .background(brush),
            )
            Box(
                modifier = Modifier
                    .size(56.scaled)
                    .clip(CircleShape)
                    .background(brush),
            )
        }

        Spacer(modifier = Modifier.height(12.vScaled))

        repeat(6) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = SonicTheme.dimensions.screenPadding, vertical = 12.vScaled),
                horizontalArrangement = Arrangement.spacedBy(16.scaled),
            ) {
                Box(modifier = Modifier.size(24.scaled).background(brush, RoundedCornerShape(4.scaled)))
                Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(8.scaled)) {
                    Box(modifier = Modifier.fillMaxWidth(0.75f).height(16.vScaled).background(brush, RoundedCornerShape(4.scaled)))
                    Box(modifier = Modifier.fillMaxWidth(0.5f).height(13.vScaled).background(brush, RoundedCornerShape(4.scaled)))
                }
                Box(modifier = Modifier.width(40.scaled).height(12.vScaled).background(brush, RoundedCornerShape(4.scaled)))
            }
        }
    }
}
