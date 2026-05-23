package com.aftab005.sonic.features.home.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun OfflineView(
    message: String,
    onRetry: () -> Unit,
) {
    val maxContentWidth = SonicTheme.dimensions.maxContentWidth
        .takeIf { it != Dp.Companion.Unspecified } ?: 400.scaled

    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Companion.Center) {
        Column(
            modifier = Modifier
                .widthIn(max = maxContentWidth)
                .padding(horizontal = SonicTheme.dimensions.screenPadding)
                .padding(top = 100.vScaled),
            horizontalAlignment = Alignment.Companion.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
        ) {
            Icon(
                imageVector = Icons.Default.WifiOff,
                contentDescription = null,
                modifier = Modifier.size(80.scaled),
                tint = SonicTheme.colors.primary.copy(alpha = 0.6f),
            )

            Spacer(modifier = Modifier.height(24.vScaled))

            Text(
                text = "Something went wrong",
                color = Color.White,
                fontSize = 24.mTextScaled,
                fontWeight = FontWeight.Companion.Bold,
                textAlign = TextAlign.Companion.Center,
            )

            Spacer(modifier = Modifier.height(12.vScaled))

            Text(
                text = message,
                color = Color.White.copy(alpha = 0.6f),
                fontSize = 16.mTextScaled,
                textAlign = TextAlign.Companion.Center,
                lineHeight = 22.sp,
            )

            Spacer(modifier = Modifier.height(40.vScaled))

            Button(
                onClick = onRetry,
                colors = ButtonDefaults.buttonColors(
                    containerColor = SonicTheme.colors.primary,
                    contentColor = Color.White,
                ),
                shape = RoundedCornerShape(12.scaled),
                modifier = Modifier
                    .height(52.vScaled)
                    .fillMaxWidth(),
            ) {
                Text(
                    text = "Try Again",
                    fontSize = 16.mTextScaled,
                    fontWeight = FontWeight.Companion.Bold,
                )
            }
        }
    }
}