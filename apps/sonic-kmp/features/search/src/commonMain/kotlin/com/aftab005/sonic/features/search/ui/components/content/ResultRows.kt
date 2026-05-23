package com.aftab005.sonic.features.search.ui.components.content

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.network.models.SearchAlbumResult
import com.aftab005.sonic.core.network.models.SearchArtistResult
import com.aftab005.sonic.core.network.models.SearchSongResult
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.search.util.formatDuration
import com.aftab005.sonic.features.search.util.formatListeners

@Composable
fun SongRow(
    song: SearchSongResult,
    onTap: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val artistText    = remember(song.id) { song.artists.joinToString(", ") }

    val durationText  = remember(song.durationMs) { song.durationMs?.let { formatDuration(it) } }

    val onBackground = SonicTheme.colors.onBackground
    val artistColor   = remember(onBackground) {
        onBackground.copy(alpha = 0.6f)
    }
    val durationColor = remember(onBackground) {
        onBackground.copy(alpha = 0.5f)
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onTap)
            .padding(horizontal = 16.scaled, vertical = 8.vScaled),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AsyncImage(
            model = song.coverImageUrl,
            contentDescription = song.title,
            modifier = Modifier
                .size(48.scaled)
                .clip(RoundedCornerShape(8.scaled))
                .background(SonicTheme.colors.surface),
            contentScale = ContentScale.Crop,
        )
        Spacer(modifier = Modifier.width(12.scaled))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = song.title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = SonicTheme.colors.onBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 15.mTextScaled,
            )
            Text(
                text = artistText,
                style = MaterialTheme.typography.bodySmall,
                color = artistColor,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 13.mTextScaled,
            )
        }
        if (durationText != null) {
            Text(
                text = durationText,
                style = MaterialTheme.typography.bodySmall,
                color = durationColor,
                fontSize = 12.mTextScaled,
            )
        }
    }
}

@Composable
fun AlbumRow(
    album: SearchAlbumResult,
    onTap: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val artistText  = remember(album.id) { album.artists.joinToString(", ") }

    val typeLabel   = remember(album.id) { album.albumType.replaceFirstChar { it.uppercase() } }

    val colors = SonicTheme.colors
    val badgeBg     = remember(colors.primary) {
        colors.primary.copy(alpha = 0.15f)
    }
    val subtitleColor = remember(colors.onBackground) {
        colors.onBackground.copy(alpha = 0.6f)
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .clickable(onClick = onTap)
            .padding(horizontal = 16.scaled, vertical = 8.vScaled),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AsyncImage(
            model = album.coverImageUrl,
            contentDescription = album.title,
            modifier = Modifier
                .size(56.scaled)
                .clip(RoundedCornerShape(8.scaled))
                .background(SonicTheme.colors.surface),
            contentScale = ContentScale.Crop,
        )
        Spacer(modifier = Modifier.width(12.scaled))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = album.title,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.SemiBold,
                color = SonicTheme.colors.onBackground,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 15.mTextScaled,
            )
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = typeLabel,
                    style = MaterialTheme.typography.labelSmall,
                    color = SonicTheme.colors.primary,
                    modifier = Modifier
                        .background(badgeBg, RoundedCornerShape(4.scaled))  // FIX 6 applied
                        .padding(horizontal = 4.scaled, vertical = 2.vScaled),
                    fontSize = 10.mTextScaled,
                )
                Spacer(modifier = Modifier.width(6.scaled))
                Text(
                    text = artistText,
                    style = MaterialTheme.typography.bodySmall,
                    color = subtitleColor,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    fontSize = 13.mTextScaled,
                )
            }
        }
    }
}

@Composable
fun ArtistRow(
    artist: SearchArtistResult,
    modifier: Modifier = Modifier,
) {
    val listenersText = remember(artist.id, artist.monthlyListeners) {
        if (artist.monthlyListeners > 0)
            "${formatListeners(artist.monthlyListeners)} monthly listeners"
        else null
    }

    val onBackground = SonicTheme.colors.onBackground
    val subtitleColor = remember(onBackground) {
        onBackground.copy(alpha = 0.6f)
    }

    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.scaled, vertical = 8.vScaled),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        AsyncImage(
            model = artist.imageUrl,
            contentDescription = artist.name,
            modifier = Modifier
                .size(48.scaled)
                .clip(CircleShape)
                .background(SonicTheme.colors.surface),
            contentScale = ContentScale.Crop,
        )
        Spacer(modifier = Modifier.width(12.scaled))
        Column(modifier = Modifier.weight(1f)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = artist.name,
                    style = MaterialTheme.typography.bodyMedium,
                    fontWeight = FontWeight.SemiBold,
                    color = SonicTheme.colors.onBackground,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    fontSize = 15.mTextScaled,
                )
                if (artist.isVerified) {
                    Spacer(modifier = Modifier.width(4.scaled))
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = "Verified",
                        tint = SonicTheme.colors.primary,
                        modifier = Modifier.size(14.scaled),
                    )
                }
            }
            if (listenersText != null) {
                Text(
                    text = listenersText,
                    style = MaterialTheme.typography.bodySmall,
                    color = subtitleColor,
                    fontSize = 13.mTextScaled,
                )
            }
        }
    }
}