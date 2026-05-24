package com.aftab005.sonic.features.home.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
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

    val columns = SonicTheme.dimensions.gridColumns
    val screenPadding = SonicTheme.dimensions.screenPadding
    val cardSpacing = SonicTheme.dimensions.cardSpacing
    val sectionSpacing = SonicTheme.dimensions.sectionSpacing

    Column(
        modifier = Modifier
            .fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(sectionSpacing)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = screenPadding),
            verticalArrangement = Arrangement.spacedBy(cardSpacing)
        ) {
            repeat(2) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(cardSpacing)
                ) {
                    repeat(columns) {
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(56.scaled)
                            .clip(RoundedCornerShape(8.scaled))
                            .background(brush)
                    )
                }
                }
            }
        }

        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = screenPadding)
                .aspectRatio(if (columns > 2) 1.5f else 0.8f)
                .clip(RoundedCornerShape(24.scaled))
                .background(brush)
        )

        Column(modifier = Modifier.fillMaxWidth()) {
            Box(
                modifier = Modifier
                    .padding(horizontal = screenPadding)
                    .width(150.scaled)
                    .height(24.scaled)
                    .clip(RoundedCornerShape(4.scaled))
                    .background(brush)
            )
            
            Spacer(modifier = Modifier.height(cardSpacing))

            Row(
                modifier = Modifier.fillMaxWidth().padding(horizontal = screenPadding),
                horizontalArrangement = Arrangement.spacedBy(16.scaled)
            ) {
                repeat(columns + 1) {
                    Column(modifier = Modifier.width(120.scaled)) {
                        Box(
                            modifier = Modifier
                                .size(120.scaled)
                                .clip(RoundedCornerShape(12.scaled))
                                .background(brush)
                        )
                        Spacer(modifier = Modifier.height(8.vScaled))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(14.scaled)
                                .clip(RoundedCornerShape(4.scaled))
                                .background(brush)
                        )
                        Spacer(modifier = Modifier.height(4.vScaled))
                        Box(
                            modifier = Modifier
                                .width(80.scaled)
                                .height(12.scaled)
                                .clip(RoundedCornerShape(4.scaled))
                                .background(brush)
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(120.vScaled))
    }
}