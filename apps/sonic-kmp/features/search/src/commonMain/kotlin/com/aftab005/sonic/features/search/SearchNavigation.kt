package com.aftab005.sonic.features.search

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.searchGraph(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
) {
    navigation<SonicRoute.SearchGraph>(startDestination = SonicRoute.Search::class) {
        composable<SonicRoute.Search> {
            SearchScreen(onNavigateToAlbum = onNavigateToAlbum)
        }
    }
}


