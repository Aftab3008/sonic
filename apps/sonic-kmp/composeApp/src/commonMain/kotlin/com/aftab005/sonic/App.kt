package com.aftab005.sonic

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import coil3.ImageLoader
import coil3.compose.setSingletonImageLoaderFactory
import coil3.disk.DiskCache
import coil3.memory.MemoryCache
import coil3.network.ktor3.KtorNetworkFetcherFactory
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.root.AuthLoadingSpinner
import com.aftab005.sonic.root.AuthNavHostRoot
import com.aftab005.sonic.root.MainAppNavHostRoot
import okio.Path.Companion.toPath
import org.koin.compose.viewmodel.koinViewModel

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
                    MainAppNavHostRoot(
                        playerViewModel = koinViewModel()
                    )
                }
            }
        }
    }
}
