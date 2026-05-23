package com.aftab005.sonic.features.album.navigation

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.album.AlbumDetailScreen
import androidx.navigation.toRoute

fun NavGraphBuilder.albumGraph(
    onBack: () -> Unit,
) {
    composable<SonicRoute.AlbumDetail> { backStackEntry ->
        val albumId = backStackEntry.toRoute<SonicRoute.AlbumDetail>().albumId
        AlbumDetailScreen(
            albumId = albumId,
            onBack = onBack,
        )
    }
}
