package com.aftab005.sonic.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CheckBox
import androidx.compose.material.icons.outlined.CheckBoxOutlineBlank
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material.icons.outlined.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.SignUpUiEffect
import com.aftab005.sonic.features.auth.presentation.SignUpViewModel
import org.koin.compose.viewmodel.koinViewModel

/**
 * Sign-up screen — exact KMP match of the Expo SignUpScreen + SignUpForm.
 *
 * Implements pixel-perfect scaling and styling matching the Expo reference.
 */
@Composable
fun SignUpScreen(
    viewModel: SignUpViewModel = koinViewModel(),
    onNavigateToLogin: () -> Unit
) {
    val state by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.uiEffect.collect { effect ->
            when (effect) {
                is SignUpUiEffect.NavigateToLogin -> onNavigateToLogin()
            }
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        SonicTheme.colors.background,
                        SonicTheme.colors.surfaceContainerLowest
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.mScaled, vertical = 40.mScaled),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.padding(start = 4.mScaled)) {
                Text(
                    text = "CREATE",
                    color = Color.White,
                    fontSize = 44.mTextScaled,
                    fontWeight = FontWeight.W900,
                    lineHeight = 40.mTextScaled,
                    letterSpacing = (-2.5).sp
                )
                Text(
                    text = "YOUR WAVE",
                    color = Color.White,
                    fontSize = 44.mTextScaled,
                    fontWeight = FontWeight.W900,
                    lineHeight = 40.mTextScaled,
                    letterSpacing = (-2.5).sp
                )
                Spacer(Modifier.height(16.mScaled))
                Text(
                    text = "Join the Sonic prism and define your sound today.",
                    color = Color.White.copy(alpha = 0.5f),
                    fontSize = 16.mTextScaled,
                    fontWeight = FontWeight.W600,
                    lineHeight = 24.mTextScaled
                )
            }

            Spacer(Modifier.height(28.mScaled))

            Column(verticalArrangement = Arrangement.spacedBy(16.mScaled)) {

                if (state.serverError != null) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .border(
                                width = 1.dp,
                                color = SonicTheme.colors.error.copy(alpha = 0.3f),
                                shape = RoundedCornerShape(14.mScaled)
                            )
                            .background(
                                SonicTheme.colors.errorContainer.copy(alpha = 0.12f),
                                RoundedCornerShape(14.mScaled)
                            )
                            .padding(14.mScaled),
                        horizontalArrangement = Arrangement.spacedBy(10.mScaled),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Outlined.Warning,
                            contentDescription = null,
                            tint = SonicTheme.colors.error,
                            modifier = Modifier.size(18.mScaled)
                        )
                        Text(
                            text = state.serverError!!,
                            color = SonicTheme.colors.error,
                            fontSize = 14.mTextScaled,
                            fontWeight = FontWeight.W600
                        )
                    }
                }

                AuthTextField(
                    value = state.name,
                    onValueChange = viewModel::onNameChanged,
                    label = "Full Name",
                    placeholder = "Enter your name",
                    errorMessage = state.nameError,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Text,
                        capitalization = KeyboardCapitalization.Words
                    )
                )

                AuthTextField(
                    value = state.email,
                    onValueChange = viewModel::onEmailChanged,
                    label = "Email Address",
                    placeholder = "hello@example.com",
                    errorMessage = state.emailError,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )

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
                                tint = Color.White.copy(alpha = 0.6f),
                                modifier = Modifier.size(20.mScaled)
                            )
                        }
                    }
                )

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
                                tint = Color.White.copy(alpha = 0.6f),
                                modifier = Modifier.size(20.mScaled)
                            )
                        }
                    }
                )

                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { viewModel.onTermsAcceptedChanged(!state.termsAccepted) }
                            .padding(vertical = 8.mScaled, horizontal = 4.mScaled),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.mScaled)
                    ) {
                        Icon(
                            imageVector = if (state.termsAccepted) Icons.Outlined.CheckBox
                            else Icons.Outlined.CheckBoxOutlineBlank,
                            contentDescription = "Accept terms",
                            tint = if (state.termsAccepted) SonicTheme.colors.primary
                            else Color.White.copy(alpha = 0.4f),
                            modifier = Modifier.size(20.mScaled)
                        )
                        Text(
                            text = buildAnnotatedString {
                                withStyle(SpanStyle(color = Color.White.copy(alpha = 0.7f))) {
                                    append("I agree to the ")
                                }
                                withStyle(
                                    SpanStyle(
                                        color = Color.White,
                                        fontWeight = FontWeight.W700
                                    )
                                ) {
                                    append("Terms of Service")
                                }
                                withStyle(SpanStyle(color = Color.White.copy(alpha = 0.7f))) {
                                    append(" and ")
                                }
                                withStyle(
                                    SpanStyle(
                                        color = Color.White,
                                        fontWeight = FontWeight.W700
                                    )
                                ) {
                                    append("Privacy Policy")
                                }
                            },
                            fontSize = 13.mTextScaled,
                            lineHeight = 19.mTextScaled
                        )
                    }
                    if (state.termsError != null) {
                        Text(
                            text = state.termsError!!,
                            color = SonicTheme.colors.error,
                            fontSize = 12.mTextScaled,
                            fontWeight = FontWeight.W500,
                            modifier = Modifier.padding(start = 8.mScaled, top = 2.mScaled)
                        )
                    }
                }

                Spacer(Modifier.height(4.mScaled))

                GradientButton(
                    title = "Join Sonic",
                    isLoading = state.isLoading,
                    enabled = !state.isLoading,
                    onClick = viewModel::onSignUpClicked
                )
            }

            Spacer(Modifier.height(24.mScaled))

            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "ALREADY PART OF THE WAVE?  ",
                    color = Color.White.copy(alpha = 0.4f),
                    fontSize = 12.mTextScaled,
                    fontWeight = FontWeight.W800,
                    letterSpacing = 1.2.sp
                )
                TextButton(onClick = viewModel::onLoginClicked) {
                    Text(
                        text = "LOG IN",
                        color = SonicTheme.colors.primary,
                        fontSize = 12.mTextScaled,
                        fontWeight = FontWeight.W900,
                        letterSpacing = 1.2.sp
                    )
                }
            }
        }
    }
}
