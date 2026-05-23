package com.aftab005.sonic.features.search.ui.components.content

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.layout.*
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.aftab005.sonic.core.ui.theme.*
import com.aftab005.sonic.features.search.presentation.SearchFilter
import com.aftab005.sonic.features.search.presentation.SearchUiState
@Composable
fun SearchFilterSection(
    state: SearchUiState,
    onFilterSelect: (SearchFilter) -> Unit,
    modifier: Modifier = Modifier,
) {
    val chipColors = remember(SonicTheme.colors.primary) {
        null
    }
    val primaryColor = SonicTheme.colors.primary

    AnimatedVisibility(visible = state.hasSearched || state.isLoading) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(8.scaled),
            modifier = modifier
                .fillMaxWidth()
                .padding(horizontal = 16.scaled)
                .padding(bottom = 4.vScaled),
        ) {
            SearchFilter.entries.forEach { filter ->
                key(filter) {
                    FilterChip(
                        selected = state.activeFilter == filter,
                        onClick = { onFilterSelect(filter) },
                        label = {
                            Text(
                                text = filter.label,
                                fontSize = 12.mTextScaled,
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = primaryColor,
                            selectedLabelColor = Color.White,
                        ),
                        modifier = Modifier.height(32.vScaled),
                    )
                }
            }
        }
    }
}