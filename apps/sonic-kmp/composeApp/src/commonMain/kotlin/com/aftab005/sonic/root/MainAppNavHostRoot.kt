package com.aftab005.sonic.root

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.components.CustomTabBar
import com.aftab005.sonic.core.ui.navigation.SonicUiNavigationMap
import com.aftab005.sonic.features.album.navigation.albumGraph
import com.aftab005.sonic.features.discovery.navigation.discoveryGraph
import com.aftab005.sonic.features.home.navigation.homeGraph
import com.aftab005.sonic.features.library.navigation.libraryGraph
import com.aftab005.sonic.features.player.presentation.PlayerViewModel
import com.aftab005.sonic.features.search.navigation.searchGraph

@Composable
fun MainAppNavHostRoot(playerViewModel: PlayerViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    var lastStableTabIndex by rememberSaveable { mutableStateOf(0) }

    val selectedTabIndex =
        remember(currentDestination?.route) {
            val tabItem =
                SonicUiNavigationMap.find { tab ->
                    currentDestination?.hierarchy?.any { it.hasRoute(tab.route::class) } ==
                            true
                }
            if (tabItem != null) {
                lastStableTabIndex = tabItem.index
                tabItem.index
            } else {
                lastStableTabIndex
            }
        }

    var pillTabIndex by rememberSaveable { mutableStateOf(selectedTabIndex) }

    LaunchedEffect(selectedTabIndex) {
        if (pillTabIndex != selectedTabIndex) {
            pillTabIndex = selectedTabIndex
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        NavHost(
            navController = navController,
            startDestination = SonicRoute.HomeGraph,
            modifier = Modifier.fillMaxSize(),
            enterTransition = { fadeIn(animationSpec = tween(160)) },
            exitTransition = { fadeOut(animationSpec = tween(160)) },
            popEnterTransition = { fadeIn(animationSpec = tween(160)) },
            popExitTransition = { fadeOut(animationSpec = tween(160)) },
        ) {
            homeGraph(
                onNavigateToAlbum = { navController.navigate(it) },
            )
            searchGraph(
                onNavigateToAlbum = { navController.navigate(it) },
            )
            discoveryGraph()
            libraryGraph()
            albumGraph(
                onBack = { navController.popBackStack() },
            )
        }

        AuthenticatedPlayerUI(
            playerViewModel = playerViewModel,
            showTabBar = {
                CustomTabBar(
                    selectedIndex = pillTabIndex,
                    onTabSelected = { index ->
                        val targetTab = SonicUiNavigationMap.find { it.index == index } ?: return@CustomTabBar

                        val isCurrentTab = currentDestination?.hierarchy?.any { it.hasRoute(targetTab.route::class) } == true

                        if (isCurrentTab) {
                            navController.popBackStack(targetTab.route, inclusive = false)
                        } else {
                            pillTabIndex = index
                            navController.navigate(targetTab.route) {
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        )
    }
}
