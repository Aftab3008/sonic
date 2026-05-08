package com.aftab005.sonic.features.auth.presentation

import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.ui.presentation.BaseViewModel

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val currentStep: Int = 1,
    val isLoading: Boolean = false,
    val emailError: String? = null,
    val passwordError: String? = null,
    val serverError: String? = null,
    val isPasswordVisible: Boolean = false
)

sealed class LoginUiEffect {
    object NavigateToSignUp : LoginUiEffect()
}

class LoginViewModel(
    private val authViewModel: AuthViewModel
) : BaseViewModel<LoginUiState, LoginUiEffect>(LoginUiState()) {

    fun onEmailChanged(email: String) {
        updateState { it.copy(email = email, emailError = null, serverError = null) }
    }

    fun onPasswordChanged(password: String) {
        updateState { it.copy(password = password, passwordError = null, serverError = null) }
    }

    fun togglePasswordVisibility() {
        updateState { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun onSignUpClicked() {
        emitEffect(LoginUiEffect.NavigateToSignUp)
    }

    fun onContinueClicked() {
        if (!validateStep1()) return
        updateState { it.copy(currentStep = 2, emailError = null) }
    }

    fun onBackClicked() {
        updateState { it.copy(currentStep = 1, serverError = null, passwordError = null) }
    }

    fun onSignInClicked() {
        if (!validateStep2()) return
        updateState { it.copy(isLoading = true, serverError = null) }
        authViewModel.signIn(
            email = uiState.value.email.trim(),
            password = uiState.value.password,
            onError = { error ->
                updateState { it.copy(isLoading = false, serverError = error) }
            }
        )
    }

    private fun validateStep1(): Boolean {
        val email = uiState.value.email
        val emailError = when {
            email.isBlank() -> "Email is required"
            !email.contains("@") -> "Enter a valid email address"
            else -> null
        }
        updateState { it.copy(emailError = emailError) }
        return emailError == null
    }

    private fun validateStep2(): Boolean {
        val password = uiState.value.password
        val passwordError = if (password.isBlank()) "Password is required" else null
        updateState { it.copy(passwordError = passwordError) }
        return passwordError == null
    }
}
