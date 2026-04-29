package com.aftab005.sonic.core.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Exposes [AuthState] as a [StateFlow] and handles all auth operations.
 *
 * Collected in App.kt to drive conditional routing — exact KMP equivalent of:
 *   const { data: session, isPending } = authClient.useSession()
 *
 * Routing logic mirrors Expo's _layout.tsx:
 *   isPending → Loading  → show SplashScreen
 *   session   → Authenticated → navigate to Home (popUpTo 0)
 *   null      → Unauthenticated → navigate to Login (popUpTo 0)
 */
class AuthViewModel(
    private val authRepository: AuthRepository,
    private val sessionStorage: SessionStorage
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        viewModelScope.launch { validateStoredSession() }
    }

    private suspend fun validateStoredSession() {
        val stored = sessionStorage.getSession()
        if (stored == null) {
            _authState.value = AuthState.Unauthenticated
            return
        }
        val valid = authRepository.validateSession(stored.token)
        if (valid != null) {
            sessionStorage.saveSession(valid)
            _authState.value = AuthState.Authenticated(valid)
        } else {
            sessionStorage.clearSession()
            _authState.value = AuthState.Unauthenticated
        }
    }

    /**
     * Sign in with email + password.
     * Expo: authClient.signIn.email({ email, password })
     *
     * On success → saves session → emits [AuthState.Authenticated]
     * On failure → calls [onError] with the error message (displayed in the form)
     */
    fun signIn(
        email: String,
        password: String,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            authRepository.signIn(email, password).fold(
                onSuccess = { session ->
                    sessionStorage.saveSession(session)
                    _authState.value = AuthState.Authenticated(session)
                },
                onFailure = { error ->
                    onError(error.message ?: "Sign in failed. Please try again.")
                }
            )
        }
    }

    /**
     * Register a new account.
     * Expo: authClient.signUp.email({ email, password, name, termsAccepted })
     *
     * On success → saves session → emits [AuthState.Authenticated]
     * On failure → calls [onError] with the error message
     */
    fun signUp(
        email: String,
        password: String,
        name: String,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            authRepository.signUp(email, password, name).fold(
                onSuccess = { session ->
                    sessionStorage.saveSession(session)
                    _authState.value = AuthState.Authenticated(session)
                },
                onFailure = { error ->
                    onError(error.message ?: "Sign up failed. Please try again.")
                }
            )
        }
    }

    /**
     * Sign out: clears all stored session data, emits [AuthState.Unauthenticated].
     * Expo: authClient.signOut()
     * App.kt's LaunchedEffect reacts and navigates to Login (popUpTo 0).
     */
    fun signOut() {
        sessionStorage.clearSession()
        _authState.value = AuthState.Unauthenticated
    }
}
