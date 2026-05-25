package com.aftab005.sonic.features.discovery.ui.components.content

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme

@Composable
fun DiscoveryLoadingState() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(color = SonicTheme.colors.primary)
    }
}

@Composable
fun DiscoveryErrorState(
    message: String,
    onRetry: () -> Unit
) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = message,
                color = SonicTheme.colors.onBackground.copy(alpha = 0.7f),
                fontSize = 16.sp
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Retry",
                color = SonicTheme.colors.primary,
                fontWeight = FontWeight.Bold,
                modifier = Modifier
                    .clickable {
                        onRetry()
                    }
                    .padding(8.dp)
            )
        }
    }
}
