package com.aftab005.sonic.core.network.client

import com.aftab005.sonic.core.network.auth.AuthEventHandler
import com.aftab005.sonic.core.network.config.NetworkConfig
import com.aftab005.sonic.core.network.session.SessionCookieStorage
import com.aftab005.sonic.core.network.session.TokenProvider
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
import io.ktor.client.plugins.HttpResponseValidator
import io.ktor.client.plugins.HttpTimeout
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.cookies.HttpCookies
import io.ktor.client.plugins.logging.LogLevel
import io.ktor.client.plugins.logging.Logger
import io.ktor.client.plugins.logging.Logging
import io.ktor.client.plugins.logging.SIMPLE
import io.ktor.client.request.header
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/**
 * Creates the authenticated Sonic HTTP client — KMP equivalent of the Expo `kyInstance`.
 *
 * KMP SonicHttpClient mirrors this exactly:
 *   - url("$baseUrl/api/")         → equivalent of prefix option
 *   - requestTimeoutMillis = 15_000 → equivalent of timeout: 15000
 *
 * On HTTP 401, [authEventHandler].onUnauthorized() is called, which clears the session via
 * [SessionManager] and triggers navigation to Login through the reactive [AuthViewModel].
 *
 * @param tokenProvider    Reads the stored session token (SettingsTokenProvider in core:auth)
 * @param authEventHandler Handles 401 events (SessionAuthEventHandler in core:auth)
 * @param json             Json configuration for serialization
 * @param baseUrl          Override for testing or staging environments
 */
fun createSonicHttpClient(
    tokenProvider: TokenProvider,
    authEventHandler: AuthEventHandler,
    json: Json,
    baseUrl: String = NetworkConfig.BASE_URL
): HttpClient = HttpClient {
    install(ContentNegotiation) {
        json(json)
    }
    install(HttpTimeout) {
        requestTimeoutMillis = 15_000L
        connectTimeoutMillis = 10_000L
        socketTimeoutMillis = 15_000L
    }
    install(DefaultRequest) {
        url("$baseUrl/api/")
        header(HttpHeaders.ContentType, ContentType.Application.Json)
    }
    install(HttpCookies) {
        storage = SessionCookieStorage(tokenProvider)
    }
    install(Logging) {
        logger = Logger.SIMPLE
        level = LogLevel.HEADERS
    }
    HttpResponseValidator {
        validateResponse { response ->
            if (response.status == HttpStatusCode.Unauthorized) {
                authEventHandler.onUnauthorized()
                throw UnauthorizedException()
            }
        }
    }
}

/**
 * Thrown by the 401 validator so callers receive a typed, meaningful exception
 * instead of a generic HTTP error. Caught by [safeApiCall] as [SonicError.Unknown].
 */
class UnauthorizedException : Exception("Session expired. Please sign in again.")

/**
 * Creates an unauthenticated Sonic HTTP client.
 *
 * Used by [AuthRepository] for auth endpoints (sign-in, sign-up, get-session, sign-out).
 * Auth endpoints MUST NOT send a session cookie — this client has no [HttpCookies] plugin.
 *
 * @param json    Json configuration for serialization
 * @param baseUrl Override for testing or staging environments
 */
fun createUnauthenticatedClient(
    json: Json,
    baseUrl: String = NetworkConfig.BASE_URL
): HttpClient = HttpClient {
    install(ContentNegotiation) {
        json(json)
    }
    install(HttpTimeout) {
        requestTimeoutMillis = 15_000L
        connectTimeoutMillis = 10_000L
    }
    install(DefaultRequest) {
        url("$baseUrl/api/")
        header(HttpHeaders.ContentType, ContentType.Application.Json)
    }
    install(Logging) {
        logger = Logger.SIMPLE
        level = LogLevel.HEADERS
    }
}
