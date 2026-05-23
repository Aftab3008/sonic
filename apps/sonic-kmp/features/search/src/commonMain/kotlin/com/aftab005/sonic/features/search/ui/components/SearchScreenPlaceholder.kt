package com.aftab005.sonic.features.search.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.vScaled


@Composable
fun SearchScreenPlaceholder() {
    val isExpanded = SonicTheme.dimensions.gridColumns > 2

    val gradientBrush = rememberSearchGradient()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(if (isExpanded) 300.vScaled else 400.vScaled)
                .background(gradientBrush),
        )
    }
}

@Composable
fun rememberSearchGradient(): Brush {
    val primaryColor = SonicTheme.colors.primary
    val bgColor      = SonicTheme.colors.background
    return remember(primaryColor, bgColor) {
        Brush.verticalGradient(
            colors = listOf(
                primaryColor.copy(alpha = 0.15f),
                bgColor,
            )
        )
    }
}