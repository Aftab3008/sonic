package com.aftab005.sonic.core.ui.theme

import androidx.compose.material3.windowsizeclass.WindowSizeClass
import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.math.ln

data class ScalingInfo(
    val widthDp: Float,
    val heightDp: Float,
    val windowSizeClass: WindowSizeClass
) {
    private val guidelineBaseWidth = 390f
    private val guidelineBaseHeight = 844f

    val scaleFactor: Float = run {
        val rawRatio = minOf(widthDp, heightDp) / guidelineBaseWidth
        if (rawRatio > 1.0f) {
            (1.0f + ln(rawRatio) * 0.5f).coerceIn(1.0f, 1.15f)
        } else {
            rawRatio.coerceIn(0.85f, 1.0f)
        }
    }

    val vScaleFactor: Float = (maxOf(widthDp, heightDp) / guidelineBaseHeight).coerceIn(0.85f, 1.25f)

    fun scale(size: Float): Float = size * scaleFactor

    fun verticalScale(size: Float): Float = size * vScaleFactor

    /**
     * Moderate scale for small elements to avoid over-scaling.
     */
    fun moderateScale(size: Float, factor: Float = 0.5f): Float {
        return size + (scale(size) - size) * factor
    }

    /**
     * Specialized text scaling that is even more conservative.
     * This ensures fonts grow even slower than layout elements on large screens.
     */
    fun moderateTextScale(size: Float, factor: Float = 0.35f): Float {
        val textFactor = if (scaleFactor > 1.0f) {
            1.0f + (scaleFactor - 1.0f) * factor
        } else {
            scaleFactor
        }
        return size * textFactor
    }
}

val LocalScaling = staticCompositionLocalOf<ScalingInfo> {
    error("No ScalingInfo provided")
}

val Int.scaled: Dp
    @Composable get() = LocalScaling.current.scale(this.toFloat()).dp

val Int.vScaled: Dp
    @Composable get() = LocalScaling.current.verticalScale(this.toFloat()).dp

val Int.mScaled: Dp
    @Composable get() = LocalScaling.current.moderateScale(this.toFloat()).dp

val Int.mTextScaled: TextUnit
    @Composable get() = LocalScaling.current.moderateTextScale(this.toFloat()).sp

val Float.scaled: Dp
    @Composable get() = LocalScaling.current.scale(this).dp

val Float.vScaled: Dp
    @Composable get() = LocalScaling.current.verticalScale(this).dp

val Float.mScaled: Dp
    @Composable get() = LocalScaling.current.moderateScale(this).dp

val Float.mTextScaled: TextUnit
    @Composable get() = LocalScaling.current.moderateTextScale(this).sp

val Double.scaled: Dp
    @Composable get() = LocalScaling.current.scale(this.toFloat()).dp

val Double.vScaled: Dp
    @Composable get() = LocalScaling.current.verticalScale(this.toFloat()).dp

val Double.mScaled: Dp
    @Composable get() = LocalScaling.current.moderateScale(this.toFloat()).dp

val Double.mTextScaled: TextUnit
    @Composable get() = LocalScaling.current.moderateTextScale(this.toFloat()).sp
