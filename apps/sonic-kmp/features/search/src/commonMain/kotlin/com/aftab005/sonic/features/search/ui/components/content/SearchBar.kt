package com.aftab005.sonic.features.search.ui.components.content

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Clear
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
    val surfaceColor = SonicTheme.colors.surface
    val primaryColor = SonicTheme.colors.primary
    val onSurfaceColor = SonicTheme.colors.onSurface
    val hintColor = remember(onSurfaceColor) {
        onSurfaceColor.copy(alpha = 0.5f)
    }

    TextField(
        value = query,
        onValueChange = onQueryChange,
        modifier = modifier.heightIn(min = 48.vScaled),
        placeholder = {
            Text(
                text = "Search songs, albums, artists…",
                color = hintColor,
                fontSize = 14.mTextScaled,
            )
        },
        leadingIcon = {
            Icon(
                imageVector = Icons.Default.Search,
                contentDescription = "Search",
                tint = hintColor,
                modifier = Modifier.size(18.scaled),
            )
        },
        trailingIcon = {
            AnimatedVisibility(
                visible = query.isNotEmpty(),
                enter = fadeIn(),
                exit = fadeOut(),
            ) {
                IconButton(onClick = onClear) {
                    Icon(
                        imageVector = Icons.Default.Clear,
                        contentDescription = "Clear search",
                        modifier = Modifier.size(18.scaled),
                    )
                }
            }
        },
        singleLine = true,
        shape = RoundedCornerShape(12.scaled),
        colors = TextFieldDefaults.colors(
            focusedContainerColor   = surfaceColor,
            unfocusedContainerColor = surfaceColor,
            focusedIndicatorColor   = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent,
            cursorColor             = primaryColor,
        ),
    )
}