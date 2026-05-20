package com.aftab005.sonic.features.home

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.ui.components.PageHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled
import com.aftab005.sonic.features.home.components.*
import com.aftab005.sonic.features.home.presentation.HomeIntent
import com.aftab005.sonic.features.home.presentation.HomeUiState
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import kotlin.time.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun HomeScreen(
    homeViewModel: HomeViewModel = koinViewModel(),
    authViewModel: AuthViewModel = koinViewModel(),
    onNavigateToAlbum: (AlbumCard) -> Unit = {},
) {
    val state by homeViewModel.uiState.collectAsStateWithLifecycle()
    val authState by authViewModel.authState.collectAsStateWithLifecycle()
    val scrollState = rememberScrollState()

    val userName = remember(authState) {
        (authState as? AuthState.Authenticated)?.user?.name ?: "there"
    }
    
    val greeting = remember {
        try {
            val now = Clock.System.now().toLocalDateTime(TimeZone.currentSystemDefault())
            val hour = now.hour
            when {
                hour < 12 -> "Good morning"
                hour < 17 -> "Good afternoon"
                else -> "Good evening"
            }
        } catch (_: Exception) {
            "Welcome"
        }
    }

    val isExpanded = SonicTheme.dimensions.gridColumns > 2
    val homeData = (state as? HomeUiState.Success)?.data
    val isLoading = state is HomeUiState.Loading

    Box(modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background)) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(if (isExpanded) 300.vScaled else 400.vScaled)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            SonicTheme.colors.primary.copy(alpha = 0.15f),
                            SonicTheme.colors.background,
                        )
                    )
                )
        )

        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(scrollState),
            verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.sectionSpacing),
        ) {
            Spacer(modifier = Modifier.height(SonicTheme.dimensions.topContentPadding))

            when {
                isLoading -> {
                    HomeSkeleton()
                }

                homeData != null -> {
                    val tracks = homeData.recent.ifEmpty { homeViewModel.fallbackTracks }

                    QuickAccessGrid(tracks = tracks)

                    FeaturedShowcase(
                        album = homeData.featured,
                        onPlay = {
                            val featured = homeData.featured ?: return@FeaturedShowcase
                            if (featured.isSingle) {
                                homeViewModel.handleIntent(HomeIntent.FetchAndPlaySingle(featured))
                            } else {
                                onNavigateToAlbum(featured)
                            }
                        },
                    )

                    RecentlyPlayedSection(
                        tracks = tracks,
                        onTrackPress = { track -> homeViewModel.playQueue(track, tracks) },
                        onViewHistory = { /* navigate */ },
                    )

                    SinglesCarousel(
                        singles = homeData.singles,
                        onSingleTap = { card ->
                            homeViewModel.handleIntent(HomeIntent.FetchAndPlaySingle(card))
                        },
                    )

                    AlbumsCarousel(
                        albums = homeData.albums,
                        onAlbumTap = { card -> onNavigateToAlbum(card) },
                    )

                    MoodGrid()

                    Spacer(modifier = Modifier.height(140.vScaled))
                }

                state is HomeUiState.Error -> {
                    OfflineView(
                        message = (state as HomeUiState.Error).message,
                        onRetry = { homeViewModel.handleIntent(HomeIntent.RefreshDiscovery) },
                    )
                }
            }
        }

        if (state !is HomeUiState.Error) {
            PageHeader(
                title = userName,
                subtitle = "$greeting,",
                scrollY = scrollState.value.toFloat(),
                modifier = Modifier.align(Alignment.TopCenter),
            )
        }
    }
}

@Composable
fun OfflineView(
    message: String,
    onRetry: () -> Unit,
) {
    val maxContentWidth = SonicTheme.dimensions.maxContentWidth
        .takeIf { it != androidx.compose.ui.unit.Dp.Unspecified } ?: 400.scaled

    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(
            modifier = Modifier
                .widthIn(max = maxContentWidth)
                .padding(horizontal = SonicTheme.dimensions.screenPadding)
                .padding(top = 100.vScaled),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Icon(
                imageVector = Icons.Default.WifiOff,
                contentDescription = null,
                modifier = Modifier.size(80.scaled),
                tint = SonicTheme.colors.primary.copy(alpha = 0.6f),
            )

            Spacer(modifier = Modifier.height(24.vScaled))

            Text(
                text = "Something went wrong",
                color = Color.White,
                fontSize = 24.mTextScaled,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
            )

            Spacer(modifier = Modifier.height(12.vScaled))

            Text(
                text = message,
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 16.mTextScaled,
                textAlign = TextAlign.Center,
                lineHeight = 22.sp,
            )

            Spacer(modifier = Modifier.height(40.vScaled))

            Button(
                onClick = onRetry,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SonicTheme.colors.primary,
                    contentColor = Color.White,
                ),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(12.scaled),
                modifier = Modifier.height(52.vScaled).fillMaxWidth(),
            ) {
                Text(
                    text = "Try Again",
                    fontSize = 16.mTextScaled,
                    fontWeight = FontWeight.Bold,
                )
            }
        }
    }
}
