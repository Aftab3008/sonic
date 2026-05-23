package com.aftab005.sonic.features.auth.navigation

import androidx.navigation.NavGraphBuilder
import androidx.navigation.compose.composable
import androidx.navigation.navigation
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.features.auth.LoginScreen
import com.aftab005.sonic.features.auth.SignUpScreen

fun NavGraphBuilder.authGraph(
    onNavigateToSignUp: () -> Unit,
    onNavigateBackToLogin: () -> Unit,
) {
    navigation<SonicRoute.AuthGraph>(startDestination = SonicRoute.Login::class) {
        composable<SonicRoute.Login> {
            LoginScreen(onNavigateToSignUp = onNavigateToSignUp)
        }
        composable<SonicRoute.SignUp> {
            SignUpScreen(onNavigateToLogin = onNavigateBackToLogin)
        }
    }
}

