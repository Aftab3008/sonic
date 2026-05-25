package com.aftab005.sonic.features.home.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.network.models.Track
import com.aftab005.sonic.core.ui.components.ErrorView
import com.aftab005.sonic.core.ui.components.PageHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.vScaled
import com.aftab005.sonic.features.home.presentation.HomeIntent
import com.aftab005.sonic.features.home.presentation.HomeUiState
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import com.aftab005.sonic.features.home.ui.components.content.AlbumsCarousel
import com.aftab005.sonic.features.home.ui.components.content.FeaturedShowcase
import com.aftab005.sonic.features.home.ui.components.content.MoodGrid
import com.aftab005.sonic.features.home.ui.components.content.QuickAccessGrid
import com.aftab005.sonic.features.home.ui.components.content.RecentlyPlayedSection
import com.aftab005.sonic.features.home.ui.components.content.SinglesCarousel
import kotlinx.datetime.TimeZone
import kotlinx.datetime.toLocalDateTime
import kotlin.collections.ifEmpty
import kotlin.time.Clock


@Composable
fun HomeScreenContent(
    homeViewModel: HomeViewModel,
    authViewModel: AuthViewModel,
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
) {
    val homeState by homeViewModel.uiState.collectAsStateWithLifecycle()
    val authState by authViewModel.authState.collectAsStateWithLifecycle()
    val lazyListState = rememberLazyListState()

    val scrollY by remember {
        derivedStateOf {
            if (lazyListState.firstVisibleItemIndex == 0)
                lazyListState.firstVisibleItemScrollOffset.coerceAtMost(100).toFloat()
            else
                100f
        }
    }

    val user = (authState as? AuthState.Authenticated)?.user

    val userName = remember(user) { user?.name.takeIf { !it.isNullOrBlank() } ?: "there" }
    val profileImageUrl = remember(user) { user?.displayAvatarUrl }

    val greeting = remember {
        try {
            val hour = Clock.System.now()
                .toLocalDateTime(TimeZone.currentSystemDefault()).hour
            when {
                hour < 12 -> "Good morning"
                hour < 17 -> "Good afternoon"
                else      -> "Good evening"
            }
        } catch (_: Exception) {
            "Welcome"
        }
    }

    val isExpanded = SonicTheme.dimensions.gridColumns > 2

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
    ) {
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

        when (val currentState = homeState) {
            is HomeUiState.Loading -> {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState()),
                    verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.sectionSpacing),
                ) {
                    Spacer(modifier = Modifier.height(SonicTheme.dimensions.topContentPadding))
                    HomeSkeleton()
                }
            }
            is HomeUiState.Success,
            is HomeUiState.Refreshing -> {
                val data = (currentState as? HomeUiState.Success)?.data
                    ?: (currentState as? HomeUiState.Refreshing)?.previousData
                    ?: return@Box

                val tracks = remember(data.recent) {
                    data.recent.ifEmpty { homeViewModel.fallbackTracks }
                }

                LazyColumn(
                    state = lazyListState,
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.sectionSpacing),
                ) {
                    item(key = "top_spacer") {
                        Spacer(modifier = Modifier.height(SonicTheme.dimensions.topContentPadding))
                    }

                    item(key = "quick_access") {
                        val onTrackClick = remember { { track: Track -> homeViewModel.playTrack(track) } }
                        QuickAccessGrid(
                            tracks = tracks,
                            onTrackClick = onTrackClick,
                        )
                    }

                    item(key = "featured_showcase") {
                        FeaturedShowcase(
                            album = data.featured,
                            onPlay = {
                                val featured = data.featured ?: return@FeaturedShowcase
                                if (featured.isSingle) {
                                    homeViewModel.handleIntent(
                                        HomeIntent.FetchAndPlaySingle(featured)
                                    )
                                } else {
                                    onNavigateToAlbum(SonicRoute.AlbumDetail(featured.id))
                                }
                            },
                        )
                    }

                    item(key = "recently_played") {
                        RecentlyPlayedSection(
                            tracks = tracks,
                            onTrackPress = { track -> homeViewModel.playQueue(track, tracks) },
                            onViewHistory = { /* navigate */ },
                        )
                    }

                    item(key = "singles_carousel") {
                        SinglesCarousel(
                            singles = data.singles,
                            onSingleTap = { card ->
                                homeViewModel.handleIntent(HomeIntent.FetchAndPlaySingle(card))
                            }
                        )
                    }

                    item(key = "albums_carousel") {
                        AlbumsCarousel(
                            albums = data.albums,
                            onAlbumTap = { card ->
                                onNavigateToAlbum(SonicRoute.AlbumDetail(card.id))
                            }
                        )
                    }

                    item(key = "mood_grid") {
                        MoodGrid()
                    }

                    item(key = "bottom_spacer") {
                        Spacer(modifier = Modifier.height(140.vScaled))
                    }
                }
            }
            is HomeUiState.Error -> {
                ErrorView(
                    message = currentState.message,
                    onRetry = {
                        homeViewModel.handleIntent(
                            HomeIntent.RefreshDiscovery
                        )
                    }
                )
            }
        }

        if (homeState !is HomeUiState.Error) {
            PageHeader(
                title = userName,
                subtitle = "$greeting,",
                scrollY = scrollY,
                modifier = Modifier.align(Alignment.TopCenter),
                profileImageUrl = profileImageUrl,
            )
        }
    }
}