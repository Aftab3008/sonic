package com.aftab005.sonic.features.home

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import com.aftab005.sonic.features.home.ui.components.*
import kotlinx.coroutines.delay

@Composable
fun HomeScreen(
    homeViewModel: HomeViewModel,
    authViewModel: AuthViewModel,
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit = {},
) {
    var showContent by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(200)
        showContent = true
    }

    Box(Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
        if (!showContent) {
            HomeScreenPlaceholder()
        }

        AnimatedVisibility(
            visible = showContent,
            enter = fadeIn(tween(300))
        ) {
            HomeScreenContent(
                homeViewModel = homeViewModel,
                authViewModel = authViewModel,
                onNavigateToAlbum = onNavigateToAlbum
            )
        }
    }
}