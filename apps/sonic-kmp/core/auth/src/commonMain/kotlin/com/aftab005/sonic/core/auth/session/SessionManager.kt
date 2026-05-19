package com.aftab005.sonic.core.auth.session

import com.aftab005.sonic.core.auth.models.UserSession
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import com.aftab005.sonic.core.auth.data.AuthRepository
import com.aftab005.sonic.core.auth.data.SessionValidationResult

/**
 * Centralized manager for the user session.
 *
 * Provides a reactive way for the entire app to observe the current authentication state.
 * The [currentSession] flow is the single source of truth — when it emits null, the app
 * navigates to Login. When it emits a session, the app navigates to Home.
 *
 * [initialize] validates the stored token against the server before marking the session
 * as active, preventing stale/expired tokens from bypassing authentication.
 */
class SessionManager(private val sessionStorage: SessionStorage) {

    private val _currentSession = MutableStateFlow<UserSession?>(null)
    val currentSession: StateFlow<UserSession?> = _currentSession.asStateFlow()

    private val _isInitialized = MutableStateFlow(false)
    val isInitialized: StateFlow<Boolean> = _isInitialized.asStateFlow()

    /**
     * Validates the stored token against the server before making it active.
     *
     * - No stored token → stays null (Unauthenticated)
     * - Server says valid → updates session (token may be rotated by server)
     * - Server says invalid (401/403) → clears storage (Unauthenticated → Login)
     * - Network error (offline) → trusts cached token (best-effort offline mode)
     */
    suspend fun initialize(authRepository: AuthRepository) {
        if (_isInitialized.value) return
        val stored = sessionStorage.getSession()
        if (stored == null) {
            _currentSession.value = null
            _isInitialized.value = true
            return
        }
        when (val result = authRepository.validateSession(stored.token)) {
            is SessionValidationResult.Valid -> {
                sessionStorage.saveSession(result.session)
                _currentSession.value = result.session
            }
            is SessionValidationResult.Invalid -> {
                sessionStorage.clearSession()
                _currentSession.value = null
            }
            is SessionValidationResult.NetworkError -> {
                _currentSession.value = stored
            }
        }
        _isInitialized.value = true
    }

    suspend fun saveSession(session: UserSession) {
        sessionStorage.saveSession(session)
        _currentSession.value = session
    }

    suspend fun clearSession() {
        sessionStorage.clearSession()
        _currentSession.value = null
    }
}