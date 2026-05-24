package com.aftab005.sonic.features.search.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.network.models.SearchAlbumResult
import com.aftab005.sonic.core.ui.components.PageHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.vScaled
import com.aftab005.sonic.features.search.presentation.SearchViewModel
import com.aftab005.sonic.features.search.ui.components.content.SearchBar
import com.aftab005.sonic.features.search.ui.components.content.SearchEmptyState
import com.aftab005.sonic.features.search.ui.components.content.SearchErrorState
import com.aftab005.sonic.features.search.ui.components.content.SearchFilterSection
import com.aftab005.sonic.features.search.ui.components.content.SearchIdleState
import com.aftab005.sonic.features.search.ui.components.content.SearchLoadingState
import com.aftab005.sonic.features.search.ui.components.content.searchResultsItems

@Composable
fun SearchScreenContent(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit,
    searchViewModel: SearchViewModel,
    authViewModel: AuthViewModel,
) {
    val searchState by searchViewModel.uiState.collectAsStateWithLifecycle()
    val authState   by authViewModel.authState.collectAsStateWithLifecycle()

    val scrollState = rememberLazyListState()

    val user           = (authState as? AuthState.Authenticated)?.user
    val profileImageUrl = remember(user) { user?.displayAvatarUrl }

    val scrollY by remember {
        derivedStateOf {
            if (scrollState.firstVisibleItemIndex == 0)
                scrollState.firstVisibleItemScrollOffset.toFloat()
            else
                1000f
        }
    }

    val isExpanded   = SonicTheme.dimensions.gridColumns > 2

    val gradientBrush = rememberSearchGradient()

    val onAlbumTap = remember<(SearchAlbumResult) -> Unit> {
        { album -> onNavigateToAlbum(SonicRoute.AlbumDetail(album.id)) }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background),
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(if (isExpanded) 300.vScaled else 400.vScaled)
                .background(gradientBrush),
        )

        Column(modifier = Modifier.fillMaxSize()) {
            Spacer(
                modifier = Modifier.height(
                    SonicTheme.dimensions.topContentPadding + 28.vScaled
                )
            )

            SearchBar(
                query = searchState.query,
                onQueryChange = searchViewModel::onQueryChange,
                onClear = searchViewModel::clearQuery,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = SonicTheme.dimensions.screenPadding)
                    .padding(top = 16.vScaled, bottom = 12.vScaled),
            )

            SearchFilterSection(
                state = searchState,
                onFilterSelect = searchViewModel::onFilterSelect,
                modifier = Modifier.padding(top = 8.vScaled),
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                when {
                    searchState.isLoading -> SearchLoadingState()
                    searchState.error != null -> SearchErrorState(message = searchState.error!!)
                    !searchState.hasSearched -> SearchIdleState()
                    searchState.isEmpty -> SearchEmptyState(query = searchState.query)

                    else -> {
                        LazyColumn(
                            state = scrollState,
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(bottom = 100.vScaled),
                        ) {
                            searchResultsItems(
                                state = searchState,
                                onSongTap = searchViewModel::onSongTap,
                                onAlbumTap = onAlbumTap,
                            )
                        }
                    }
                }
            }
        }

        PageHeader(
            title = "Search",
            scrollY = scrollY,
            modifier = Modifier.align(Alignment.TopCenter),
            showNotifications = false,
            profileImageUrl = profileImageUrl,
        )
    }
}