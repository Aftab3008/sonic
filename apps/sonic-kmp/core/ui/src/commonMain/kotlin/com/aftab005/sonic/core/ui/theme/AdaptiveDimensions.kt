package com.aftab005.sonic.core.ui.theme

import androidx.compose.material3.windowsizeclass.WindowWidthSizeClass
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Immutable
data class AdaptiveDimensions(
    val gridColumns: Int,
    val screenPadding: Dp,
    val maxContentWidth: Dp,
    val cardSpacing: Dp,
    val sectionSpacing: Dp,
    val topContentPadding: Dp
)

val CompactDimensions = AdaptiveDimensions(
    gridColumns = 2,
    screenPadding = 16.dp,
    maxContentWidth = Dp.Unspecified,
    cardSpacing = 12.dp,
    sectionSpacing = 28.dp,
    topContentPadding = 100.dp
)

val MediumDimensions = AdaptiveDimensions(
    gridColumns = 3,
    screenPadding = 24.dp,
    maxContentWidth = 600.dp,
    cardSpacing = 16.dp,
    sectionSpacing = 36.dp,
    topContentPadding = 110.dp
)

val ExpandedDimensions = AdaptiveDimensions(
    gridColumns = 4,
    screenPadding = 32.dp,
    maxContentWidth = 840.dp,
    cardSpacing = 20.dp,
    sectionSpacing = 44.dp,
    topContentPadding = 120.dp
)

val LocalAdaptiveDimensions = staticCompositionLocalOf { CompactDimensions }

@Composable
fun getAdaptiveDimensions(widthSizeClass: WindowWidthSizeClass): AdaptiveDimensions {
    return when (widthSizeClass) {
        WindowWidthSizeClass.Compact -> CompactDimensions
        WindowWidthSizeClass.Medium -> MediumDimensions
        WindowWidthSizeClass.Expanded -> ExpandedDimensions
        else -> CompactDimensions
    }
}
