package com.aftab005.sonic.features.discovery

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.discovery.presentation.DiscoveryViewModel
import com.aftab005.sonic.features.discovery.ui.components.DiscoveryScreenContent
import com.aftab005.sonic.features.discovery.ui.components.DiscoveryScreenPlaceholder
import kotlinx.coroutines.delay

@Composable
fun DiscoveryScreen(
    discoveryViewModel: DiscoveryViewModel,
    authViewModel: AuthViewModel,
    onGenreClick: (slug: String, name: String) -> Unit,
) {
    var showContent by remember {
        mutableStateOf(false)
    }

    LaunchedEffect(Unit) {
        delay(200)
        showContent = true
    }

    Box(Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
        if (!showContent) {
            DiscoveryScreenPlaceholder()
        }

        AnimatedVisibility(
            visible = showContent,
            enter = fadeIn(tween(300))
        ) {
            DiscoveryScreenContent(
                discoveryViewModel = discoveryViewModel,
                authViewModel = authViewModel,
                onGenreClick = onGenreClick
            )
        }
    }
}
