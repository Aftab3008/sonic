package com.aftab005.sonic.features.auth

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled

/**
 * Gradient pill button — KMP equivalent of Expo's GradientButton component.
 *
 * Features:
 *   - Gradient background using SonicTheme primary colors
 *   - Loading state with CircularProgressIndicator
 *   - Disabled state with reduced opacity
 *   - Pill shape (fully rounded corners)
 *   - Scaled dimensions matching Expo parity
 */
@Composable
fun GradientButton(
    title: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    isLoading: Boolean = false,
    enabled: Boolean = true
) {
    val alpha by animateColorAsState(
        targetValue = if (enabled && !isLoading) Color.White else Color.White.copy(alpha = 0.4f),
        animationSpec = tween(200),
        label = "button_alpha"
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
            .height(54.mScaled)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .height(54.mScaled)
                .clip(RoundedCornerShape(50))
                .background(
                    brush = Brush.horizontalGradient(
                        colors = if (enabled && !isLoading) listOf(
                            SonicTheme.colors.primaryContainer,
                            SonicTheme.colors.primary
                        ) else listOf(
                            SonicTheme.colors.primaryContainer.copy(alpha = 0.4f),
                            SonicTheme.colors.primary.copy(alpha = 0.4f)
                        )
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
                    color = alpha,
                    fontSize = 15.mTextScaled,
                    fontWeight = FontWeight.W800,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}
