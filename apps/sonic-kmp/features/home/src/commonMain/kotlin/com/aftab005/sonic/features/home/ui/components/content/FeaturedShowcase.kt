package com.aftab005.sonic.features.home.ui.components.content

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.AlbumCard
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled


@Composable
fun FeaturedShowcase(
    album: AlbumCard?,
    onPlay: () -> Unit,
    modifier: Modifier = Modifier,
) {
    if (album == null) return

    val colors = SonicTheme.colors
    val dimensions = SonicTheme.dimensions

    val isExpanded = dimensions.maxContentWidth != Dp.Unspecified

    val label       = remember(album.id) { if (album.isSingle) "NEW SINGLE" else "FEATURED ALBUM" }
    val buttonText  = remember(album.id) { if (album.isSingle) "Listen Now" else "View Album" }
    val artistName  = remember(album.id) {
        album.artists?.firstOrNull()?.artist?.name ?: "Featured Artist"
    }

    val overlayBrush = remember {
        Brush.verticalGradient(
            colors = listOf(
                Color.Transparent,
                Color.Black.copy(alpha = 0.4f),
                Color.Black.copy(alpha = 0.95f),
            )
        )
    }
    val buttonBrush = remember(colors.primary, colors.primaryContainer) {
        Brush.horizontalGradient(
            listOf(colors.primary, colors.primaryContainer)
        )
    }

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = dimensions.screenPadding)
            .aspectRatio(if (isExpanded) 1.5f else 0.8f)
            .clip(RoundedCornerShape(24.scaled))
            .background(colors.surfaceContainer),
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
                .background(overlayBrush),
        )

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(24.scaled),
        ) {
            Text(
                text = label,
                color = colors.primary,
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
                text = artistName,
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
                        .background(buttonBrush)
                        .clickable(onClick = onPlay),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                ) {
                    Icon(
                        imageVector = if (album.isSingle) Icons.Default.PlayArrow
                        else Icons.AutoMirrored.Filled.List,
                        contentDescription = null,
                        tint = Color.White,
                        modifier = Modifier.size(20.scaled),
                    )
                    Spacer(modifier = Modifier.width(8.scaled))
                    Text(
                        text = buttonText,
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