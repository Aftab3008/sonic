package com.aftab005.sonic.features.home.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.ui.components.VanguardSectionHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme

/**
 * Horizontal carousel of Album / EP / Compilation releases.
 * Tapping a card triggers [onAlbumTap] — caller navigates to [AlbumDetailScreen].
 */
@Composable
fun AlbumsCarousel(
    albums: List<AlbumCard>,
    onAlbumTap: (AlbumCard) -> Unit,
    modifier: Modifier = Modifier,
) {
    if (albums.isEmpty()) return

    Column(modifier = modifier.fillMaxWidth()) {
        VanguardSectionHeader(title = "Albums")

        Spacer(modifier = Modifier.height(SonicTheme.dimensions.cardSpacing))

        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = SonicTheme.dimensions.screenPadding),
            horizontalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing),
        ) {
            items(albums, key = { it.id }) { card ->
                AlbumCarouselCard(
                    card = card,
                    onClick = { onAlbumTap(card) },
                )
            }
        }
    }
}
