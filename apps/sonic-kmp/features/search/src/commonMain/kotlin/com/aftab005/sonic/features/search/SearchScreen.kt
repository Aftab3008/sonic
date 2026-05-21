package com.aftab005.sonic.features.search

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBars
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.search.components.*
import com.aftab005.sonic.features.search.presentation.SearchViewModel
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun SearchScreen(
    onNavigateToAlbum: (SonicRoute.AlbumDetail) -> Unit = {},
    searchViewModel: SearchViewModel = koinViewModel()
) {
    val searchState by searchViewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .windowInsetsPadding(WindowInsets.statusBars)
            .background(SonicTheme.colors.background)
    ) {
        SearchBar(
            query = searchState.query,
            onQueryChange = searchViewModel::onQueryChange,
            onClear = searchViewModel::clearQuery,
            modifier = Modifier
                .fillMaxWidth()
                .padding(
                    start = 16.scaled,
                    end = 16.scaled,
                    top = 8.vScaled,
                    bottom = 4.vScaled
                )
        )

        SearchFilterSection(
            state = searchState,
            onFilterSelect = searchViewModel::onFilterSelect,
        )

        Box(modifier = Modifier.fillMaxSize()) {
            when {
                searchState.isLoading -> SearchLoadingState()
                searchState.error != null -> SearchErrorState(message = searchState.error!!)
                !searchState.hasSearched -> SearchIdleState()
                searchState.isEmpty -> SearchEmptyState(query = searchState.query)

                else -> SearchResultsList(
                    state = searchState,
                    onSongTap = searchViewModel::onSongTap,
                    onAlbumTap = { album ->
                        onNavigateToAlbum(SonicRoute.AlbumDetail(album.id))
                    }
                )
            }
        }
    }
}
