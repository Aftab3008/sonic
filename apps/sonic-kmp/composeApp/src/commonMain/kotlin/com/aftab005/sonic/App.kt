package com.aftab005.sonic

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.components.CustomTabBar
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.discovery.DiscoveryScreen
import com.aftab005.sonic.features.home.HomeScreen
import com.aftab005.sonic.features.library.LibraryScreen
import com.aftab005.sonic.features.search.SearchScreen

@Composable
fun App() {
    SonicTheme {
        val navController = rememberNavController()
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(SonicTheme.colors.background)
        ) {
            NavHost(
                navController = navController,
                startDestination = SonicRoute.Home
            ) {
                composable<SonicRoute.Home> { HomeScreen() }
                composable<SonicRoute.Search> { SearchScreen() }
                composable<SonicRoute.Discovery> { DiscoveryScreen() }
                composable<SonicRoute.Library> { LibraryScreen() }
            }

            val selectedIndex = when {
                currentRoute?.contains("Home") == true -> 0
                currentRoute?.contains("Search") == true -> 1
                currentRoute?.contains("Discovery") == true -> 2
                currentRoute?.contains("Library") == true -> 3
                else -> 0
            }

            CustomTabBar(
                selectedIndex = selectedIndex,
                onTabSelected = { index ->
                    val route = when (index) {
                        0 -> SonicRoute.Home
                        1 -> SonicRoute.Search
                        2 -> SonicRoute.Discovery
                        3 -> SonicRoute.Library
                        else -> SonicRoute.Home
                    }
                    navController.navigate(route) {
                        popUpTo(navController.graph.startDestinationId) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                modifier = Modifier.align(Alignment.BottomCenter)
            )
        }
    }
}