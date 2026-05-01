package com.aftab005.sonic.features.home.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun HomeSkeleton() {
    val transition = rememberInfiniteTransition()
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        )
    )

    val shimmerColors = listOf(
        Color.White.copy(alpha = 0.05f),
        Color.White.copy(alpha = 0.12f),
        Color.White.copy(alpha = 0.05f),
    )

    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset.Zero,
        end = Offset(x = translateAnim, y = translateAnim)
    )

    Column(
        modifier = Modifier
            .fillMaxWidth()
    ) {
        // Quick Access Grid Skeleton
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.scaled),
            verticalArrangement = Arrangement.spacedBy(12.scaled)
        ) {
            repeat(3) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.scaled)
                ) {
                    repeat(2) {
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(56.scaled)
                                .clip(RoundedCornerShape(8.dp))
                                .background(brush)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(32.vScaled))

        // Featured Showcase Skeleton
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.scaled)
                .aspectRatio(0.8f)
                .clip(RoundedCornerShape(24.dp))
                .background(brush)
        )

        Spacer(modifier = Modifier.height(32.vScaled))

        // Recently Played Skeleton
        Column(modifier = Modifier.fillMaxWidth()) {
            Box(
                modifier = Modifier
                    .padding(horizontal = 24.scaled)
                    .width(150.scaled)
                    .height(24.scaled)
                    .clip(RoundedCornerShape(4.dp))
                    .background(brush)
            )
            
            Spacer(modifier = Modifier.height(16.vScaled))

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = 24.scaled),
                horizontalArrangement = Arrangement.spacedBy(16.scaled)
            ) {
                repeat(4) {
                    Column(modifier = Modifier.width(120.scaled)) {
                        Box(
                            modifier = Modifier
                                .size(120.scaled)
                                .clip(RoundedCornerShape(12.dp))
                                .background(brush)
                        )
                        Spacer(modifier = Modifier.height(8.vScaled))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(14.scaled)
                                .clip(RoundedCornerShape(4.dp))
                                .background(brush)
                        )
                        Spacer(modifier = Modifier.height(4.vScaled))
                        Box(
                            modifier = Modifier
                                .width(80.scaled)
                                .height(12.scaled)
                                .clip(RoundedCornerShape(4.dp))
                                .background(brush)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(120.vScaled))
    }
}
