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
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.aftab005.sonic.core.auth.presentation.AuthNavEvent
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.components.CustomTabBar
import com.aftab005.sonic.core.ui.navigation.SonicUiNavigationMap
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.auth.LoginScreen
import com.aftab005.sonic.features.auth.SignUpScreen
import com.aftab005.sonic.features.discovery.DiscoveryScreen
import com.aftab005.sonic.features.home.HomeScreen
import com.aftab005.sonic.features.library.LibraryScreen
import com.aftab005.sonic.features.search.SearchScreen
import org.jetbrains.compose.resources.painterResource
import sonic.composeapp.generated.resources.Res
import sonic.composeapp.generated.resources.sonic_logo
import org.koin.compose.viewmodel.koinViewModel
import coil3.ImageLoader
import coil3.compose.setSingletonImageLoaderFactory
import coil3.disk.DiskCache
import coil3.memory.MemoryCache
import coil3.network.ktor3.KtorNetworkFetcherFactory
import okio.Path.Companion.toPath

@Composable
fun App(onStateLoaded: (Boolean) -> Unit = {}) {
    setSingletonImageLoaderFactory { context ->
        ImageLoader.Builder(context)
            .components {
                add(KtorNetworkFetcherFactory())
            }
            .memoryCache {
                MemoryCache.Builder()
                    .maxSizePercent(context, 0.25)
                    .build()
            }
            .diskCache {
                DiskCache.Builder()
                    .directory(getPlatform().cacheDir.toPath() / "image_cache")
                    .maxSizePercent(0.02)
                    .build()
            }
            .build()
    }

    SonicTheme {
        val authViewModel: AuthViewModel = koinViewModel()
        val authState by authViewModel.authState.collectAsState()

        val navController = rememberNavController()
        val navBackStackEntry by navController.currentBackStackEntryAsState()
        val currentDestination = navBackStackEntry?.destination

        LaunchedEffect(Unit) {
            onStateLoaded(true)
        }

        LaunchedEffect(authState) {
            when (authState) {
                is AuthState.Authenticated -> {
                    navController.navigate(SonicRoute.Home) {
                        popUpTo(0) { inclusive = true }
                    }
                }
                is AuthState.Unauthenticated -> {
                    navController.navigate(SonicRoute.Login) {
                        popUpTo(0) { inclusive = true }
                    }
                }
                else -> Unit
            }
        }

        LaunchedEffect(Unit) {
            authViewModel.navEvent.collect { event ->
                when (event) {
                    is AuthNavEvent.NavigateToHome -> {
                        navController.navigate(SonicRoute.Home) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                    is AuthNavEvent.NavigateToLogin -> {
                        navController.navigate(SonicRoute.Login) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                }
            }
        }

        val currentTabItem = SonicUiNavigationMap.find { tab ->
            currentDestination?.hierarchy?.any { it.hasRoute(tab.route::class) } == true
        }

        val isMainRoute = currentTabItem != null

        Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
            NavHost(
                navController = navController,
                startDestination = SonicRoute.Splash
            ) {
                composable<SonicRoute.Splash> {
                    // Splash is a placeholder; navigation is handled by AuthState & navEvent
                }

                composable<SonicRoute.Login> {
                    LoginScreen(
                        onNavigateToSignUp = { navController.navigate(SonicRoute.SignUp) }
                    )
                }
                composable<SonicRoute.SignUp> {
                    SignUpScreen(
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
                CustomTabBar(
                    selectedIndex = currentTabItem.index,
                    onTabSelected = { index ->
                        val targetTab = SonicUiNavigationMap.find { it.index == index }
                        targetTab?.let { tab ->
                            navController.navigate(tab.route) {
                                // Pop up to Home instead of Splash to avoid the "reset" jump
                                popUpTo(SonicRoute.Home) { 
                                    saveState = true 
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    },
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        }
    }
}
