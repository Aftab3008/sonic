package com.aftab005.sonic.features.library

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.libraryGraph() {
    navigation<SonicRoute.LibraryGraph>(startDestination = SonicRoute.Library::class) {
        composable<SonicRoute.Library> { LibraryScreen() }
    }
}

