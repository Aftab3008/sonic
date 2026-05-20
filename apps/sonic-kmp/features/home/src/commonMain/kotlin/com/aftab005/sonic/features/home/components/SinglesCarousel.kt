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
 * Horizontal carousel of Single releases.
 * Tapping a card triggers [onSingleTap] — caller handles fetch + auto-play.
 */
@Composable
fun SinglesCarousel(
    singles: List<AlbumCard>,
    onSingleTap: (AlbumCard) -> Unit,
    modifier: Modifier = Modifier,
) {
    if (singles.isEmpty()) return

    Column(modifier = modifier.fillMaxWidth()) {
        VanguardSectionHeader(title = "Singles")

        Spacer(modifier = Modifier.height(SonicTheme.dimensions.cardSpacing))

        LazyRow(
            modifier = Modifier.fillMaxWidth(),
            contentPadding = PaddingValues(horizontal = SonicTheme.dimensions.screenPadding),
            horizontalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing),
        ) {
            items(singles, key = { it.id }) { card ->
                AlbumCarouselCard(
                    card = card,
                    onClick = { onSingleTap(card) },
                )
            }
        }
    }
}
