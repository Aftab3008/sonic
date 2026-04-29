package com.aftab005.sonic.core.auth

import com.aftab005.sonic.core.network.createUnauthenticatedClient
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.get
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import kotlinx.serialization.Serializable

/**
 * Calls Better Auth REST endpoints on the NestJS backend.
 *
 * Uses an UNAUTHENTICATED Ktor client — sign-in/sign-up must not send a session cookie.
 *
 * Expo equivalents:
 *   signIn     → authClient.signIn.email({ email, password })
 *   signUp     → authClient.signUp.email({ email, password, name })
 *   getSession → authClient.useSession() backend validation
 */
class AuthRepository(
    private val httpClient: HttpClient = createUnauthenticatedClient()
) {

    @Serializable
    private data class SignInRequest(val email: String, val password: String)

    @Serializable
    private data class SignUpRequest(
        val email: String,
        val password: String,
        val name: String,
        val callbackURL: String = "/home"
    )

    @Serializable
    private data class AuthUserResponse(
        val id: String = "",
        val name: String = "",
        val email: String = ""
    )

    @Serializable
    private data class AuthSessionResponse(
        val token: String = "",
        val user: AuthUserResponse = AuthUserResponse()
    )

    @Serializable
    private data class GetSessionResponse(
        val user: AuthUserResponse? = null,
        val session: SessionTokenData? = null
    )

    @Serializable
    private data class SessionTokenData(val token: String = "")

    // ── Helpers ───────────────────────────────────────────────────────────

    /**
     * Extracts the session token from the Set-Cookie header returned by Better Auth.
     * Falls back to the token field in the response body.
     */
    private fun extractToken(response: HttpResponse, body: AuthSessionResponse): String {
        return response.headers["set-cookie"]
            ?.split(";")
            ?.firstOrNull { it.trimStart().startsWith("better-auth.session_token=") }
            ?.substringAfter("better-auth.session_token=")
            ?.trim()
            ?: body.token
    }

    // ── Auth operations ───────────────────────────────────────────────────

    /**
     * POST /api/auth/sign-in/email
     * Expo: authClient.signIn.email({ email, password })
     */
    suspend fun signIn(email: String, password: String): Result<UserSession> {
        return try {
            val response: HttpResponse = httpClient.post("auth/sign-in/email") {
                setBody(SignInRequest(email = email, password = password))
            }
            if (response.status.isSuccess()) {
                val body = response.body<AuthSessionResponse>()
                val token = extractToken(response, body)
                Result.success(
                    UserSession(
                        token = token,
                        userId = body.user.id,
                        name = body.user.name,
                        email = body.user.email
                    )
                )
            } else {
                val errorBody = runCatching { response.body<Map<String, String>>() }.getOrNull()
                val message = errorBody?.get("message") ?: "Invalid credentials"
                Result.failure(Exception(message))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * POST /api/auth/sign-up/email
     * Expo: authClient.signUp.email({ email, password, name, termsAccepted, callbackURL })
     */
    suspend fun signUp(email: String, password: String, name: String): Result<UserSession> {
        return try {
            val response: HttpResponse = httpClient.post("auth/sign-up/email") {
                setBody(SignUpRequest(email = email, password = password, name = name))
            }
            if (response.status.isSuccess()) {
                val body = response.body<AuthSessionResponse>()
                val token = extractToken(response, body)
                Result.success(
                    UserSession(
                        token = token,
                        userId = body.user.id,
                        name = body.user.name,
                        email = body.user.email
                    )
                )
            } else {
                val errorBody = runCatching { response.body<Map<String, String>>() }.getOrNull()
                val message = errorBody?.get("message") ?: "Sign up failed"
                Result.failure(Exception(message))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    /**
     * GET /api/auth/get-session
     * Validates a stored token with the backend.
     * Returns null if the session is expired or invalid.
     * Expo: authClient.useSession() (the background refetch on mount)
     */
    suspend fun validateSession(token: String): UserSession? {
        return try {
            val response: HttpResponse = httpClient.get("auth/get-session") {
                headers {
                    append("cookie", "better-auth.session_token=$token")
                }
            }
            if (response.status.isSuccess()) {
                val body = response.body<GetSessionResponse>()
                val user = body.user ?: return null
                if (user.id.isEmpty()) return null
                UserSession(
                    token = body.session?.token?.takeIf { it.isNotEmpty() } ?: token,
                    userId = user.id,
                    name = user.name,
                    email = user.email
                )
            } else {
                null
            }
        } catch (e: Exception) {
            null
        }
    }
}
