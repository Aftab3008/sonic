package com.aftab005.sonic.features.search.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyItemScope
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.aftab005.sonic.core.ui.theme.*

@Composable
fun LazyItemScope.SearchIdleState(
    modifier: Modifier = Modifier,
) {
    Box(modifier = modifier.fillParentMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                Icons.Default.Search,
                contentDescription = null,
                tint = SonicTheme.colors.onBackground.copy(alpha = 0.3f),
                modifier = Modifier.size(64.scaled),
            )
            Spacer(modifier = Modifier.height(12.vScaled))
            Text(
                text = "Search for songs, albums, and artists",
                style = MaterialTheme.typography.bodyMedium,
                color = SonicTheme.colors.onBackground.copy(alpha = 0.4f),
                fontSize = 15.mTextScaled,
            )
        }
    }
}

@Composable
fun LazyItemScope.SearchLoadingState(
    modifier: Modifier = Modifier,
) {
    Box(modifier = modifier.fillParentMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(
            color = SonicTheme.colors.primary,
            modifier = Modifier.size(32.scaled)
        )
    }
}

@Composable
fun LazyItemScope.SearchEmptyState(
    query: String,
    modifier: Modifier = Modifier,
) {
    Box(modifier = modifier.fillParentMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "No results for \"$query\"",
                style = MaterialTheme.typography.bodyLarge,
                fontWeight = FontWeight.SemiBold,
                color = SonicTheme.colors.onBackground,
                fontSize = 18.mTextScaled,
            )
            Spacer(modifier = Modifier.height(8.vScaled))
            Text(
                text = "Try a different spelling or keyword",
                style = MaterialTheme.typography.bodyMedium,
                color = SonicTheme.colors.onBackground.copy(alpha = 0.5f),
                fontSize = 15.mTextScaled,
            )
        }
    }
}

@Composable
fun LazyItemScope.SearchErrorState(
    message: String,
    modifier: Modifier = Modifier,
) {
    Box(modifier = modifier.fillParentMaxSize(), contentAlignment = Alignment.Center) {
        Text(
            text = message,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.error,
            fontSize = 15.mTextScaled,
        )
    }
}
