package com.aftab005.sonic.core.network.client

import com.aftab005.sonic.core.network.config.NetworkConfig
import com.aftab005.sonic.core.network.session.SessionCookieStorage
import com.aftab005.sonic.core.network.session.TokenProvider
import io.ktor.client.HttpClient
import io.ktor.client.plugins.DefaultRequest
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
import io.ktor.serialization.kotlinx.json.json
import kotlinx.serialization.json.Json

/**
 * Creates the authenticated Sonic HTTP client — KMP equivalent of the Expo `kyInstance`.
 *
 *
 * KMP SonicHttpClient mirrors this exactly:
 *   - url("$baseUrl/api/")         → equivalent of prefix option
 *   - requestTimeoutMillis = 15_000 → equivalent of timeout: 15000
 *
 *
 *   KMP:   httpClient.get("v1/discovery/home").body<ApiResponse<T>>()
 *
 * @param tokenProvider Reads the stored session token — implemented by SettingsTokenProvider in core:auth
 * @param json Json configuration for serialization
 * @param baseUrl Override for testing or staging environments
 */
fun createSonicHttpClient(
    tokenProvider: TokenProvider,
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
}

/**
 * Creates an unauthenticated Sonic HTTP client.
 *
 * Used by [AuthRepository] for auth endpoints (sign-in, sign-up, get-session).
 * Auth endpoints MUST NOT send a session cookie — this client has no [HttpCookies] plugin.
 *
 * Equivalent of the raw fetch used before a session exists.
 * 
 * @param json Json configuration for serialization
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
