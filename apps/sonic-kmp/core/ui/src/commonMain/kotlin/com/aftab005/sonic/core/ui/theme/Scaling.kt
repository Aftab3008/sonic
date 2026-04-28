package com.aftab005.sonic.core.ui.theme

import androidx.compose.runtime.Composable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class ScalingInfo(
    val shortDimension: Float,
    val longDimension: Float
) {
    val guidelineBaseWidth = 390f
    val guidelineBaseHeight = 844f

    fun scale(size: Float): Float {
        return (shortDimension / guidelineBaseWidth) * size
    }

    fun verticalScale(size: Float): Float {
        return (longDimension / guidelineBaseHeight) * size
    }

    fun moderateScale(size: Float, factor: Float = 0.5f): Float {
        return size + (scale(size) - size) * factor
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
    @Composable get() = LocalScaling.current.moderateScale(this.toFloat()).sp

val Float.scaled: Dp
    @Composable get() = LocalScaling.current.scale(this).dp

val Float.vScaled: Dp
    @Composable get() = LocalScaling.current.verticalScale(this).dp

val Float.mScaled: Dp
    @Composable get() = LocalScaling.current.moderateScale(this).dp

val Float.mTextScaled: TextUnit
    @Composable get() = LocalScaling.current.moderateScale(this).sp
