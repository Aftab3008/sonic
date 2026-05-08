package com.aftab005.sonic.features.auth.presentation

import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.ui.presentation.BaseViewModel

data class SignUpUiState(
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val termsAccepted: Boolean = false,
    val currentStep: Int = 1,
    val isLoading: Boolean = false,
    val nameError: String? = null,
    val emailError: String? = null,
    val passwordError: String? = null,
    val confirmPasswordError: String? = null,
    val termsError: String? = null,
    val serverError: String? = null,
    val isPasswordVisible: Boolean = false,
    val isConfirmPasswordVisible: Boolean = false
)

sealed class SignUpUiEffect {
    object NavigateToLogin : SignUpUiEffect()
}

class SignUpViewModel(
    private val authViewModel: AuthViewModel
) : BaseViewModel<SignUpUiState, SignUpUiEffect>(SignUpUiState()) {

    fun onNameChanged(name: String) {
        updateState { it.copy(name = name, nameError = null) }
    }

    fun onEmailChanged(email: String) {
        updateState { it.copy(email = email, emailError = null, serverError = null) }
    }

    fun onPasswordChanged(password: String) {
        updateState { it.copy(password = password, passwordError = null, serverError = null) }
    }

    fun onConfirmPasswordChanged(password: String) {
        updateState { it.copy(confirmPassword = password, confirmPasswordError = null) }
    }

    fun onTermsAcceptedChanged(accepted: Boolean) {
        updateState { it.copy(termsAccepted = accepted, termsError = null) }
    }

    fun togglePasswordVisibility() {
        updateState { it.copy(isPasswordVisible = !it.isPasswordVisible) }
    }

    fun toggleConfirmPasswordVisibility() {
        updateState { it.copy(isConfirmPasswordVisible = !it.isConfirmPasswordVisible) }
    }

    fun onLoginClicked() {
        emitEffect(SignUpUiEffect.NavigateToLogin)
    }

    fun onBackClicked() {
        val current = uiState.value.currentStep
        if (current > 1) {
            updateState {
                it.copy(
                    currentStep = current - 1,
                    serverError = null,
                    passwordError = null,
                    confirmPasswordError = null,
                    termsError = null
                )
            }
        }
    }

    fun onContinueFromStep1() {
        if (!validateStep1()) return
        updateState { it.copy(currentStep = 2, nameError = null, emailError = null) }
    }

    fun onContinueFromStep2() {
        if (!validateStep2()) return
        updateState { it.copy(currentStep = 3, passwordError = null, confirmPasswordError = null) }
    }

    fun onSignUpClicked() {
        if (!validateStep3()) return
        updateState { it.copy(isLoading = true, serverError = null) }
        authViewModel.signUp(
            email = uiState.value.email.trim(),
            password = uiState.value.password,
            name = uiState.value.name.trim(),
            onError = { error ->
                updateState { it.copy(isLoading = false, serverError = error) }
            }
        )
    }

    private fun validateStep1(): Boolean {
        val name = uiState.value.name
        val email = uiState.value.email
        val nameError = if (name.isBlank()) "Full name is required" else null
        val emailError = when {
            email.isBlank() -> "Email is required"
            !email.contains("@") || !email.contains(".") -> "Enter a valid email address"
            else -> null
        }
        updateState { it.copy(nameError = nameError, emailError = emailError) }
        return nameError == null && emailError == null
    }

    private fun validateStep2(): Boolean {
        val password = uiState.value.password
        val confirmPassword = uiState.value.confirmPassword
        val passwordError = if (password.length < 8) "Password must be at least 8 characters" else null
        val confirmPasswordError = if (password != confirmPassword) "Passwords do not match" else null
        updateState { it.copy(passwordError = passwordError, confirmPasswordError = confirmPasswordError) }
        return passwordError == null && confirmPasswordError == null
    }

    private fun validateStep3(): Boolean {
        val termsError = if (!uiState.value.termsAccepted) "You must agree to the terms to continue" else null
        updateState { it.copy(termsError = termsError) }
        return termsError == null
    }
}
