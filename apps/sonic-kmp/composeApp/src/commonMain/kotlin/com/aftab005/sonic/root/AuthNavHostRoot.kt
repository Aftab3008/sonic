package com.aftab005.sonic.root

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.runtime.Composable
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.rememberNavController
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.auth.navigation.authGraph

@Composable
fun AuthNavHostRoot() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = SonicRoute.AuthGraph,
        enterTransition = { fadeIn(animationSpec = tween(300)) },
        exitTransition = { fadeOut(animationSpec = tween(300)) },
        popEnterTransition = { fadeIn(animationSpec = tween(300)) },
        popExitTransition = { fadeOut(animationSpec = tween(300)) },
    ) {
        authGraph(
            onNavigateToSignUp = { navController.navigate(SonicRoute.SignUp) },
            onNavigateBackToLogin = { navController.popBackStack() },
        )
    }
}
