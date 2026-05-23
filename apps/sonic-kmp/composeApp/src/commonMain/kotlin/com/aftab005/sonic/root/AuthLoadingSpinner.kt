package com.aftab005.sonic.root

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import org.jetbrains.compose.resources.painterResource
import sonic.composeapp.generated.resources.Res
import sonic.composeapp.generated.resources.sonic_logo

@Composable
fun AuthLoadingSpinner() {
    Column(
        modifier = Modifier.fillMaxSize().background(SonicTheme.colors.background),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center,
    ) {
        Image(
            painter = painterResource(Res.drawable.sonic_logo),
            contentDescription = "Sonic",
            modifier = Modifier.size(160.mScaled),
        )
        Spacer(modifier = Modifier.height(32.mScaled))
        CircularProgressIndicator(
            color = SonicTheme.colors.primary,
            modifier = Modifier.size(32.mScaled),
        )
    }
}
