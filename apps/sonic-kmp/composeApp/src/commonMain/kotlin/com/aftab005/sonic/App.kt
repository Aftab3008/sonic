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
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import coil3.ImageLoader
import coil3.compose.setSingletonImageLoaderFactory
import coil3.disk.DiskCache
import coil3.memory.MemoryCache
import coil3.network.ktor3.KtorNetworkFetcherFactory
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.components.CustomTabBar
import com.aftab005.sonic.core.ui.navigation.SonicUiNavigationMap
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.features.album.albumGraph
import com.aftab005.sonic.features.auth.authGraph
import com.aftab005.sonic.features.discovery.discoveryGraph
import com.aftab005.sonic.features.home.homeGraph
import com.aftab005.sonic.features.library.libraryGraph
import com.aftab005.sonic.features.player.PlayerSheet
import com.aftab005.sonic.features.player.components.MiniPlayer
import com.aftab005.sonic.features.player.presentation.PlayerIntent
import com.aftab005.sonic.features.player.presentation.PlayerUiState
import com.aftab005.sonic.features.player.presentation.PlayerViewModel
import com.aftab005.sonic.features.search.searchGraph
import okio.Path.Companion.toPath
import org.jetbrains.compose.resources.painterResource
import org.koin.compose.viewmodel.koinViewModel
import sonic.composeapp.generated.resources.Res
import sonic.composeapp.generated.resources.sonic_logo

@Composable
fun App(onStateLoaded: (Boolean) -> Unit = {}) {

    setSingletonImageLoaderFactory { context ->
        ImageLoader.Builder(context)
                .components { add(KtorNetworkFetcherFactory()) }
                .memoryCache { MemoryCache.Builder().maxSizePercent(context, 0.25).build() }
                .diskCache {
                    DiskCache
                        .Builder()
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

        LaunchedEffect(Unit) { onStateLoaded(true) }

        LaunchedEffect(authState) {
            when (authState) {
                is AuthState.Authenticated -> {
                    navController.navigate(SonicRoute.Home) {
                        popUpTo(navController.graph.id) { inclusive = true }
                    }
                }
                is AuthState.Unauthenticated -> {
                    navController.navigate(SonicRoute.Login) {
                        popUpTo(navController.graph.id) { inclusive = true }
                    }
                }
                else -> Unit
            }
        }

        val currentTabItem =
                SonicUiNavigationMap.find { tab ->
                    currentDestination?.hierarchy?.any { it.hasRoute(tab.route::class) } == true
                }


        val isAuthOrSplash = listOf(
                SonicRoute.Login::class,
                SonicRoute.SignUp::class,
                SonicRoute.Splash::class,
        ).any { routeClass ->
            currentDestination?.hierarchy?.any { it.hasRoute(routeClass) } == true
        }
        val showChrome = !isAuthOrSplash && authState !is AuthState.Loading

        val selectedTabIndex = currentTabItem?.index ?: 0

        Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
            NavHost(navController = navController, startDestination = SonicRoute.Splash) {
                composable<SonicRoute.Splash> {
                    // Splash is a placeholder; navigation is handled by AuthState & navEvent
                }
                authGraph(navController)
                homeGraph(navController)
                searchGraph(navController)
                discoveryGraph()
                libraryGraph()
                albumGraph(navController)
            }

            if (authState is AuthState.Loading) {
                AuthLoadingSpinner()
            }

            if (showChrome) {
                AuthenticatedPlayerUI(
                    playerViewModel = koinViewModel(),
                    showTabBar = {
                        CustomTabBar(
                            selectedIndex = selectedTabIndex,
                            onTabSelected = { index ->
                                val targetTab = SonicUiNavigationMap.find { it.index == index }
                                targetTab?.let { tab ->
                                    navController.navigate(tab.route) {
                                        popUpTo(SonicRoute.Home) { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            },
                            modifier = Modifier.align(Alignment.BottomCenter)
                        )
                    }
                )
            }
        }
    }
}

@Composable
fun AuthenticatedPlayerUI(
    playerViewModel: PlayerViewModel,
    showTabBar: @Composable () -> Unit
) {
    val playerState by playerViewModel.uiState.collectAsStateWithLifecycle()
    val hasActiveTrack by playerViewModel.hasActiveTrack.collectAsStateWithLifecycle()
    var isPlayerVisible by remember { mutableStateOf(false) }

    Box(modifier = Modifier.fillMaxSize()) {
        if (hasActiveTrack && !isPlayerVisible) {
            val activeState = playerState as? PlayerUiState.Active
            if (activeState != null) {
                MiniPlayer(
                    track = activeState.track,
                    isPlaying = activeState.isPlaying,
                    isBuffering = activeState.isBuffering,
                    positionSec = activeState.positionSec,
                    durationSec = activeState.durationSec,
                    onPress = { isPlayerVisible = true },
                    onPlayPause = { playerViewModel.handleIntent(PlayerIntent.PlayPause) },
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        }

        showTabBar()

        PlayerSheet(visible = isPlayerVisible, onDismiss = { isPlayerVisible = false })
    }
}


@Composable
fun AuthLoadingSpinner(){
    Column(
        modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(Res.drawable.sonic_logo),
            contentDescription = "Sonic",
            modifier = Modifier.size(160.mScaled)
        )
        Spacer(modifier = Modifier.height(32.mScaled))
        CircularProgressIndicator(
            color = SonicTheme.colors.primary,
            modifier = Modifier.size(32.mScaled)
        )
    }
}
