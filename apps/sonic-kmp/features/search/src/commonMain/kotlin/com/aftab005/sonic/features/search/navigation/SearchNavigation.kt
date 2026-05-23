package com.aftab005.sonic.features.search.navigation

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.search.SearchScreen
import com.aftab005.sonic.features.search.presentation.SearchViewModel
import org.koin.compose.viewmodel.koinViewModel

fun NavGraphBuilder.searchGraph(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
) {
    navigation<SonicRoute.SearchGraph>(startDestination = SonicRoute.Search) {
        composable<SonicRoute.Search> {backStackEntry ->
            val searchViewModel = koinViewModel<SearchViewModel>(viewModelStoreOwner = backStackEntry)
            val authViewModel = koinViewModel<AuthViewModel>()

            SearchScreen(
                searchViewModel = searchViewModel,
                authViewModel = authViewModel,
                onNavigateToAlbum = onNavigateToAlbum
            )
        }
    }
}
