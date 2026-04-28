package com.aftab005.sonic.features.discovery

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.ui.theme.SonicTheme

@Composable
fun DiscoveryScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = "Discovery Feature",
            color = SonicTheme.colors.onBackground
        )
    }
}
