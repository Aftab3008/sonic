package com.aftab005.sonic.features.player.ui

import androidx.compose.animation.*
import androidx.compose.animation.core.FastOutSlowInEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.zIndex
import com.aftab005.sonic.core.ui.components.BackHandler
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.features.player.PlayerScreen


@Composable
fun PlayerSheet(
    visible: Boolean,
    onDismiss: () -> Unit
) {
    BackHandler(enabled = visible) {
        onDismiss()
    }

    AnimatedVisibility(
        visible = visible,
        enter = slideInVertically(
            initialOffsetY = { fullHeight -> fullHeight },
            animationSpec = tween(durationMillis = 400, easing = FastOutSlowInEasing)
        ) + fadeIn(animationSpec = tween(durationMillis = 200)),
        exit = slideOutVertically(
            targetOffsetY = { fullHeight -> fullHeight },
            animationSpec = tween(durationMillis = 350, easing = FastOutSlowInEasing)
        ) + fadeOut(animationSpec = tween(durationMillis = 200)),
        modifier = Modifier
            .fillMaxSize()
            .zIndex(100f)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(SonicTheme.colors.background)
        ) {
            PlayerScreen(onBack = onDismiss)
        }
    }
}
