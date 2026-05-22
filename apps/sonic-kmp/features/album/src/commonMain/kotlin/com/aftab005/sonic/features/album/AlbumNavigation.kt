package com.aftab005.sonic.features.album

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.toRoute
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.albumGraph(
    onBack: () -> Unit,
) {
    composable<SonicRoute.AlbumDetail> { backStackEntry ->
        val route: SonicRoute.AlbumDetail = backStackEntry.toRoute()
        AlbumDetailScreen(
            albumId = route.albumId,
            onBack = onBack,
        )
    }
}

