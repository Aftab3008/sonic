package com.aftab005.sonic.features.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

/**
 * Featured album showcase at the top of the Home screen.
 *
 * [onPlay] is called for both singles and albums — the caller (HomeScreen) decides
 * whether to auto-play (Single) or navigate to album detail (Album).
 */
@Composable
fun FeaturedShowcase(
    album: AlbumCard?,
    onPlay: () -> Unit,
    modifier: Modifier = Modifier,
) {
    if (album == null) return

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = SonicTheme.dimensions.screenPadding)
            .aspectRatio(if (SonicTheme.dimensions.maxContentWidth != androidx.compose.ui.unit.Dp.Unspecified) 1.5f else 0.8f)
            .clip(RoundedCornerShape(24.scaled))
            .background(SonicTheme.colors.surfaceContainer),
    ) {
        AsyncImage(
            model = album.coverImageUrl,
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
        )
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Transparent,
                            Color.Black.copy(alpha = 0.4f),
                            Color.Black.copy(alpha = 0.95f),
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(24.scaled),
        ) {
            Text(
                text = if (album.isSingle) "NEW SINGLE" else "FEATURED ALBUM",
                color = SonicTheme.colors.primary,
                fontSize = 10.mTextScaled,
                fontWeight = FontWeight.ExtraBold,
                letterSpacing = 2.sp,
                modifier = Modifier.padding(bottom = 8.vScaled),
            )

            Text(
                text = album.title,
                color = Color.White,
                fontSize = 32.mTextScaled,
                fontWeight = FontWeight.Black,
                letterSpacing = (-1).sp,
                lineHeight = 38.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(bottom = 4.vScaled),
            )

            Text(
                text = album.artists?.firstOrNull()?.artist?.name ?: "Featured Artist",
                color = Color.White.copy(alpha = 0.7f),
                fontSize = 16.mTextScaled,
                fontWeight = FontWeight.Medium,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier = Modifier.padding(bottom = 24.vScaled),
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.scaled),
            ) {
                Row(
                    modifier = Modifier
                        .weight(1f)
                        .height(52.scaled)
                        .clip(RoundedCornerShape(14.scaled))
                        .background(
                            Brush.horizontalGradient(
                                listOf(SonicTheme.colors.primary, SonicTheme.colors.primaryContainer)
                            )
                        )
                        .clickable { onPlay() },
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        imageVector = if (album.isSingle) Icons.Default.PlayArrow else Icons.Default.List,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(20.scaled),
                    )
                    Spacer(modifier = Modifier.width(8.scaled))
                    Text(
                        text = if (album.isSingle) "Listen Now" else "View Album",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.mTextScaled,
                    )
                }

                Box(
                    modifier = Modifier
                        .size(52.scaled)
                        .clip(RoundedCornerShape(14.scaled))
                        .background(Color.White.copy(alpha = 0.15f))
                        .border(
                            width = 1.scaled,
                            color = Color.White.copy(alpha = 0.2f),
                            shape = RoundedCornerShape(14.scaled),
                        )
                        .clickable { /* Add to library — future feature */ },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        imageVector = Icons.Default.PlayArrow,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(24.scaled),
                    )
                }
            }
        }
    }
}
