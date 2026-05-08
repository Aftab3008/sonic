package com.aftab005.sonic.features.auth.ui.login

import com.aftab005.sonic.features.auth.ui.common.AuthTextField
import com.aftab005.sonic.features.auth.ui.common.GradientButton
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.LoginViewModel



@Composable
fun LoginStepOne(
    state: com.aftab005.sonic.features.auth.presentation.LoginUiState,
    viewModel: LoginViewModel
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.mScaled)) {
        Column(modifier = Modifier.padding(start = 2.mScaled)) {
            Text(
                text = "TUNE INTO",
                color = Color.White.copy(alpha = 0.3f),
                fontSize = 10.mTextScaled,
                fontWeight = FontWeight.W800,
                letterSpacing = 3.sp
            )
            Spacer(Modifier.height(4.mScaled))
            Text(
                text = "Welcome to",
                color = Color.White,
                fontSize = 36.mTextScaled,
                fontWeight = FontWeight.W900,
                letterSpacing = (-1.5).sp,
                lineHeight = 38.mTextScaled
            )
            Text(
                text = "Sonic",
                style = androidx.compose.ui.text.TextStyle(
                    brush = Brush.horizontalGradient(
                        colors = listOf(Color(0xFF8B5CF6), Color(0xFFA78BFA))
                    ),
                    fontSize = 36.mTextScaled,
                    fontWeight = FontWeight.W900,
                    letterSpacing = (-1.5).sp,
                    lineHeight = 38.mTextScaled
                )
            )
            Spacer(Modifier.height(8.mScaled))
            Text(
                text = "Enter your email to continue your sonic journey.",
                color = Color.White.copy(alpha = 0.4f),
                fontSize = 14.mTextScaled,
                fontWeight = FontWeight.W500,
                lineHeight = 22.mTextScaled
            )
        }

        Spacer(Modifier.height(8.mScaled))

        AuthTextField(
            value = state.email,
            onValueChange = viewModel::onEmailChanged,
            label = "Email Address",
            placeholder = "name@example.com",
            errorMessage = state.emailError,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
        )

        Spacer(Modifier.height(4.mScaled))

        GradientButton(
            title = "CONTINUE  →",
            isLoading = false,
            enabled = true,
            onClick = viewModel::onContinueClicked
        )
    }
}

