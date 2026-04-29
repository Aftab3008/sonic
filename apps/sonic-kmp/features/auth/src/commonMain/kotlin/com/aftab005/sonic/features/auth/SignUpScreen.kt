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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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
import com.aftab005.sonic.core.auth.AuthViewModel
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled

/**
 * Sign-up screen — exact KMP match of the Expo SignUpScreen + SignUpForm.
 *
 * Implements pixel-perfect scaling and styling matching the Expo reference.
 */
@Composable
fun SignUpScreen(
    authViewModel: AuthViewModel,
    onNavigateToLogin: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirmPassword by remember { mutableStateOf("") }
    var termsAccepted by remember { mutableStateOf(false) }

    var showPassword by remember { mutableStateOf(false) }
    var showConfirmPassword by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var serverError by remember { mutableStateOf<String?>(null) }


    var nameError by remember { mutableStateOf<String?>(null) }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }
    var confirmPasswordError by remember { mutableStateOf<String?>(null) }
    var termsError by remember { mutableStateOf<String?>(null) }

    fun validate(): Boolean {
        nameError = if (name.isBlank()) "Full name is required" else null
        emailError = if (email.isBlank()) "Email is required"
        else if (!email.contains("@") || !email.contains(".")) "Enter a valid email address"
        else null
        passwordError = if (password.length < 8) "Password must be at least 8 characters" else null
        confirmPasswordError = if (password != confirmPassword) "Passwords do not match" else null
        termsError = if (!termsAccepted) "You must agree to the terms to continue" else null
        return nameError == null && emailError == null && passwordError == null &&
                confirmPasswordError == null && termsError == null
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
                    value = name,
                    onValueChange = { name = it; nameError = null },
                    label = "Full Name",
                    placeholder = "Enter your name",
                    errorMessage = nameError,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Text,
                        capitalization = KeyboardCapitalization.Words
                    )
                )

                AuthTextField(
                    value = email,
                    onValueChange = { email = it; emailError = null },
                    label = "Email Address",
                    placeholder = "hello@example.com",
                    errorMessage = emailError,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email)
                )

                AuthTextField(
                    value = password,
                    onValueChange = { password = it; passwordError = null },
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
                                contentDescription = null,
                                tint = Color.White.copy(alpha = 0.6f),
                                modifier = Modifier.size(20.mScaled)
                            )
                        }
                    }
                )

                AuthTextField(
                    value = confirmPassword,
                    onValueChange = { confirmPassword = it; confirmPasswordError = null },
                    label = "Confirm Password",
                    placeholder = "••••••••",
                    errorMessage = confirmPasswordError,
                    visualTransformation = if (showConfirmPassword) VisualTransformation.None
                    else PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    trailingIcon = {
                        IconButton(onClick = { showConfirmPassword = !showConfirmPassword }) {
                            Icon(
                                imageVector = if (showConfirmPassword) Icons.Outlined.VisibilityOff
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
                            .clickable { termsAccepted = !termsAccepted; termsError = null }
                            .padding(vertical = 8.mScaled, horizontal = 4.mScaled),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.mScaled)
                    ) {
                        Icon(
                            imageVector = if (termsAccepted) Icons.Outlined.CheckBox
                            else Icons.Outlined.CheckBoxOutlineBlank,
                            contentDescription = "Accept terms",
                            tint = if (termsAccepted) SonicTheme.colors.primary
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
                    if (termsError != null) {
                        Text(
                            text = termsError!!,
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
                    isLoading = isLoading,
                    enabled = !isLoading,
                    onClick = {
                        if (validate()) {
                            isLoading = true
                            serverError = null
                            authViewModel.signUp(
                                email = email.trim(),
                                password = password,
                                name = name.trim(),
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
                TextButton(onClick = onNavigateToLogin) {
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
