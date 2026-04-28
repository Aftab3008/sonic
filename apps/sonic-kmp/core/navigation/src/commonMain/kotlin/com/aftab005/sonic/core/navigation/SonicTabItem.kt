package com.aftab005.sonic.core.navigation

import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

data class SonicTabItem(
    val index: Int,
    val title: String,
    val route: SonicRoute,
    val icon: @Composable (size: Dp, color: Color, focused: Boolean, modifier: Modifier) -> Unit = { _, _, _, _ -> }
)
