package com.aftab005.sonic.features.auth.ui.login

import com.aftab005.sonic.features.auth.ui.common.AuthBackButton
import com.aftab005.sonic.features.auth.ui.common.AuthTextField
import com.aftab005.sonic.features.auth.ui.common.GradientButton
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.material.icons.outlined.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.LoginViewModel

@Composable
fun LoginStepTwo(
    state: com.aftab005.sonic.features.auth.presentation.LoginUiState,
    viewModel: LoginViewModel
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.mScaled)) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.mScaled)
        ) {
            AuthBackButton(onClick = viewModel::onBackClicked)
        }

        Column(modifier = Modifier.padding(start = 2.mScaled)) {
            Text(
                text = "WELCOME BACK",
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
                text = "Password",
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
                text = "Signing in as ${state.email}",
                color = Color.White.copy(alpha = 0.4f),
                fontSize = 13.mTextScaled,
                fontWeight = FontWeight.W500
            )
        }

        Spacer(Modifier.height(8.mScaled))

        if (state.serverError != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 1.dp,
                        color = SonicTheme.colors.error.copy(alpha = 0.3f),
                        shape = RoundedCornerShape(12.mScaled)
                    )
                    .background(
                        SonicTheme.colors.errorContainer.copy(alpha = 0.10f),
                        RoundedCornerShape(12.mScaled)
                    )
                    .padding(12.mScaled),
                horizontalArrangement = Arrangement.spacedBy(10.mScaled),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Outlined.Warning,
                    contentDescription = null,
                    tint = SonicTheme.colors.error,
                    modifier = Modifier.size(16.mScaled)
                )
                Text(
                    text = state.serverError,
                    color = SonicTheme.colors.error,
                    fontSize = 13.mTextScaled,
                    fontWeight = FontWeight.W600
                )
            }
        }

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
                        contentDescription = if (state.isPasswordVisible) "Hide password" else "Show password",
                        tint = Color.White.copy(alpha = 0.5f),
                        modifier = Modifier.size(20.mScaled)
                    )
                }
            }
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.End
        ) {
            Text(
                text = "FORGOT PASSWORD?",
                color = Color(0xFF8B5CF6).copy(alpha = 0.7f),
                fontSize = 10.mTextScaled,
                fontWeight = FontWeight.W700,
                letterSpacing = 0.5.sp
            )
        }

        Spacer(Modifier.height(4.mScaled))

        GradientButton(
            title = "SIGN IN",
            isLoading = state.isLoading,
            enabled = !state.isLoading,
            onClick = viewModel::onSignInClicked
        )
    }
}
