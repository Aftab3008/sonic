package com.aftab005.sonic.core.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled

@Composable
fun VanguardSectionHeader(
        title: String,
        modifier: Modifier = Modifier,
        actionText: String = "See All",
        onSeeAllClick: (() -> Unit)? = null
) {
    Row(
            modifier = modifier.fillMaxWidth().padding(horizontal = 20.scaled),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
                text = title,
                color = SonicTheme.colors.onBackground,
                fontSize = 22.mTextScaled,
                fontWeight = FontWeight.Bold,
                letterSpacing = (-0.5).sp
        )

        if (onSeeAllClick != null) {
            Text(
                    text = actionText,
                    color = SonicTheme.colors.primary,
                    fontSize = 14.mTextScaled,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable { onSeeAllClick() }
            )
        }
    }
}
