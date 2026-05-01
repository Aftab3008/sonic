package com.aftab005.sonic.core.auth

import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.Result
import com.aftab005.sonic.core.network.util.mapToSonicError
import com.aftab005.sonic.core.network.util.toSonicError
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.HttpRequestTimeoutException
import io.ktor.client.request.get
import io.ktor.client.request.headers
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpHeaders
import io.ktor.http.isSuccess
import kotlinx.serialization.SerializationException
import kotlinx.serialization.Serializable
import okio.IOException

class AuthRepository(private val httpClient: HttpClient) {

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

    /** Extract token from set-auth-token header (sent by @better-auth/expo plugin) */
    private fun extractToken(response: HttpResponse): String? =
        response.headers["set-auth-token"]?.takeIf { it.isNotEmpty() }

    suspend fun signIn(email: String, password: String): Result<UserSession, SonicError> {
        return try {
            val response = httpClient.post("auth/sign-in/email") {
                setBody(SignInRequest(email, password))
            }
            if (response.status.isSuccess()) {
                val body = response.body<AuthSessionResponse>()
                val token = extractToken(response)
                    ?: return Result.Error(SonicError.Api("Session token missing", 401))
                Result.Success(UserSession(token, body.user.id, body.user.name, body.user.email))
            } else {
                Result.Error(response.toSonicError())
            }
        } catch (e: Throwable) {
            Result.Error(e.mapToSonicError())
        }
    }

    suspend fun signUp(email: String, password: String, name: String): Result<UserSession, SonicError> {
        return try {
            val response = httpClient.post("auth/sign-up/email") {
                setBody(SignUpRequest(email, password, name))
            }
            if (response.status.isSuccess()) {
                val body = response.body<AuthSessionResponse>()
                val token = extractToken(response)
                    ?: return Result.Error(SonicError.Api("Session token missing", 401))
                Result.Success(UserSession(token, body.user.id, body.user.name, body.user.email))
            } else {
                Result.Error(response.toSonicError())
            }
        } catch (e: Throwable) {
            Result.Error(e.mapToSonicError())
        }
    }



    /** validateSession — sends Bearer token, returns sealed result */
    suspend fun validateSession(token: String): SessionValidationResult {
        return try {
            val response = httpClient.get("auth/get-session") {
                headers {
                    append(HttpHeaders.Authorization, "Bearer $token")
                }
            }
            if (response.status.isSuccess()) {
                val body = response.body<GetSessionResponse>()
                val user = body.user ?: return SessionValidationResult.Invalid
                if (user.id.isEmpty()) return SessionValidationResult.Invalid
                
                // If backend rotated token, use the new one, else keep current
                val freshToken = response.headers["set-auth-token"]?.takeIf { it.isNotEmpty() } ?: token
                SessionValidationResult.Valid(
                    UserSession(freshToken, user.id, user.name, user.email)
                )
            } else {
                SessionValidationResult.Invalid
            }
        } catch (e: Exception) {
            SessionValidationResult.NetworkError(e)
        }
    }
}

sealed class SessionValidationResult {
    data class Valid(val session: UserSession) : SessionValidationResult()
    object Invalid : SessionValidationResult()
    data class NetworkError(val cause: Exception) : SessionValidationResult()
}

