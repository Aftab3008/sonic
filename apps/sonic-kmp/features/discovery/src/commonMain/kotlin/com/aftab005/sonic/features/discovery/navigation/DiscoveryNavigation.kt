package com.aftab005.sonic.features.discovery.navigation

import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import androidx.navigation.toRoute
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.discovery.DiscoveryScreen
import com.aftab005.sonic.features.discovery.presentation.DiscoveryViewModel
import com.aftab005.sonic.features.discovery.presentation.GenreDetailViewModel
import com.aftab005.sonic.features.discovery.ui.GenreDetailScreen
import org.koin.compose.viewmodel.koinViewModel

fun NavGraphBuilder.discoveryGraph(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
    onNavigateToGenreDetail: (SonicRoute.GenreDetail) -> Unit,
    onBack: () -> Unit,
) {
    navigation<SonicRoute.DiscoveryGraph>(startDestination = SonicRoute.Discovery::class) {
        composable<SonicRoute.Discovery> { backStackEntry ->
            val discoveryViewModel = koinViewModel<DiscoveryViewModel>(
                viewModelStoreOwner = backStackEntry
            )
            val authViewModel= koinViewModel<AuthViewModel>()


            DiscoveryScreen(
                discoveryViewModel = discoveryViewModel,
                authViewModel = authViewModel,
                onGenreClick = { slug, name ->
                    onNavigateToGenreDetail(
                        SonicRoute.GenreDetail(
                            genreSlug = slug,
                            genreName = name
                        )
                    )
                }
            )
        }

        composable<SonicRoute.GenreDetail> { backStackEntry ->
            val route = backStackEntry.toRoute<SonicRoute.GenreDetail>()

            val genreViewModel = koinViewModel<GenreDetailViewModel>(
                viewModelStoreOwner = backStackEntry
            )
            GenreDetailScreen(
                genreSlug = route.genreSlug,
                genreName = route.genreName,
                genreViewModel = genreViewModel,
                onNavigateToAlbum = onNavigateToAlbum,
                onBack = onBack
            )
        }
    }
}
