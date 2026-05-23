package com.aftab005.sonic.features.home.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun HomeScreenPlaceholder() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
    ) {
        val isExpanded = SonicTheme.dimensions.gridColumns > 2
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(if (isExpanded) 300.vScaled else 400.vScaled)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            SonicTheme.colors.primary.copy(alpha = 0.15f),
                            SonicTheme.colors.background,
                        )
                    )
                )
        )
    }
}