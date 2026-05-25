package com.aftab005.sonic.features.discovery.ui.components.content

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.LazyGridState
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.discovery.data.Genre

@Composable
fun DiscoveryResultsGrid(
    genres: List<Genre>,
    scrollState: LazyGridState,
    isExpanded: Boolean,
    onGenreClick: (slug: String, name: String) -> Unit
) {
    LazyVerticalGrid(
        state = scrollState,
        columns = GridCells.Fixed(if (isExpanded) 4 else 2),
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(
            start = SonicTheme.dimensions.screenPadding,
            end = SonicTheme.dimensions.screenPadding,
            bottom = 100.dp
        ),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        items(genres) { genre ->
            GenreGridCard(
                genre = genre,
                onClick = {
                    onGenreClick(genre.slug, genre.name)
                }
            )
        }
    }
}
