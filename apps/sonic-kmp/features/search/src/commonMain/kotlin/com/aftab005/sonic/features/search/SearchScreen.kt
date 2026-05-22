package com.aftab005.sonic.features.search

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.components.PageHeader
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.search.components.*
import com.aftab005.sonic.features.search.presentation.SearchViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun SearchScreen(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit = {},
    searchViewModel: SearchViewModel = koinViewModel(),
    authViewModel: AuthViewModel = koinViewModel()
) {
    val searchState by searchViewModel.uiState.collectAsState()
    val authState by authViewModel.authState.collectAsState()
    val scrollState = rememberLazyListState()

    val user = (authState as? AuthState.Authenticated)?.user
    val profileImageUrl = remember(user) { user?.displayAvatarUrl }

    val scrollY by remember {
        derivedStateOf {
            if (scrollState.firstVisibleItemIndex == 0) {
                scrollState.firstVisibleItemScrollOffset.toFloat()
            } else {
                1000f
            }
        }
    }

    val isExpanded = SonicTheme.dimensions.gridColumns > 2

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background)
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

        LazyColumn(
            state = scrollState,
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(bottom = 100.vScaled)
        ) {
            item {
                Spacer(modifier = Modifier.height(SonicTheme.dimensions.topContentPadding + 28.vScaled))
            }

            item {
                SearchBar(
                    query = searchState.query,
                    onQueryChange = searchViewModel::onQueryChange,
                    onClear = searchViewModel::clearQuery,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = SonicTheme.dimensions.screenPadding)
                        .padding(top = 16.vScaled, bottom = 12.vScaled)
                )
            }

            item {
                SearchFilterSection(
                    state = searchState,
                    onFilterSelect = searchViewModel::onFilterSelect,
                    modifier = Modifier.padding(top = 8.vScaled)
                )
            }

            when {
                searchState.isLoading -> item { SearchLoadingState() }
                searchState.error != null -> item { SearchErrorState(message = searchState.error!!) }
                !searchState.hasSearched -> item { SearchIdleState() }
                searchState.isEmpty -> item { SearchEmptyState(query = searchState.query) }

                else -> {
                    searchResultsItems(
                        state = searchState,
                        onSongTap = searchViewModel::onSongTap,
                        onAlbumTap = { album ->
                            onNavigateToAlbum(SonicRoute.AlbumDetail(album.id))
                        }
                    )
                }
            }
        }

        PageHeader(
            title = "Search",
            scrollY = scrollY,
            modifier = Modifier.align(Alignment.TopCenter),
            showNotifications = false,
            profileImageUrl =profileImageUrl
        )
    }
}
