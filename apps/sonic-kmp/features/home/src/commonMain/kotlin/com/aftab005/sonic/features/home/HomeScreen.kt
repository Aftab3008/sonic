package com.aftab005.sonic.features.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.auth.AuthState
import com.aftab005.sonic.core.auth.AuthViewModel
import com.aftab005.sonic.core.ui.components.PageHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.vScaled
import com.aftab005.sonic.features.home.components.*
import com.aftab005.sonic.features.home.presentation.HomeUiState
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import kotlin.time.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun HomeScreen(
        viewModel: HomeViewModel = koinViewModel(),
        authViewModel: AuthViewModel = koinViewModel()
) {
        val state by viewModel.uiState.collectAsStateWithLifecycle()
        val authState by authViewModel.authState.collectAsStateWithLifecycle()
        val scrollState = rememberScrollState()

        val userName =
                remember(authState) {
                        (authState as? AuthState.Authenticated)?.user?.name ?: "there"
                }

        val greeting = remember {
                try {
                        val now =
                                Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
                        val hour = now.hour
                        when {
                                hour < 12 -> "Good morning"
                                hour < 17 -> "Good afternoon"
                                else -> "Good evening"
                        }
                } catch (e: Exception) {
                        "Welcome"
                }
        }

        Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
                Box(
                        modifier =
                                Modifier.fillMaxWidth()
                                        .height(400.vScaled)
                                        .background(
                                                Brush.verticalGradient(
                                                        colors =
                                                                listOf(
                                                                        SonicTheme.colors.primary
                                                                                .copy(
                                                                                        alpha =
                                                                                                0.15f
                                                                                ),
                                                                        SonicTheme.colors.background
                                                                )
                                                )
                                        )
                )

                val successData = (state as? HomeUiState.Success)?.data
                val isLoading = state is HomeUiState.Loading

                Column(modifier = Modifier.fillMaxSize().verticalScroll(scrollState)) {
                        Spacer(modifier = Modifier.height(110.vScaled))

                        when {
                                isLoading -> {
                                        HomeSkeleton()
                                }
                                successData != null -> {
                                        val data = successData

                                        Spacer(modifier = Modifier.height(8.vScaled))

                                        QuickAccessGrid(
                                                tracks = data.recent.ifEmpty { viewModel.fallbackTracks },
                                                onTrackPress = { /* navigate to player */}
                                        )

                                        FeaturedShowcase(
                                                album = data.featured,
                                                onPlay = { /* play album */}
                                        )

                                        RecentlyPlayedSection(
                                                tracks = data.recent.ifEmpty { viewModel.fallbackTracks },
                                                onTrackPress = { /* play track */},
                                                onViewHistory = { /* navigate */}
                                        )

                                        MadeForYouSection(albums = data.madeForYou)

                                        MoodGrid()

                                        Spacer(
                                                modifier = Modifier.height(140.vScaled)
                                        )
                                }
                                state is HomeUiState.Error -> {
                                        Box(
                                                modifier =
                                                        Modifier.fillMaxSize()
                                                                .padding(top = 100.vScaled),
                                                contentAlignment =Alignment.Center
                                        ) {
                                                androidx.compose.material3.Text(
                                                        text = (state as HomeUiState.Error).message,
                                                        color = SonicTheme.colors.error
                                                )
                                        }
                                }
                        }
                }
                PageHeader(
                        title = userName,
                        subtitle = "$greeting,",
                        scrollY = scrollState.value.toFloat(),
                        modifier = Modifier.align(Alignment.TopCenter)
                )
        }
}
