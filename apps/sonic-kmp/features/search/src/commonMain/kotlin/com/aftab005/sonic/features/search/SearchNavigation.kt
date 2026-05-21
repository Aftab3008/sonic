package com.aftab005.sonic.features.search

import androidx.navigation.NavGraphBuilder
import androidx.navigation.NavHostController
import androidx.navigation.compose.composable
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.searchGraph(navController: NavHostController) {
    composable<SonicRoute.Search> {
        SearchScreen(
            onNavigateToAlbum = { route -> navController.navigate(route) },
        )
    }
}

