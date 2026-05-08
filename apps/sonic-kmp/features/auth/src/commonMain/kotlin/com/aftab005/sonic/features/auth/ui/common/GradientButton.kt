package com.aftab005.sonic.features.auth.ui.common

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.theme.CosmicViolet
import com.aftab005.sonic.features.auth.theme.CosmicVioletDark


@Composable
fun GradientButton(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    val textAlpha by animateColorAsState(
        targetValue = if (enabled && !isLoading) Color.White else Color.White.copy(alpha = 0.4f),
        animationSpec = tween(200),
        label = "button_text_alpha"
    )

    val activeGradient = listOf(CosmicVioletDark, CosmicViolet)
    val dimmedGradient = listOf(
        CosmicVioletDark.copy(alpha = 0.4f),
        CosmicViolet.copy(alpha = 0.4f)
    )

    Button(
        onClick = { if (!isLoading) onClick() },
        enabled = enabled && !isLoading,
        shape = RoundedCornerShape(50),
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.Transparent,
            disabledContainerColor = Color.Transparent
        ),
        contentPadding = PaddingValues(0.dp),
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 54.scaled) // Use heightIn and .scaled
            .shadow(
                elevation = if (enabled && !isLoading) 16.dp else 0.dp,
                shape = RoundedCornerShape(50),
                ambientColor = CosmicVioletDark.copy(alpha = 0.4f),
                spotColor = CosmicViolet.copy(alpha = 0.4f)
            )
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 54.scaled) // Use heightIn and .scaled
                .clip(RoundedCornerShape(50))
                .background(
                    brush = Brush.linearGradient(
                        colors = if (enabled && !isLoading) activeGradient else dimmedGradient
                    )
                )
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    color = Color.White,
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(22.mScaled)
                )
            } else {
                Text(
                    text = title,
                    color = textAlpha,
                    fontSize = 14.mTextScaled,
                    fontWeight = FontWeight.W800,
                    letterSpacing = 1.sp
                )
            }
        }
    }
}
