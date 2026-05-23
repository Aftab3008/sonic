package com.aftab005.sonic.features.home.ui.components.content

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import com.aftab005.sonic.core.ui.components.VanguardSectionHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled


private data class MoodItem(
    val label: String,
    val icon: ImageVector,
    val isActive: Boolean,
)

@Composable
fun MoodGrid(
    modifier: Modifier = Modifier,
) {
    val moods = remember {
        listOf(
            MoodItem("Chill",   Icons.Outlined.Spa,           isActive = true),
            MoodItem("Energy",  Icons.Outlined.FlashOn,       isActive = false),
            MoodItem("Deep",    Icons.Outlined.NightsStay,    isActive = false),
            MoodItem("Workout", Icons.Outlined.FitnessCenter, isActive = false),
            MoodItem("Focus",   Icons.Outlined.Terminal,      isActive = false),
        )
    }

    Column(modifier = modifier.fillMaxWidth()) {
        VanguardSectionHeader(title = "Your mood")

        Spacer(modifier = Modifier.height(SonicTheme.dimensions.cardSpacing))

        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = SonicTheme.dimensions.screenPadding),
            horizontalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing),
            verticalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing),
        ) {
            moods.forEach { mood ->
                MoodButton(mood)
            }
        }
    }
}

@Composable
private fun MoodButton(mood: MoodItem) {
    val colors = SonicTheme.colors

    val bgColor = remember(mood.isActive, colors.primaryContainer) {
        if (mood.isActive) colors.primaryContainer.copy(alpha = 0.18f)
        else Color.White.copy(alpha = 0.05f)
    }
    val borderColor = remember(mood.isActive, colors.primaryContainer) {
        if (mood.isActive) colors.primaryContainer.copy(alpha = 0.4f)
        else Color.Transparent
    }
    val iconTint = remember(mood.isActive, colors.primary, colors.onSurfaceVariant) {
        if (mood.isActive) colors.primary else colors.onSurfaceVariant
    }
    val textColor = iconTint

    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(12.scaled))
            .background(bgColor)
            .border(
                width = 1.scaled,
                color = borderColor,
                shape = RoundedCornerShape(12.scaled),
            )
            .clickable { /* Haptic feedback & logic */ }
            .padding(horizontal = 16.scaled, vertical = 10.scaled),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.scaled),
    ) {
        Icon(
            imageVector = mood.icon,
            contentDescription = null,
            modifier = Modifier.size(16.scaled),
            tint = iconTint,
        )
        Text(
            text = mood.label,
            color = textColor,
            fontSize = 13.mTextScaled,
            fontWeight = FontWeight.SemiBold,
        )
    }
}
