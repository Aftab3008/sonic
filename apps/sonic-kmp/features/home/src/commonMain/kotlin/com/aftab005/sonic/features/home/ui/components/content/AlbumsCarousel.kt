package com.aftab005.sonic.features.home.ui.components.content

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.ui.components.VanguardSectionHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme

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
                val onClick = remember(card.id) { { onAlbumTap(card) } }
                AlbumCarouselCard(
                    card = card,
                    onClick = onClick,
                )
            }
        }
    }
}
