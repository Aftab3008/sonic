package com.aftab005.sonic.features.auth.presentation

import com.aftab005.sonic.core.auth.AuthViewModel
import com.aftab005.sonic.core.ui.presentation.BaseViewModel

data class SignUpUiState(
    val name: String = "",
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val termsAccepted: Boolean = false,
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

    fun onSignUpClicked() {
        if (!validate()) return

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

    private fun validate(): Boolean {
        val state = uiState.value
        
        val nameError = if (state.name.isBlank()) "Full name is required" else null
        val emailError = if (state.email.isBlank()) "Email is required"
        else if (!state.email.contains("@") || !state.email.contains(".")) "Enter a valid email address"
        else null
        val passwordError = if (state.password.length < 8) "Password must be at least 8 characters" else null
        val confirmPasswordError = if (state.password != state.confirmPassword) "Passwords do not match" else null
        val termsError = if (!state.termsAccepted) "You must agree to the terms to continue" else null

        updateState { 
            it.copy(
                nameError = nameError,
                emailError = emailError,
                passwordError = passwordError,
                confirmPasswordError = confirmPasswordError,
                termsError = termsError
            ) 
        }
        
        return nameError == null && emailError == null && passwordError == null &&
                confirmPasswordError == null && termsError == null
    }
}
