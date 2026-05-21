package com.aftab005.sonic.features.search.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.aftab005.sonic.core.ui.theme.*

@Composable
fun SearchBar(
    query: String,
    onQueryChange: (String) -> Unit,
    onClear: () -> Unit,
    modifier: Modifier = Modifier,
) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier.height(48.vScaled),
        placeholder = {
            Text(
                "Search songs, albums, artists…",
                color = SonicTheme.colors.onSurface.copy(alpha = 0.5f),
                fontSize = 14.mTextScaled,
            )
        },
        leadingIcon = {
            Icon(
                Icons.Default.Search,
                contentDescription = "Search",
                tint = SonicTheme.colors.onSurface.copy(alpha = 0.5f),
                modifier = Modifier.size(18.scaled)
            )
        },
        trailingIcon = {
            AnimatedVisibility(visible = query.isNotEmpty(), enter = fadeIn(), exit = fadeOut()) {
                IconButton(onClick = onClear) {
                    Icon(
                        Icons.Default.Clear,
                        contentDescription = "Clear search",
                        modifier = Modifier.size(18.scaled)
                    )
                }
            }
        },
        singleLine = true,
        shape = RoundedCornerShape(12.scaled),
        colors = TextFieldDefaults.colors(
            focusedContainerColor = SonicTheme.colors.surface,
            unfocusedContainerColor = SonicTheme.colors.surface,
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent,
            cursorColor = SonicTheme.colors.primary,
        ),
    )
}
