package com.aftab005.sonic.features.discovery.navigation

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.discovery.DiscoveryScreen

fun NavGraphBuilder.discoveryGraph() {
    navigation<SonicRoute.DiscoveryGraph>(startDestination = SonicRoute.Discovery::class) {
        composable<SonicRoute.Discovery> { DiscoveryScreen() }
    }
}
