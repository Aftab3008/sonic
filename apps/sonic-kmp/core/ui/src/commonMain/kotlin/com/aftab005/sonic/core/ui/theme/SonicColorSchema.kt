package com.aftab005.sonic.core.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.windowsizeclass.ExperimentalMaterial3WindowSizeClassApi
import androidx.compose.material3.windowsizeclass.WindowSizeClass
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpSize

@Immutable
data class SonicColorSchema(
    val background: Color,
    val surface: Color,
    val surfaceDim: Color,
    val surfaceBright: Color,
    val surfaceContainer: Color,
    val surfaceContainerLow: Color,
    val surfaceContainerLowest: Color,
    val surfaceContainerHigh: Color,
    val surfaceContainerHighest: Color,
    val surfaceVariant: Color,
    val primary: Color,
    val primaryContainer: Color,
    val onPrimary: Color,
    val onPrimaryContainer: Color,
    val secondary: Color,
    val secondaryContainer: Color,
    val onSecondary: Color,
    val onSecondaryContainer: Color,
    val tertiary: Color,
    val tertiaryContainer: Color,
    val onTertiary: Color,
    val onTertiaryContainer: Color,
    val onSurface: Color,
    val onSurfaceVariant: Color,
    val onBackground: Color,
    val outline: Color,
    val outlineVariant: Color,
    val error: Color,
    val errorContainer: Color,
    val onError: Color,
    val onErrorContainer: Color,
    val success: Color,
    val warning: Color,
    val info: Color
)

val LocalSonicColors = staticCompositionLocalOf<SonicColorSchema> {
    error("No SonicColorSchema provided")
}

val defaultSonicColors = SonicColorSchema(
    background = background,
    surface = surface,
    surfaceDim = surfaceDim,
    surfaceBright = surfaceBright,
    surfaceContainer = surfaceContainer,
    surfaceContainerLow = surfaceContainerLow,
    surfaceContainerLowest = surfaceContainerLowest,
    surfaceContainerHigh = surfaceContainerHigh,
    surfaceContainerHighest = surfaceContainerHighest,
    surfaceVariant = surfaceVariant,
    primary = primary,
    primaryContainer = primaryContainer,
    onPrimary = onPrimary,
    onPrimaryContainer = onPrimaryContainer,
    secondary = secondary,
    secondaryContainer = secondaryContainer,
    onSecondary = onSecondary,
    onSecondaryContainer = onSecondaryContainer,
    tertiary = tertiary,
    tertiaryContainer = tertiaryContainer,
    onTertiary = onTertiary,
    onTertiaryContainer = onTertiaryContainer,
    onSurface = onSurface,
    onSurfaceVariant = onSurfaceVariant,
    onBackground = onBackground,
    outline = outline,
    outlineVariant = outlineVariant,
    error = error,
    errorContainer = errorContainer,
    onError = onError,
    onErrorContainer = onErrorContainer,
    success = success,
    warning = warning,
    info = info
)

private val DarkColorScheme = darkColorScheme(
    primary = primary,
    secondary = secondary,
    tertiary = tertiary,
    background = background,
    surface = surface,
    error = error,
    onPrimary = onPrimary,
    onSecondary = onSecondary,
    onTertiary = onTertiary,
    onBackground = onBackground,
    onSurface = onSurface,
    onError = onError
)

@OptIn(ExperimentalMaterial3WindowSizeClassApi::class)
@Composable
fun SonicTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    androidx.compose.foundation.layout.BoxWithConstraints {
        val widthDp = maxWidth
        val heightDp = maxHeight

        val windowSizeClass = WindowSizeClass.calculateFromSize(DpSize(widthDp, heightDp))
        val adaptiveDimensions = getAdaptiveDimensions(windowSizeClass.widthSizeClass)

        val scalingInfo = ScalingInfo(
            widthDp = widthDp.value,
            heightDp = heightDp.value,
            windowSizeClass = windowSizeClass
        )

        CompositionLocalProvider(
            LocalSonicColors provides defaultSonicColors,
            LocalScaling provides scalingInfo,
            LocalAdaptiveDimensions provides adaptiveDimensions
        ) {
            MaterialTheme(
                colorScheme = DarkColorScheme,
                content = content
            )
        }
    }
}

object SonicTheme {
    val colors: SonicColorSchema
        @Composable
        get() = LocalSonicColors.current

    val dimensions: AdaptiveDimensions
        @Composable
        get() = LocalAdaptiveDimensions.current
}
