package com.aftab005.sonic.features.library

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.libraryGraph() {
    composable<SonicRoute.Library> { LibraryScreen() }
}
