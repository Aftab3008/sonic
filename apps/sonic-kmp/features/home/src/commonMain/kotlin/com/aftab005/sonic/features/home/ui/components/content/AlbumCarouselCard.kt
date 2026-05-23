package com.aftab005.sonic.features.home.ui.components.content

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

/**
 * Shared card composable used by both [SinglesCarousel] and [AlbumsCarousel].
 * Tap behaviour is determined by the caller — this component is purely presentational.
 */
@Composable
fun AlbumCarouselCard(
    card: AlbumCard,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val cardSize = 140.scaled

    Column(
        modifier = modifier
            .width(cardSize)
            .clickable { onClick() },
    ) {
        Box(
            modifier = Modifier
                .size(cardSize)
                .clip(RoundedCornerShape(14.scaled))
                .background(SonicTheme.colors.surfaceContainer)
                .border(
                    width = 1.scaled,
                    color = SonicTheme.colors.outlineVariant.copy(alpha = 0.12f),
                    shape = RoundedCornerShape(14.scaled),
                ),
        ) {
            AsyncImage(
                model = card.coverImageUrl,
                contentDescription = card.title,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop,
            )

            val badgeLabel = when (card.albumType) {
                "EP" -> "EP"
                "COMPILATION" -> "COMP"
                else -> null
            }
            badgeLabel?.let {
                Box(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(6.scaled)
                        .background(
                            color = Color.Black.copy(alpha = 0.65f),
                            shape = RoundedCornerShape(5.scaled),
                        )
                        .padding(horizontal = 6.scaled, vertical = 3.scaled),
                ) {
                    Text(
                        text = it,
                        color = Color.White,
                        fontSize = 8.mTextScaled,
                        fontWeight = FontWeight.ExtraBold,
                        letterSpacing = 0.8.sp,
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.vScaled))

        Text(
            text = card.title,
            color = SonicTheme.colors.onSurface,
            fontSize = 13.mTextScaled,
            fontWeight = FontWeight.Bold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )

        Text(
            text = card.artists?.firstOrNull()?.artist?.name ?: "Unknown Artist",
            color = SonicTheme.colors.onSurfaceVariant,
            fontSize = 11.mTextScaled,
            fontWeight = FontWeight.Medium,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
            modifier = Modifier.padding(top = 2.vScaled),
        )
    }
}
