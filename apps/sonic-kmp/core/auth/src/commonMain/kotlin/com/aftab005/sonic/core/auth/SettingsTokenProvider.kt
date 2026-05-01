package com.aftab005.sonic.core.auth

import com.aftab005.sonic.core.network.TokenProvider

/**
 * Implements [TokenProvider] (declared in core:network) using [SessionStorage].
 *
 * Injected into [createSonicHttpClient] so every authenticated request automatically
 * includes the session cookie — equivalent to the Expo apiClient's beforeRequest hook:
 *
 *   const authHook = async ({ request }) => {
 *     const cookie = authClient.getCookie();
 *     if (cookie) request.headers.set("Cookie", cookie);
 *   };
 */
class SettingsTokenProvider(
    private val sessionStorage: SessionStorage
) : TokenProvider {
    override suspend fun getToken(): String? = sessionStorage.getToken()
}
