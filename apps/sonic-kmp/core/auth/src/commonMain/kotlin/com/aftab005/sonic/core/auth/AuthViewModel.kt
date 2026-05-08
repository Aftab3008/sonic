package com.aftab005.sonic.core.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.aftab005.sonic.core.network.util.onSuccess
import com.aftab005.sonic.core.network.util.onError
import com.aftab005.sonic.core.network.util.SonicError
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Global authentication ViewModel.
 * 
 * Manages the top-level [AuthState] and provides a centralized way to handle 
 * auth transitions (Sign In, Sign Up, Sign Out) that affect the whole app.
 */
class AuthViewModel(
    private val authRepository: AuthRepository,
    private val sessionManager: SessionManager
) : ViewModel() {

    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    val authState: StateFlow<AuthState> = _authState.asStateFlow()

    private val _navEvent = MutableSharedFlow<AuthNavEvent>()
    val navEvent: SharedFlow<AuthNavEvent> = _navEvent.asSharedFlow()

    init {
        viewModelScope.launch {
            sessionManager.initialize()
            sessionManager.currentSession.collect { session ->
                _authState.value = if (session != null) {
                    AuthState.Authenticated(session)
                } else {
                    AuthState.Unauthenticated
                }
            }
        }
    }

    fun signIn(email: String, password: String, onError: (String) -> Unit) {
        viewModelScope.launch {
            authRepository.signIn(email, password)
                .onSuccess { session ->
                    sessionManager.saveSession(session)
                    _navEvent.emit(AuthNavEvent.NavigateToHome)
                }
                .onError { error ->
                    onError(error.toUserMessage())
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
                    sessionManager.saveSession(session)
                    _navEvent.emit(AuthNavEvent.NavigateToHome)
                }
                .onError { error ->
                    onError(error.toUserMessage())
                }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            sessionManager.clearSession()
            _navEvent.emit(AuthNavEvent.NavigateToLogin)
        }
    }

    private fun SonicError.toUserMessage(): String = when (this) {
        is SonicError.Api -> message
        is SonicError.Network -> "Network error. Please check your connection."
        is SonicError.Serialization -> "Data processing error."
        else -> "An unexpected error occurred."
    }
}

sealed class AuthNavEvent {
    object NavigateToHome : AuthNavEvent()
    object NavigateToLogin : AuthNavEvent()
}
