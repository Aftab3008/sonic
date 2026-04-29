package com.aftab005.sonic.core.network

import io.ktor.client.plugins.cookies.CookiesStorage
import io.ktor.http.Cookie
import io.ktor.http.Url
import io.ktor.util.date.GMTDate

/**
 * Ktor [CookiesStorage] that reads the session cookie from [TokenProvider].
 *
 * This is the KMP equivalent of the Expo apiClient's beforeRequest hook:
 *   const authHook: BeforeRequestHook = async ({ request }) => {
 *     const cookie = authClient.getCookie();
 *     if (cookie) request.headers.set("Cookie", cookie);
 *   };
 *
 * Better Auth uses the cookie name "better-auth.session_token".
 */
class SessionCookieStorage(
    private val tokenProvider: TokenProvider
) : CookiesStorage {

    override suspend fun get(requestUrl: Url): List<Cookie> {
        val token = tokenProvider.getToken() ?: return emptyList()
        return listOf(
            Cookie(
                name = "better-auth.session_token",
                value = token,
                domain = requestUrl.host,
                path = "/",
                secure = false,
                httpOnly = true,
                expires = GMTDate(Long.MAX_VALUE)
            )
        )
    }

    // Writes are handled by SessionStorage in core:auth, not here
    override suspend fun addCookie(requestUrl: Url, cookie: Cookie) {}

    override fun close() {}
}
