package com.aftab005.sonic.features.auth

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.LoginUiEffect
import com.aftab005.sonic.features.auth.presentation.LoginViewModel
import com.aftab005.sonic.features.auth.theme.CosmicBgEnd
import com.aftab005.sonic.features.auth.theme.CosmicBgMid
import com.aftab005.sonic.features.auth.theme.CosmicBgStart
import com.aftab005.sonic.features.auth.theme.CosmicBlue
import com.aftab005.sonic.features.auth.theme.CosmicViolet
import com.aftab005.sonic.features.auth.theme.CosmicVioletDark
import com.aftab005.sonic.features.auth.ui.common.StepDotIndicator
import com.aftab005.sonic.features.auth.ui.login.LoginStepOne
import com.aftab005.sonic.features.auth.ui.login.LoginStepTwo
import org.koin.compose.viewmodel.koinViewModel


@Composable
fun LoginScreen(
    viewModel: LoginViewModel = koinViewModel(),
    onNavigateToSignUp: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.uiEffect.collect { effect ->
            when (effect) {
                is LoginUiEffect.NavigateToSignUp -> onNavigateToSignUp()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(CosmicBgStart, CosmicBgMid, CosmicBgEnd),
                    start = androidx.compose.ui.geometry.Offset(0f, 0f),
                    end = androidx.compose.ui.geometry.Offset(400f, 900f)
                )
            )
    ) {
        Box(
            modifier = Modifier
                .size(200.mScaled)
                .offset(x = 100.mScaled, y = (-60).mScaled)
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            CosmicVioletDark.copy(alpha = 0.35f),
                            Color.Transparent
                        )
                    ),
                    shape = RoundedCornerShape(50)
                )
                .blur(40.mScaled)
        )

        Box(
            modifier = Modifier
                .size(160.mScaled)
                .align(Alignment.BottomStart)
                .offset(x = (-40).mScaled, y = (-80).mScaled)
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            CosmicBlue.copy(alpha = 0.25f),
                            Color.Transparent
                        )
                    ),
                    shape = RoundedCornerShape(50)
                )
                .blur(30.mScaled)
        )

        Box(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = SonicTheme.dimensions.screenPadding, vertical = 48.mScaled),
            contentAlignment = Alignment.Center
        ) {
            val maxAuthWidth = SonicTheme.dimensions.maxContentWidth.takeIf { it != androidx.compose.ui.unit.Dp.Unspecified } ?: 400.dp
            
            Column(
                modifier = Modifier
                    .widthIn(max = maxAuthWidth)
                    .fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                StepDotIndicator(
                    totalSteps = 2,
                    currentStep = state.currentStep,
                    modifier = Modifier
                        .align(Alignment.Start)
                        .padding(bottom = 28.mScaled)
                )

                AnimatedContent(
                    targetState = state.currentStep,
                    transitionSpec = {
                        val entering = if (targetState > initialState) 1 else -1
                        (slideInHorizontally { it * entering } + fadeIn()) togetherWith
                            (slideOutHorizontally { it * -entering } + fadeOut())
                    },
                    label = "login_step"
                ) { step ->
                    when (step) {
                        1 -> LoginStepOne(state = state, viewModel = viewModel)
                        2 -> LoginStepTwo(state = state, viewModel = viewModel)
                    }
                }

                Spacer(Modifier.height(32.mScaled))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "DON'T HAVE AN ACCOUNT?  ",
                        color = Color.White.copy(alpha = 0.35f),
                        fontSize = 11.mTextScaled,
                        fontWeight = FontWeight.W700,
                        letterSpacing = 1.sp
                    )
                    TextButton(onClick = viewModel::onSignUpClicked) {
                        Text(
                            text = "JOIN US",
                            color = CosmicViolet,
                            fontSize = 11.mTextScaled,
                            fontWeight = FontWeight.W900,
                            letterSpacing = 1.sp
                        )
                    }
                }
            }

            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 8.mScaled),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.mScaled),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "PRIVACY",
                        color = Color.White.copy(alpha = 0.2f),
                        fontSize = 9.mTextScaled,
                        fontWeight = FontWeight.W800,
                        letterSpacing = 2.sp
                    )
                    Box(
                        modifier = Modifier
                            .size(2.mScaled)
                            .background(Color.White.copy(alpha = 0.2f))
                    )
                    Text(
                        text = "TERMS",
                        color = Color.White.copy(alpha = 0.2f),
                        fontSize = 9.mTextScaled,
                        fontWeight = FontWeight.W800,
                        letterSpacing = 2.sp
                    )
                }
            }
        }
    }
}