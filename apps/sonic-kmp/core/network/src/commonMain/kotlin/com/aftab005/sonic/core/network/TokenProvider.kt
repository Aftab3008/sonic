package com.aftab005.sonic.core.network

/**
 * Provides the current session token for authenticated HTTP requests.
 *
 * Declared in core:network so the HttpClient can inject auth without depending on core:auth.
 * Implemented by core:auth (SettingsTokenProvider) which reads from multiplatform-settings.
 *
 * This interface is what breaks the circular dependency:
 *   core:network  ←  core:auth  (core:auth depends on core:network, not the reverse)
 */
interface TokenProvider {
    suspend fun getToken(): String?
    suspend fun setToken(token: String)
}
