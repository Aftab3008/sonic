package com.aftab005.sonic.core.auth

import com.aftab005.sonic.core.auth.session.SessionStorage
import com.aftab005.sonic.core.network.session.TokenProvider

/**
 * Implements [TokenProvider] (declared in core:network) using [com.aftab005.sonic.core.auth.session.SessionStorage].
 *
 * Injected into [createSonicHttpClient] so every authenticated request automatically
 * includes the session cookie — equivalent to the Expo apiClient's beforeRequest hook:
 *
 */
class SettingsTokenProvider(
    private val sessionStorage: SessionStorage
) : TokenProvider {
    override suspend fun getToken(): String? = sessionStorage.getToken()
    
    override suspend fun setToken(token: String) {
        val currentSession = sessionStorage.getSession() ?: return
        sessionStorage.saveSession(currentSession.copy(token = token))
    }
}
