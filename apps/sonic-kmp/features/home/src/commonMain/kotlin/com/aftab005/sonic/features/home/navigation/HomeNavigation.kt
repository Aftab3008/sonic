package com.aftab005.sonic.features.home.navigation

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import com.aftab005.sonic.features.home.HomeScreen
import org.koin.compose.viewmodel.koinViewModel

fun NavGraphBuilder.homeGraph(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
) {
    navigation<SonicRoute.HomeGraph>(startDestination = SonicRoute.Home) {
        composable<SonicRoute.Home> { backStackEntry ->
            val homeViewModel = koinViewModel<HomeViewModel>(viewModelStoreOwner = backStackEntry)
            val authViewModel = koinViewModel<AuthViewModel>()

            HomeScreen(
                homeViewModel = homeViewModel,
                authViewModel = authViewModel,
                onNavigateToAlbum = onNavigateToAlbum
            )
        }
    }
}
