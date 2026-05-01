package com.aftab005.sonic.core.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.SonicError
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class AuthViewModel(
    private val authRepository: AuthRepository,
    private val sessionStorage: SessionStorage
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    init {
        viewModelScope.launch {
            validateStoredSession()
        }
    }

    private fun validateStoredSession() {
        viewModelScope.launch {
            val stored = sessionStorage.getSession()
            if (stored == null || stored.token.isEmpty()) {
                _authState.value = AuthState.Unauthenticated
            } else {
                _authState.value = AuthState.Authenticated(stored)
            }
        }
    }

    fun signIn(email: String, password: String, onError: (String) -> Unit) {
        viewModelScope.launch {
            authRepository.signIn(email, password)
                .onSuccess { session ->
                    sessionStorage.saveSession(session)
                    _authState.value = AuthState.Authenticated(session)
                }
                .onError { error ->
                    val message = when (error) {
                        is SonicError.Api -> error.message
                        is SonicError.Network -> "Network error. Please check your connection."
                        is SonicError.Serialization -> "Data processing error."
                        else -> "An unexpected error occurred."
                    }
                    onError(message)
                }
        }
    }

    fun signUp(
        email: String,
        password: String,
        name: String,
        onError: (String) -> Unit
    ) {
        viewModelScope.launch {
            authRepository.signUp(email, password, name)
                .onSuccess { session ->
                    sessionStorage.saveSession(session)
                    _authState.value = AuthState.Authenticated(session)
                }
                .onError { error ->
                    val message = when (error) {
                        is SonicError.Api -> error.message
                        is SonicError.Network -> "Network error. Please check your connection."
                        is SonicError.Serialization -> "Data processing error."
                        else -> "An unexpected error occurred."
                    }
                    onError(message)
                }
        }
    }


    /**
     * Sign out: clears all stored session data, emits [AuthState.Unauthenticated].
     */
    fun signOut() {
        viewModelScope.launch {
            sessionStorage.clearSession()
            _authState.value = AuthState.Unauthenticated
        }
    }
}
