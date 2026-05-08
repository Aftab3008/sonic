package com.aftab005.sonic.core.auth.session

import com.aftab005.sonic.core.auth.session.SessionStorage
import com.aftab005.sonic.core.auth.models.UserSession
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

/**
 * Centralized manager for the user session.
 *
 * Provides a reactive way for the entire app to observe the current authentication state.
 * This removes redundancy where multiple ViewModels would otherwise need to
 * manually check [SessionStorage].
 */
class SessionManager(private val sessionStorage: SessionStorage) {

    private val _currentSession = MutableStateFlow<UserSession?>(null)
    val currentSession: StateFlow<UserSession?> = _currentSession.asStateFlow()

    private val _isInitialized = MutableStateFlow(false)
    val isInitialized: StateFlow<Boolean> = _isInitialized.asStateFlow()

    suspend fun initialize() {
        if (_isInitialized.value) return
        val session = sessionStorage.getSession()
        _currentSession.value = session
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