package com.aftab005.sonic.features.discovery.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.aftab005.sonic.core.auth.presentation.AuthState
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.ui.components.ErrorView
import com.aftab005.sonic.core.ui.components.PageHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.vScaled
import com.aftab005.sonic.features.discovery.presentation.DiscoveryIntent
import com.aftab005.sonic.features.discovery.presentation.DiscoveryUiState
import com.aftab005.sonic.features.discovery.presentation.DiscoveryViewModel
import com.aftab005.sonic.features.discovery.ui.components.content.DiscoveryLoadingState
import com.aftab005.sonic.features.discovery.ui.components.content.DiscoveryResultsGrid

@Composable
fun DiscoveryScreenContent(
    discoveryViewModel: DiscoveryViewModel,
    authViewModel: AuthViewModel,
    onGenreClick: (slug: String, name: String) -> Unit,
) {
    val discoveryUiState by discoveryViewModel.uiState.collectAsStateWithLifecycle()
    val authState by authViewModel.authState.collectAsStateWithLifecycle()

    val scrollState = rememberLazyGridState()
    val isExpanded = SonicTheme.dimensions.gridColumns > 2

    val scrollY by remember {
        derivedStateOf {
            if (scrollState.firstVisibleItemIndex == 0)
                scrollState.firstVisibleItemScrollOffset.toFloat()
            else
                1000f
        }
    }
    val user = (authState as? AuthState.Authenticated)?.user
    val profileImageUrl = remember(user) { user?.displayAvatarUrl }

    val primaryColor = SonicTheme.colors.primary
    val bgColor = SonicTheme.colors.background

    val gradientBrush = remember(primaryColor, bgColor) {
        Brush.verticalGradient(
            colors = listOf(
                primaryColor.copy(alpha = 0.15f),
                bgColor,
            )
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(SonicTheme.colors.background)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(if (isExpanded) 300.vScaled else 400.vScaled)
                .background(gradientBrush)
        )

        Column(modifier = Modifier.fillMaxSize()) {
            Spacer(
                modifier = Modifier.height(
                    SonicTheme.dimensions.topContentPadding + 28.vScaled
                )
            )

            Text(
                text = "Explore Genres",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = SonicTheme.colors.onBackground,
                modifier = Modifier
                    .padding(horizontal = SonicTheme.dimensions.screenPadding)
                    .padding(bottom = 16.dp)
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                when (val state = discoveryUiState) {

                    is DiscoveryUiState.Loading -> {
                        DiscoveryLoadingState()
                    }
                    is DiscoveryUiState.Error -> {
                        ErrorView(
                            message = state.message,
                            onRetry = {
                                discoveryViewModel.handleIntent(
                                    DiscoveryIntent.LoadGenre
                                )
                            }
                        )
                    }
                    is DiscoveryUiState.Success -> {
                        DiscoveryResultsGrid(
                            genres = state.data.genres,
                            scrollState = scrollState,
                            isExpanded = isExpanded,
                            onGenreClick = onGenreClick
                        )
                    }
                    else -> {}
                }
            }
        }

        PageHeader(
            title = "Discovery",
            scrollY = scrollY,
            modifier = Modifier.align(Alignment.TopCenter),
            showNotifications = false,
            profileImageUrl = profileImageUrl
        )
    }
}
