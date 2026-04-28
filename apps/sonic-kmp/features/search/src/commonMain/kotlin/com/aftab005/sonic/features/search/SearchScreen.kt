package com.aftab005.sonic.features.search

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.ui.theme.SonicTheme

@Composable
fun SearchScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Search Feature",
            color = SonicTheme.colors.onBackground
        )
    }
}
