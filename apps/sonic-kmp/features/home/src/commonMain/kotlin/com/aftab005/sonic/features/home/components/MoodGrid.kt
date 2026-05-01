package com.aftab005.sonic.features.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.components.VanguardSectionHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

data class MoodItem(
    val label: String,
    val icon: ImageVector,
    val isActive: Boolean
)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun MoodGrid(
    modifier: Modifier = Modifier
) {
    val moods = listOf(
        MoodItem("Chill", Icons.Outlined.Spa, true),
        MoodItem("Energy", Icons.Outlined.FlashOn, false),
        MoodItem("Deep", Icons.Outlined.NightsStay, false),
        MoodItem("Workout", Icons.Outlined.FitnessCenter, false),
        MoodItem("Focus", Icons.Outlined.Terminal, false)
    )

    Column(modifier = modifier.fillMaxWidth()) {
        VanguardSectionHeader(title = "Your mood")
        
        Spacer(modifier = Modifier.height(16.vScaled))

        FlowRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.scaled),
            horizontalArrangement = Arrangement.spacedBy(12.scaled),
            verticalArrangement = Arrangement.spacedBy(12.scaled)
        ) {
            moods.forEach { mood ->
                MoodButton(mood)
            }
        }
    }
}

@Composable
private fun MoodButton(mood: MoodItem) {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(12.dp))
            .background(
                if (mood.isActive) SonicTheme.colors.primaryContainer.copy(alpha = 0.18f)
                else Color.White.copy(alpha = 0.05f)
            )
            .border(
                width = 1.dp,
                color = if (mood.isActive) SonicTheme.colors.primaryContainer.copy(alpha = 0.4f)
                else Color.Transparent,
                shape = RoundedCornerShape(12.dp)
            )
            .clickable { /* Haptic feedback & logic */ }
            .padding(horizontal = 16.scaled, vertical = 10.scaled),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.scaled)
    ) {
        Icon(
            imageVector = mood.icon,
            contentDescription = null,
            modifier = Modifier.size(16.scaled),
            tint = if (mood.isActive) SonicTheme.colors.primary else SonicTheme.colors.onSurfaceVariant
        )
        Text(
            text = mood.label,
            color = if (mood.isActive) SonicTheme.colors.primary else SonicTheme.colors.onSurfaceVariant,
            fontSize = 13.mTextScaled,
            fontWeight = FontWeight.SemiBold
        )
    }
}
