package com.aftab005.sonic.features.auth

import androidx.navigation.NavController
import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import com.aftab005.sonic.core.navigation.SonicRoute

fun NavGraphBuilder.authGraph(navController: NavController) {
    composable<SonicRoute.Login> {
        LoginScreen(onNavigateToSignUp = { navController.navigate(SonicRoute.SignUp) })
    }
    composable<SonicRoute.SignUp> {
        SignUpScreen(onNavigateToLogin = { navController.popBackStack() })
    }
}
