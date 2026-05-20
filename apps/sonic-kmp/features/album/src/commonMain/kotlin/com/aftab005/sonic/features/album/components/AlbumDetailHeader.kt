package com.aftab005.sonic.features.album.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.AlbumDetail
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun AlbumDetailHeader(
    album: AlbumDetail,
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .height(380.vScaled),
    ) {
        AsyncImage(
            model = album.coverImageUrl,
            contentDescription = album.title,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
        )

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colorStops = arrayOf(
                            0.0f to Color.Black.copy(alpha = 0.0f),
                            0.4f to Color.Black.copy(alpha = 0.2f),
                            0.7f to Color.Black.copy(alpha = 0.7f),
                            1.0f to SonicTheme.colors.background,
                        )
                    )
                )
        )

        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(horizontal = SonicTheme.dimensions.screenPadding)
                .padding(bottom = 24.vScaled),
        ) {
            AlbumTypeBadge(albumType = album.albumType)

            Spacer(modifier = Modifier.height(12.vScaled))
            Text(
                text = album.title,
                color = Color.White,
                fontSize = 32.mTextScaled,
                fontWeight = FontWeight.Black,
                letterSpacing = (-1.0).sp,
                lineHeight = 38.sp,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
            )

            Spacer(modifier = Modifier.height(6.vScaled))

            val artistNames = album.artists
                ?.joinToString(", ") { it.artist.name }
                ?: "Unknown Artist"
            Text(
                text = artistNames,
                color = Color.White.copy(alpha = 0.9f),
                fontSize = 16.mTextScaled,
                fontWeight = FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )

            Spacer(modifier = Modifier.height(6.vScaled))

            val year = album.releaseDate?.take(4) ?: ""
            val trackInfo = "${album.tracks.size} track${if (album.tracks.size != 1) "s" else ""}"
            Text(
                text = if (year.isNotEmpty()) "$year • $trackInfo" else trackInfo,
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 13.mTextScaled,
                fontWeight = FontWeight.Medium,
            )
        }
    }
}

@Composable
private fun AlbumTypeBadge(albumType: String) {
    val label = when (albumType) {
        "SINGLE" -> "SINGLE"
        "EP" -> "EP"
        "COMPILATION" -> "COMPILATION"
        else -> "ALBUM"
    }
    val color = when (albumType) {
        "SINGLE" -> SonicTheme.colors.tertiary
        "EP" -> SonicTheme.colors.secondary
        else -> SonicTheme.colors.primary
    }

    Box(
        modifier = Modifier
            .background(color = color.copy(alpha = 0.25f), shape = RoundedCornerShape(6.scaled))
            .padding(horizontal = 10.scaled, vertical = 4.scaled),
    ) {
        Text(
            text = label,
            color = color,
            fontSize = 9.mTextScaled,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 1.5.sp,
        )
    }
}
