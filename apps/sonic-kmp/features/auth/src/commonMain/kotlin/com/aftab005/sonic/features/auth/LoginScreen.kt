package com.aftab005.sonic.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material.icons.outlined.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.aftab005.sonic.core.auth.AuthViewModel
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled

/**
 * Login screen — KMP port of the Expo LoginScreen + LoginForm.
 *
 * Implements pixel-perfect scaling and styling matching the Expo reference.
 */
@Composable
fun LoginScreen(
    authViewModel: AuthViewModel,
    onNavigateToSignUp: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var serverError by remember { mutableStateOf<String?>(null) }

    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }

    fun validate(): Boolean {
        emailError = if (email.isBlank()) "Email is required"
        else if (!email.contains("@")) "Enter a valid email address"
        else null

        passwordError = if (password.isBlank()) "Password is required"
        else null

        return emailError == null && passwordError == null
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
                    text = "TUNE INTO",
                    color = Color.White,
                    fontSize = 44.mTextScaled,
                    fontWeight = FontWeight.W900,
                    lineHeight = 40.mTextScaled,
                    letterSpacing = (-2.5).sp
                )
                Text(
                    text = "SONIC",
                    color = Color.White,
                    fontSize = 44.mTextScaled,
                    fontWeight = FontWeight.W900,
                    lineHeight = 40.mTextScaled,
                    letterSpacing = (-2.5).sp
                )
                Spacer(Modifier.height(16.mScaled))
                Text(
                    text = "Enter the Sonic prism and resume your musical journey.",
                    color = Color.White.copy(alpha = 0.5f),
                    fontSize = 16.mTextScaled,
                    fontWeight = FontWeight.W600,
                    lineHeight = 24.mTextScaled
                )
            }

            Spacer(Modifier.height(32.mScaled))

            Column(verticalArrangement = Arrangement.spacedBy(16.mScaled)) {

                if (serverError != null) {
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
                            text = serverError!!,
                            color = SonicTheme.colors.error,
                            fontSize = 14.mTextScaled,
                            fontWeight = FontWeight.W600
                        )
                    }
                }

                AuthTextField(
                    value = email,
                    onValueChange = { email = it; serverError = null; emailError = null },
                    label = "Email Address",
                    placeholder = "name@example.com",
                    errorMessage = emailError,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )

                AuthTextField(
                    value = password,
                    onValueChange = { password = it; serverError = null; passwordError = null },
                    label = "Password",
                    placeholder = "••••••••",
                    errorMessage = passwordError,
                    visualTransformation = if (showPassword) VisualTransformation.None
                    else PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    trailingIcon = {
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(
                                imageVector = if (showPassword) Icons.Outlined.VisibilityOff
                                else Icons.Outlined.Visibility,
                                contentDescription = if (showPassword) "Hide password" else "Show password",
                                tint = Color.White.copy(alpha = 0.6f),
                                modifier = Modifier.size(20.mScaled)
                            )
                        }
                    }
                )

                Spacer(Modifier.height(4.mScaled))

                GradientButton(
                    title = "Sign In",
                    isLoading = isLoading,
                    enabled = !isLoading,
                    onClick = {
                        if (validate()) {
                            isLoading = true
                            serverError = null
                            authViewModel.signIn(
                                email = email.trim(),
                                password = password,
                                onError = { message ->
                                    serverError = message
                                    isLoading = false
                                }
                            )
                        }
                    }
                )
            }

            Spacer(Modifier.height(24.mScaled))

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.Center,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "DON'T HAVE AN ACCOUNT?  ",
                        color = Color.White.copy(alpha = 0.4f),
                        fontSize = 12.mTextScaled,
                        fontWeight = FontWeight.W800,
                        letterSpacing = 1.2.sp
                    )
                    TextButton(onClick = onNavigateToSignUp) {
                        Text(
                            text = "JOIN US",
                            color = SonicTheme.colors.primary,
                            fontSize = 12.mTextScaled,
                            fontWeight = FontWeight.W900,
                            letterSpacing = 1.2.sp
                        )
                    }
                }

                Spacer(Modifier.height(16.mScaled))

                Row(
                    horizontalArrangement = Arrangement.spacedBy(16.mScaled),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "PRIVACY",
                        color = Color.White.copy(alpha = 0.3f),
                        fontSize = 9.mTextScaled,
                        fontWeight = FontWeight.W900,
                        letterSpacing = 2.sp
                    )
                    Box(
                        modifier = Modifier
                            .size(2.mScaled)
                            .background(Color.White.copy(alpha = 0.3f))
                    )
                    Text(
                        text = "TERMS",
                        color = Color.White.copy(alpha = 0.3f),
                        fontSize = 9.mTextScaled,
                        fontWeight = FontWeight.W900,
                        letterSpacing = 2.sp
                    )
                }
            }
        }
    }
}
