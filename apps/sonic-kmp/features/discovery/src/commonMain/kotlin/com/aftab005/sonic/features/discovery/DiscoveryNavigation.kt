package com.aftab005.sonic.features.discovery

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.discoveryGraph() {
    navigation<SonicRoute.DiscoveryGraph>(startDestination = SonicRoute.Discovery::class) {
        composable<SonicRoute.Discovery> { DiscoveryScreen() }
    }
}

