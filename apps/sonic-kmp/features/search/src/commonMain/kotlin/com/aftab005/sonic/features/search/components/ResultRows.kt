package com.aftab005.sonic.features.search.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
                text = song.artists.joinToString(", "),
                style = MaterialTheme.typography.bodySmall,
                color = SonicTheme.colors.onBackground.copy(alpha = 0.6f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                fontSize = 13.mTextScaled,
            )
        }
        song.durationMs?.let { ms ->
            Text(
                text = formatDuration(ms),
                style = MaterialTheme.typography.bodySmall,
                color = SonicTheme.colors.onBackground.copy(alpha = 0.5f),
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
                    text = album.albumType.replaceFirstChar { it.uppercase() },
                    style = MaterialTheme.typography.labelSmall,
                    color = SonicTheme.colors.primary,
                    modifier = Modifier
                        .background(
                            SonicTheme.colors.primary.copy(alpha = 0.15f),
                            RoundedCornerShape(4.scaled),
                        )
                        .padding(horizontal = 4.scaled, vertical = 2.vScaled),
                    fontSize = 10.mTextScaled,
                )
                Spacer(modifier = Modifier.width(6.scaled))
                Text(
                    text = album.artists.joinToString(", "),
                    style = MaterialTheme.typography.bodySmall,
                    color = SonicTheme.colors.onBackground.copy(alpha = 0.6f),
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
            if (artist.monthlyListeners > 0) {
                Text(
                    text = "${formatListeners(artist.monthlyListeners)} monthly listeners",
                    style = MaterialTheme.typography.bodySmall,
                    color = SonicTheme.colors.onBackground.copy(alpha = 0.6f),
                    fontSize = 13.mTextScaled,
                )
            }
        }
    }
}
