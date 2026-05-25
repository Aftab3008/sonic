package com.aftab005.sonic.features.search.ui.components.content

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import com.aftab005.sonic.core.ui.theme.*


@Composable
fun SearchIdleState(
    modifier: Modifier = Modifier,
) {
    val onBackground = SonicTheme.colors.onBackground
    val iconTint = remember(onBackground) {
        onBackground.copy(alpha = 0.3f)
    }
    val textColor = remember(onBackground) {
        onBackground.copy(alpha = 0.4f)
    }

    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = null,
                tint = iconTint,
                modifier = Modifier.size(64.scaled),
            )
            Spacer(modifier = Modifier.height(12.vScaled))
            Text(
                text = "Search for songs, albums, and artists",
                style = MaterialTheme.typography.bodyMedium,
                color = textColor,
                fontSize = 15.mTextScaled,
            )
        }
    }
}

@Composable
fun SearchLoadingState(
    modifier: Modifier = Modifier,
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
        CircularProgressIndicator(
            color = SonicTheme.colors.primary,
            modifier = Modifier.size(32.scaled),
        )
    }
}

@Composable
fun SearchEmptyState(
    query: String,
    modifier: Modifier = Modifier,
) {
    val onBackground = SonicTheme.colors.onBackground
    val subtitleColor = remember(onBackground) {
        onBackground.copy(alpha = 0.5f)
    }

    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center,
    ) {
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
                color = subtitleColor,
                fontSize = 15.mTextScaled,
            )
        }
    }
}

