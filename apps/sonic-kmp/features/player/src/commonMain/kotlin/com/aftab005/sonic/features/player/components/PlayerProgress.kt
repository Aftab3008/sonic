package com.aftab005.sonic.features.player.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import kotlinx.coroutines.delay
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import com.aftab005.sonic.core.ui.theme.*

/**
 * Seek slider + time labels.
 * Mirrors PlayerProgress.tsx:
 *   - Gradient track (primaryContainer → primary)
 *   - 14dp circular thumb with shadow
 *   - Time labels: elapsed (left) and total (right)
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlayerProgress(
    positionSec: Float,
    durationSec: Float,
    onSeek: (Float) -> Unit,
    modifier: Modifier = Modifier
) {
    var isSliding by remember { mutableStateOf(false) }
    var slideValue by remember { mutableFloatStateOf(0f) }
    
    // Internal state to track when we just finished a seek to prevent "snap back"
    var isSeekingInternal by remember { mutableStateOf(false) }
    var lastSeekValue by remember { mutableFloatStateOf(0f) }

    // Reset isSeekingInternal when the player's position finally catches up or changes significantly
    LaunchedEffect(positionSec) {
        if (isSeekingInternal) {
            val diff = kotlin.math.abs(positionSec - lastSeekValue)
            if (diff < 1.0f) {
                isSeekingInternal = false
            }
        }
    }

    LaunchedEffect(isSeekingInternal) {
        if (isSeekingInternal) {
            delay(1500) // If after 1.5s we haven't caught up, just reset
            isSeekingInternal = false
        }
    }

    val displayPosition = when {
        isSliding -> slideValue
        isSeekingInternal -> lastSeekValue
        else -> positionSec
    }
    
    val sliderMax = if (durationSec > 0f) durationSec else 1f

    Column(modifier = modifier.fillMaxWidth()) {
        Slider(
            value = displayPosition.coerceIn(0f, sliderMax),
            onValueChange = { value ->
                isSliding = true
                slideValue = value
            },
            onValueChangeFinished = {
                onSeek(slideValue)
                lastSeekValue = slideValue
                isSeekingInternal = true
                isSliding = false
            },
            valueRange = 0f..sliderMax,
            colors = SliderDefaults.colors(
                thumbColor = SonicTheme.colors.primary,
                activeTrackColor = SonicTheme.colors.primary,
                inactiveTrackColor = SonicTheme.colors.onSurface.copy(alpha = 0.1f)
            ),
            thumb = {
                Box(
                    modifier = Modifier
                        .size(14.mScaled)
                        .clip(CircleShape)
                        .background(SonicTheme.colors.primary)
                )
            },
            track = { sliderState ->
                val fraction = if (sliderMax > 0f) displayPosition / sliderMax else 0f
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(6.vScaled)
                        .clip(RoundedCornerShape(4.mScaled))
                        .background(SonicTheme.colors.onSurface.copy(alpha = 0.1f))
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(fraction.coerceIn(0f, 1f))
                            .fillMaxHeight()
                            .clip(RoundedCornerShape(4.mScaled))
                            .background(
                                Brush.horizontalGradient(
                                    colors = listOf(
                                        SonicTheme.colors.primaryContainer,
                                        SonicTheme.colors.primary
                                    )
                                )
                            )
                    )
                }
            }
        )
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.vScaled),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = formatTime(displayPosition),
                color = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.7f),
                fontSize = 11.mTextScaled,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = formatTime(durationSec),
                color = SonicTheme.colors.onSurfaceVariant.copy(alpha = 0.7f),
                fontSize = 11.mTextScaled,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

/**
 * Formats seconds to "m:ss" format.
 * Matches the Expo utils/utils.ts formatTime function.
 */
internal fun formatTime(seconds: Float): String {
    if (seconds.isNaN() || seconds.isInfinite() || seconds < 0f) return "0:00"
    val totalSec = seconds.toInt()
    val mins = totalSec / 60
    val secs = totalSec % 60
    return "$mins:${secs.toString().padStart(2, '0')}"
}
