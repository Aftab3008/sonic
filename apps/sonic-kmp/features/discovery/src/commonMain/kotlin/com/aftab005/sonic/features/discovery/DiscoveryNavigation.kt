package com.aftab005.sonic.features.discovery

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.discoveryGraph() {
    composable<SonicRoute.Discovery> { DiscoveryScreen() }
}
