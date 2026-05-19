package com.aftab005.sonic.core.network.auth

/**
 * Contract for reacting to auth-related HTTP events detected by [SonicHttpClient].
 *
 * Defined in core:network so the HTTP client can depend on it without creating
 * a circular dependency (core:auth already depends on core:network).
 *
 * Implemented in core:auth by [SessionAuthEventHandler].
 *
 * Future hooks can be added as new methods on this interface:
 *   - fun onForbidden()                     — 403, insufficient permissions
 *   - fun onTokenRefreshed(token: String)   — silent token rotation support
 */
interface AuthEventHandler {
    /** Called when the server returns HTTP 401 — session has expired or is invalid. */
    fun onUnauthorized()
}
