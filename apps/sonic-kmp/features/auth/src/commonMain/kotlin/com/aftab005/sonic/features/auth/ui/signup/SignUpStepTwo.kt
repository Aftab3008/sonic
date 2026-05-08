package com.aftab005.sonic.features.auth.ui.signup

import androidx.compose.foundation.background
import com.aftab005.sonic.features.auth.ui.common.AuthBackButton
import com.aftab005.sonic.features.auth.ui.common.AuthTextField
import com.aftab005.sonic.features.auth.ui.common.GradientButton
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.SignUpUiState
import com.aftab005.sonic.features.auth.presentation.SignUpViewModel
import com.aftab005.sonic.features.auth.theme.CosmicViolet
import com.aftab005.sonic.features.auth.theme.CosmicVioletSoft


@Composable
fun SignUpStepTwo(
    state: SignUpUiState,
    viewModel: SignUpViewModel
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.mScaled)) {
        AuthBackButton(onClick = viewModel::onBackClicked)

        Column(modifier = Modifier.padding(start = 2.mScaled)) {
            Text(
                text = "LOCK IT DOWN",
                color = Color.White.copy(alpha = 0.3f),
                fontSize = 10.mTextScaled,
                fontWeight = FontWeight.W800,
                letterSpacing = 3.sp
            )
            Spacer(Modifier.height(4.mScaled))
            Text(
                text = "Your",
                color = Color.White,
                fontSize = 36.mTextScaled,
                fontWeight = FontWeight.W900,
                letterSpacing = (-1.5).sp,
                lineHeight = 38.mTextScaled
            )
            Text(
                text = "Security",
                style = TextStyle(
                    brush = Brush.horizontalGradient(
                        colors = listOf(CosmicViolet, CosmicVioletSoft)
                    ),
                    fontSize = 36.mTextScaled,
                    fontWeight = FontWeight.W900,
                    letterSpacing = (-1.5).sp,
                    lineHeight = 38.mTextScaled
                )
            )
        }

        Spacer(Modifier.height(8.mScaled))

        AuthTextField(
            value = state.password,
            onValueChange = viewModel::onPasswordChanged,
            label = "Password",
            placeholder = "••••••••",
            errorMessage = state.passwordError,
            visualTransformation = if (state.isPasswordVisible) VisualTransformation.None
            else PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            trailingIcon = {
                IconButton(onClick = viewModel::togglePasswordVisibility) {
                    Icon(
                        imageVector = if (state.isPasswordVisible) Icons.Outlined.VisibilityOff
                        else Icons.Outlined.Visibility,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.5f),
                        modifier = Modifier.size(20.mScaled)
                    )
                }
            }
        )

        if (state.password.isNotEmpty()) {
            PasswordStrengthBar(password = state.password)
        }

        AuthTextField(
            value = state.confirmPassword,
            onValueChange = viewModel::onConfirmPasswordChanged,
            label = "Confirm Password",
            placeholder = "••••••••",
            errorMessage = state.confirmPasswordError,
            visualTransformation = if (state.isConfirmPasswordVisible) VisualTransformation.None
            else PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
            trailingIcon = {
                IconButton(onClick = viewModel::toggleConfirmPasswordVisibility) {
                    Icon(
                        imageVector = if (state.isConfirmPasswordVisible) Icons.Outlined.VisibilityOff
                        else Icons.Outlined.Visibility,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.5f),
                        modifier = Modifier.size(20.mScaled)
                    )
                }
            }
        )

        Spacer(Modifier.height(4.mScaled))

        GradientButton(
            title = "CONTINUE  →",
            enabled = true,
            onClick = viewModel::onContinueFromStep2
        )
    }
}
@Composable
private fun PasswordStrengthBar(password: String) {
    val strength = when {
        password.length >= 12 && password.any { it.isUpperCase() } && password.any { !it.isLetterOrDigit() } -> 4
        password.length >= 8 && password.any { it.isUpperCase() } -> 3
        password.length >= 8 -> 2
        else -> 1
    }

    val activeColor = when (strength) {
        4 -> Color(0xFF22C55E)
        3 -> CosmicViolet
        2 -> Color(0xFFF59E0B)
        else -> Color(0xFFEF4444)
    }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 14.mScaled),
        horizontalArrangement = Arrangement.spacedBy(3.mScaled)
    ) {
        for (i in 1..4) {
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(3.dp)
                    .background(
                        if (i <= strength) activeColor else Color.White.copy(alpha = 0.1f),
                        RoundedCornerShape(2.dp)
                    )
            )
        }
    }
}


