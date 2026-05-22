package com.aftab005.sonic

import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
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
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import androidx.navigation.NavDestination.Companion.hasRoute
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
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
import com.aftab005.sonic.core.ui.components.BackHandler
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
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
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
                DiskCache.Builder()
                    .directory(getPlatform().cacheDir.toPath() / "image_cache")
                    .maxSizePercent(0.02)
                    .build()
            }
            .build()
    }

    SonicTheme {
        val authViewModel: AuthViewModel = koinViewModel()
        val authState by authViewModel.authState.collectAsStateWithLifecycle()

        LaunchedEffect(Unit) { onStateLoaded(true) }

        Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
            when (authState) {
                is AuthState.Loading -> {
                    AuthLoadingSpinner()
                }

                is AuthState.Unauthenticated -> {
                    AuthNavHostRoot()
                }

                is AuthState.Authenticated -> {
                    MainAppNavHostRoot(playerViewModel = koinViewModel())
                }
            }
        }
    }
}

@Composable
private fun AuthNavHostRoot() {
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


@Suppress("SuspiciousIndentation")
@Composable
private fun MainAppNavHostRoot(playerViewModel: PlayerViewModel) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination
    val scope = rememberCoroutineScope()

        DisposableEffect(navController) {
            val listener = NavController.OnDestinationChangedListener { controller, destination, _ ->
                try {
                    val stack = controller.currentBackStack.value
                        .map { it.destination.route?.substringAfterLast(".") ?: "null" }
                    println("SONIC_NAV: ${destination.route?.substringAfterLast(".")} | Stack: $stack")
                } catch (e: Exception) {
                    println("SONIC_NAV: Destination changed, couldn't read stack — ${e.message}")
                }
            }
            navController.addOnDestinationChangedListener(listener)
            onDispose { navController.removeOnDestinationChangedListener(listener) }
        }


    var lastStableTabIndex by rememberSaveable { mutableStateOf(0) }

    val selectedTabIndex = remember(currentDestination?.route) {
        val tabItem = SonicUiNavigationMap.find { tab ->
            currentDestination?.hierarchy?.any { it.hasRoute(tab.route::class) } == true
        }
        if (tabItem != null) {
            lastStableTabIndex = tabItem.index
            tabItem.index
        } else {
            lastStableTabIndex
        }
    }

    var pillTabIndex by rememberSaveable { mutableStateOf(selectedTabIndex) }

    LaunchedEffect(selectedTabIndex) {
        pillTabIndex = selectedTabIndex
    }

    Box(modifier = Modifier.fillMaxSize()) {
        NavHost(
            navController = navController,
            startDestination = SonicRoute.HomeGraph,
            modifier = Modifier.fillMaxSize(),
            enterTransition = { fadeIn(animationSpec = tween(300)) },
            exitTransition = { fadeOut(animationSpec = tween(300)) },
            popEnterTransition = { fadeIn(animationSpec = tween(300)) },
            popExitTransition = { fadeOut(animationSpec = tween(300)) },
        ) {
            homeGraph(
                onNavigateToAlbum = { navController.navigate(it) },
            )
            searchGraph(
                onNavigateToAlbum = { navController.navigate(it) },
            )
            discoveryGraph()
            libraryGraph()
            albumGraph(
                onBack = { navController.popBackStack() },
            )
        }

        AuthenticatedPlayerUI(
            playerViewModel = playerViewModel,
            showTabBar = {
                println("SONIC_TAB_DEBUG: CustomTabBar composed with pillTabIndex=$pillTabIndex")
                CustomTabBar(
                    selectedIndex = pillTabIndex,
                    onTabSelected = { index ->
                        val targetTab = SonicUiNavigationMap.find { it.index == index }
                        targetTab?.let { tab ->
                            if (index == pillTabIndex) {
                                println("SONIC_TAB_DEBUG: Same tab tapped ($index), popping to ${tab.route}")
                                navController.popBackStack(tab.route, inclusive = false)
                            } else {
                                println("SONIC_TAB_DEBUG: Pill moving $pillTabIndex -> $index, nav delayed 150ms")
                                pillTabIndex = index
                                scope.launch {
                                    delay(150)
                                    navController.navigate(tab.route) {
                                        popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                                        launchSingleTop = true
                                        restoreState = true
                                    }
                                }
                            }
                        }
                    },
                    modifier = Modifier.align(Alignment.BottomCenter)
                )
            }
        )
    }
}

@Composable
fun AuthenticatedPlayerUI(playerViewModel: PlayerViewModel, showTabBar: @Composable () -> Unit) {
    val playerState by playerViewModel.uiState.collectAsStateWithLifecycle()
    val hasActiveTrack by playerViewModel.hasActiveTrack.collectAsStateWithLifecycle()
    var isPlayerVisible by remember { mutableStateOf(false) }

    BackHandler(enabled = isPlayerVisible) {
        isPlayerVisible = false
    }

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
fun AuthLoadingSpinner() {
    Column(
        modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Image(
            painter = painterResource(Res.drawable.sonic_logo),
            contentDescription = "Sonic",
            modifier = Modifier.size(160.mScaled),
        )
        Spacer(modifier = Modifier.height(32.mScaled))
        CircularProgressIndicator(
            color = SonicTheme.colors.primary,
            modifier = Modifier.size(32.mScaled),
        )
    }
}
