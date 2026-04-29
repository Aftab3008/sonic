package com.aftab005.sonic

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.aftab005.sonic.core.auth.AuthRepository
import com.aftab005.sonic.core.auth.AuthState
import com.aftab005.sonic.core.auth.AuthViewModel
import com.aftab005.sonic.core.auth.SessionStorage
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.components.CustomTabBar
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.auth.LoginScreen
import com.aftab005.sonic.features.auth.SignUpScreen
import com.aftab005.sonic.features.discovery.DiscoveryScreen
import com.aftab005.sonic.features.home.HomeScreen
import com.aftab005.sonic.features.library.LibraryScreen
import com.aftab005.sonic.features.search.SearchScreen
import com.russhwolf.settings.Settings
import org.jetbrains.compose.resources.painterResource
import sonic.composeapp.generated.resources.Res
import sonic.composeapp.generated.resources.sonic_logo

@Composable
fun App(onStateLoaded: (Boolean) -> Unit = {}) {
    SonicTheme {
        val settings = remember { Settings() }
        val sessionStorage = remember { SessionStorage(settings) }
        val authRepository = remember { AuthRepository() }

        val authViewModel: AuthViewModel =
                viewModel {
                    AuthViewModel(authRepository, sessionStorage)
                }

        val authState by authViewModel.authState.collectAsState()

        val navController = rememberNavController()
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentRoute = navBackStackEntry?.destination?.route

        LaunchedEffect(Unit) {
            onStateLoaded(true)
        }

        LaunchedEffect(authState) {
            when (authState) {
                is AuthState.Authenticated -> {
                    navController.navigate(SonicRoute.Home) { popUpTo(0) { inclusive = true } }
                }
                is AuthState.Unauthenticated -> {
                    navController.navigate(SonicRoute.Login) { popUpTo(0) { inclusive = true } }
                }
                else -> Unit
            }
        }

        val isMainRoute =
                currentRoute?.let { route ->
                    listOf("Home", "Search", "Discovery", "Library").any { route.contains(it) }
                }
                        ?: false

        Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
            NavHost(
                navController = navController,
                startDestination =
                when (authState) {
                    is AuthState.Authenticated -> SonicRoute.Home
                    else -> SonicRoute.Login
                }
            ) {
                composable<SonicRoute.Login> {
                    LoginScreen(
                        authViewModel = authViewModel,
                        onNavigateToSignUp = { navController.navigate(SonicRoute.SignUp) }
                    )
                }
                composable<SonicRoute.SignUp> {
                    SignUpScreen(
                        authViewModel = authViewModel,
                        onNavigateToLogin = { navController.popBackStack() }
                    )
                }

                composable<SonicRoute.Home> { HomeScreen() }
                composable<SonicRoute.Search> { SearchScreen() }
                composable<SonicRoute.Discovery> { DiscoveryScreen() }
                composable<SonicRoute.Library> { LibraryScreen() }
            }

            if (authState is AuthState.Loading) {
                Column(
                    modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Image(
                        painter = painterResource(Res.drawable.sonic_logo),
                        contentDescription = "Sonic Logo",
                        modifier = Modifier.size(160.dp)
                    )
                    Spacer(modifier = Modifier.height(32.dp))
                    CircularProgressIndicator(
                        color = SonicTheme.colors.primary,
                        modifier = Modifier.size(32.dp)
                    )
                }
            }

            if (isMainRoute) {
                val selectedIndex =
                    when {
                        currentRoute.contains("Home") -> 0
                        currentRoute.contains("Search") -> 1
                        currentRoute.contains("Discovery") -> 2
                        currentRoute.contains("Library") -> 3
                        else -> 0
                    }
                CustomTabBar(
                    selectedIndex = selectedIndex,
                    onTabSelected = { index ->
                        val route =
                            when (index) {
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
}
