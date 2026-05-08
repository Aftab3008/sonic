package com.aftab005.sonic.core.network

import io.ktor.client.plugins.cookies.CookiesStorage
import io.ktor.http.Cookie
import io.ktor.http.Url

/**
 * Custom cookie storage that provides the session token as a cookie.
 *
 * This allows the [SonicHttpClient] to automatically include the session token in every request to
 * the backend, matching the behavior of the Expo client.
 */
class SessionCookieStorage(private val tokenProvider: TokenProvider) : CookiesStorage {

    override suspend fun get(requestUrl: Url): List<Cookie> {
        val token = tokenProvider.getToken() ?: return emptyList()
        return listOf(
                Cookie(
                        name = "better-auth.session_token",
                        value = token,
                        path = "/",
                        domain = requestUrl.host,
                        httpOnly = true,
                        secure = true
                )
        )
    }

    override suspend fun addCookie(requestUrl: Url, cookie: Cookie) {
        if (cookie.name == "better-auth.session_token") {
            tokenProvider.setToken(cookie.value)
        }
    }

    override fun close() {}
}
