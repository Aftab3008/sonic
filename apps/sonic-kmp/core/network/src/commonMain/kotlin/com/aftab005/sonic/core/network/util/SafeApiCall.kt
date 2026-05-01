package com.aftab005.sonic.core.network.util

import io.ktor.client.call.body
import io.ktor.client.statement.HttpResponse
import io.ktor.http.isSuccess
import kotlinx.serialization.SerializationException
import io.ktor.client.network.sockets.ConnectTimeoutException
import io.ktor.client.network.sockets.SocketTimeoutException
import kotlinx.io.IOException

/**
 * Standard utility to execute a network request safely and map errors to SonicError.
 */
suspend inline fun <reified T> safeApiCall(
    execute: () -> HttpResponse
): Result<T, SonicError> {
    return try {
        val response = execute()
        if (response.status.isSuccess()) {
            Result.Success(response.body<T>())
        } else {
            val errorBody = try {
                response.body<ApiError>()
            } catch (e: Exception) {
                null
            }
            
            val message = errorBody?.message ?: "An unexpected error occurred"
            Result.Error(SonicError.Api(message, response.status.value))
        }
    } catch (e: ConnectTimeoutException) {
        Result.Error(SonicError.Network)
    } catch (e: SocketTimeoutException) {
        Result.Error(SonicError.Network)
    } catch (e: IOException) {
        Result.Error(SonicError.Network)
    } catch (e: SerializationException) {
        Result.Error(SonicError.Serialization)
    } catch (e: Exception) {
        Result.Error(SonicError.Unknown(e.message))
    }
}

/**
 * Extension to convert a failed HttpResponse into a SonicError.Api.
 */
suspend fun HttpResponse.toSonicError(): SonicError {
    val errorBody = try {
        this.body<ApiError>()
    } catch (e: Exception) {
        null
    }
    
    val message = errorBody?.message 
        ?: errorBody?.error?.message 
        ?: "An unexpected error occurred"
        
    return SonicError.Api(
        message = message,
        code = this.status.value
    )
}

/**
 * Helper to convert a Throwable into a SonicError.
 */
suspend fun Throwable.mapToSonicError(): SonicError {
    return when (this) {
        is io.ktor.client.plugins.ResponseException -> this.response.toSonicError()
        is io.ktor.utils.io.errors.IOException -> SonicError.Network
        is kotlinx.serialization.SerializationException -> SonicError.Serialization
        else -> SonicError.Unknown(this.message)
    }
}

