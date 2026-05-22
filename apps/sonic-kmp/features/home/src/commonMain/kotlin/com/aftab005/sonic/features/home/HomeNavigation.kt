package com.aftab005.sonic.features.home

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.homeGraph(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
) {
    navigation<SonicRoute.HomeGraph>(startDestination = SonicRoute.Home::class) {
        composable<SonicRoute.Home> {
            HomeScreen(onNavigateToAlbum = onNavigateToAlbum)
        }
    }
}

