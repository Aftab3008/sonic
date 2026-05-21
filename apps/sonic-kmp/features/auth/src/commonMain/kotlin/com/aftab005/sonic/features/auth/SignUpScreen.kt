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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.SignUpUiEffect
import com.aftab005.sonic.features.auth.presentation.SignUpViewModel
import com.aftab005.sonic.features.auth.theme.CosmicBgEnd
import com.aftab005.sonic.features.auth.theme.CosmicBgMid
import com.aftab005.sonic.features.auth.theme.CosmicBgStart
import com.aftab005.sonic.features.auth.theme.CosmicBlue
import com.aftab005.sonic.features.auth.theme.CosmicViolet
import com.aftab005.sonic.features.auth.theme.CosmicVioletDark
import com.aftab005.sonic.features.auth.theme.CosmicVioletSoft
import com.aftab005.sonic.features.auth.ui.common.StepDotIndicator
import com.aftab005.sonic.features.auth.ui.signup.SignUpStepOne
import com.aftab005.sonic.features.auth.ui.signup.SignUpStepThree
import com.aftab005.sonic.features.auth.ui.signup.SignUpStepTwo
import org.koin.compose.viewmodel.koinViewModel

@Composable
fun SignUpScreen(
    signUpViewModel: SignUpViewModel = koinViewModel(),
    onNavigateToLogin: () -> Unit
) {
    val state by signUpViewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        signUpViewModel.uiEffect.collect { effect ->
            when (effect) {
                is SignUpUiEffect.NavigateToLogin -> onNavigateToLogin()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.linearGradient(
                    colors = listOf(CosmicBgStart, CosmicBgMid, CosmicBgEnd),
                    start = Offset(0f, 0f),
                    end = Offset(400f, 900f)
                )
            )
    ) {
        Box(
            modifier = Modifier
                .size(200.mScaled)
                .offset(x = 120.mScaled, y = (-50).mScaled)
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
                .size(150.mScaled)
                .align(Alignment.BottomStart)
                .offset(x = (-30).mScaled, y = (-100).mScaled)
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
                .size(100.mScaled)
                .align(Alignment.CenterEnd)
                .offset(x = 20.mScaled, y = 40.mScaled)
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            CosmicVioletSoft.copy(alpha = 0.15f),
                            Color.Transparent
                        )
                    ),
                    shape = RoundedCornerShape(50)
                )
                .blur(20.mScaled)
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
                    totalSteps = 3,
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
                    label = "signup_step"
                ) { step ->
                    when (step) {
                        1 -> SignUpStepOne(state = state, signUpViewModel)
                        2 -> SignUpStepTwo(state = state, signUpViewModel)
                        3 -> SignUpStepThree(state = state, signUpViewModel)
                    }
                }

                Spacer(Modifier.height(32.mScaled))

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "ALREADY A MEMBER?  ",
                        color = Color.White.copy(alpha = 0.35f),
                        fontSize = 11.mTextScaled,
                        fontWeight = FontWeight.W700,
                        letterSpacing = 1.sp
                    )
                    TextButton(onClick = signUpViewModel::onLoginClicked) {
                        Text(
                            text = "LOG IN",
                            color = CosmicViolet,
                            fontSize = 11.mTextScaled,
                            fontWeight = FontWeight.W900,
                            letterSpacing = 1.sp
                        )
                    }
                }
            }
        }
    }
}
