package com.aftab005.sonic.features.search.components

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.aftab005.sonic.core.network.models.SearchAlbumResult
import com.aftab005.sonic.core.network.models.SearchSongResult
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.search.presentation.SearchUiState

@Composable
fun SearchResultsList(
    state: SearchUiState,
    onSongTap: (SearchSongResult) -> Unit,
    onAlbumTap: (SearchAlbumResult) -> Unit,
    modifier: Modifier = Modifier,
) {
    LazyColumn(
        contentPadding = PaddingValues(bottom = 100.vScaled),
        modifier = modifier.fillMaxSize(),
    ) {
        if (state.songs.isNotEmpty()) {
            item {
                SectionHeader(title = "Songs", count = state.songs.size)
            }
            items(state.songs, key = { "song_${it.id}" }) { song ->
                SongRow(song = song, onTap = { onSongTap(song) })
            }
        }

        if (state.albums.isNotEmpty()) {
            item {
                SectionHeader(title = "Albums", count = state.albums.size)
            }
            items(state.albums, key = { "album_${it.id}" }) { album ->
                AlbumRow(album = album, onTap = { onAlbumTap(album) })
            }
        }

        if (state.artists.isNotEmpty()) {
            item {
                SectionHeader(title = "Artists", count = state.artists.size)
            }
            items(state.artists, key = { "artist_${it.id}" }) { artist ->
                ArtistRow(artist = artist)
            }
        }
    }
}

@Composable
private fun SectionHeader(title: String, count: Int) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.scaled, vertical = 8.vScaled),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(
            text = title,
            style = MaterialTheme.typography.titleSmall,
            fontWeight = FontWeight.Bold,
            color = SonicTheme.colors.onBackground,
            fontSize = 14.mTextScaled,
        )
        Spacer(modifier = Modifier.width(8.scaled))
        Text(
            text = count.toString(),
            style = MaterialTheme.typography.bodySmall,
            color = SonicTheme.colors.onBackground.copy(alpha = 0.5f),
            fontSize = 12.mTextScaled,
        )
    }
}
