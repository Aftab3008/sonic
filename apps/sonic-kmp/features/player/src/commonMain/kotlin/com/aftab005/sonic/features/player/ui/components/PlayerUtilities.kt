package com.aftab005.sonic.features.player.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.theme.*

@Composable
fun PlayerUtilities(modifier: Modifier = Modifier) {
    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.mScaled)
    ) {
        UtilityButton(
            icon = { Icon(Icons.Default.MusicNote, null, tint = SonicTheme.colors.onSurface, modifier = Modifier.size(18.mScaled)) },
            label = "Lyrics",
            modifier = Modifier.weight(1f)
        )
        UtilityButton(
            icon = { Icon(Icons.Default.List, null, tint = SonicTheme.colors.onSurface, modifier = Modifier.size(18.mScaled)) },
            label = "Up Next",
            modifier = Modifier.weight(1f)
        )
    }
}

@Composable
private fun UtilityButton(
    icon: @Composable () -> Unit,
    label: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .heightIn(min = 50.vScaled)
            .clip(RoundedCornerShape(100.mScaled))
            .border(0.5.dp, SonicTheme.colors.primary, RoundedCornerShape(100.mScaled))
            .background(SonicTheme.colors.surface.copy(alpha = 0.8f))
            .border(1.dp, Color.White.copy(alpha = 0.1f), RoundedCornerShape(100.mScaled))
            .clickable { },
        contentAlignment = Alignment.Center
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.mScaled),
            modifier = Modifier.padding(horizontal = 16.mScaled)
        ) {
            icon()
            Text(
                text = label,
                color = SonicTheme.colors.onSurface,
                fontWeight = FontWeight.Bold,
                fontSize = 13.mTextScaled,
                letterSpacing = 0.2.mTextScaled
            )
        }
    }
}
