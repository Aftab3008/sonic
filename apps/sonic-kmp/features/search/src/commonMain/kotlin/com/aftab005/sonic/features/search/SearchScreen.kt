package com.aftab005.sonic.features.search

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.search.presentation.SearchViewModel
import com.aftab005.sonic.features.search.ui.components.SearchScreenContent
import com.aftab005.sonic.features.search.ui.components.SearchScreenPlaceholder
import kotlinx.coroutines.delay

@Composable
fun SearchScreen(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit = {},
    searchViewModel: SearchViewModel,
    authViewModel: AuthViewModel,
) {
    var showContent by remember { mutableStateOf(false) }

    LaunchedEffect(Unit) {
        delay(200)
        showContent = true
    }

    Box(Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
        if (!showContent) {
            SearchScreenPlaceholder()
        }

        AnimatedVisibility(
            visible = showContent,
            enter = fadeIn(tween(300))
        ) {
            SearchScreenContent(
                onNavigateToAlbum = onNavigateToAlbum,
                searchViewModel = searchViewModel,
                authViewModel = authViewModel,
            )
        }
    }
}
