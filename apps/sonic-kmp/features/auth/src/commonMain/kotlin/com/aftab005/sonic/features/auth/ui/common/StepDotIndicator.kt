package com.aftab005.sonic.features.auth.ui.common

import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.features.auth.theme.CosmicViolet
import com.aftab005.sonic.features.auth.theme.CosmicVioletLight


@Composable
fun StepDotIndicator(
    totalSteps: Int,
    currentStep: Int,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(6.mScaled),
        verticalAlignment = Alignment.CenterVertically
    ) {
        for (step in 1..totalSteps) {
            val isActive = step == currentStep
            val isDone = step < currentStep

            val targetWidth = if (isActive) 28.dp else 8.dp
            val animatedWidth by animateDpAsState(
                targetValue = targetWidth,
                animationSpec = tween(durationMillis = 300),
                label = "dot_width_$step"
            )

            val bgColor = when {
                isActive -> null // use gradient brush
                isDone -> Color(0xFF8B5CF6).copy(alpha = 0.4f)
                else -> Color.White.copy(alpha = 0.12f)
            }

            Box(
                modifier = Modifier
                    .width(animatedWidth)
                    .height(7.mScaled)
                    .clip(RoundedCornerShape(50))
                    .then(
                        if (isActive) {
                            Modifier
                                .shadow(
                                    elevation = 4.dp,
                                    shape = RoundedCornerShape(50),
                                    ambientColor = CosmicViolet,
                                    spotColor = CosmicVioletLight
                                )
                                .background(
                                    brush = Brush.horizontalGradient(
                                        colors = listOf(CosmicViolet, CosmicVioletLight)
                                    )
                                )
                        } else {
                            Modifier.background(bgColor!!)
                        }
                    )
            )
        }
    }
}
