package com.aftab005.sonic.features.home

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.homeGraph(navController: NavController) {
    composable<SonicRoute.Home> {
        HomeScreen(
            onNavigateToAlbum = { card ->
                navController.navigate(SonicRoute.AlbumDetail(card.id))
            }
        )
    }
}
