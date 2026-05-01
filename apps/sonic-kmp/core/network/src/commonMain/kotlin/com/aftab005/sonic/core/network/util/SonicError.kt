package com.aftab005.sonic.core.network.util

import kotlinx.serialization.Serializable

/**
 * Modern, extensible error structure for Sonic KMP.
 * Replaces the old NetworkError enum.
 */
sealed interface SonicError : Error {
    
    /** 
     * Represents an error returned by the Sonic backend.
     * @param message The descriptive message from the server (e.g., "User already exists")
     * @param code The HTTP status code (e.g., 422, 401, 500)
     */
    data class Api(val message: String, val code: Int) : SonicError
    
    /** Represents connectivity issues (no internet, timeout) */
    object Network : SonicError
    
    /** Represents data parsing or serialization issues */
    object Serialization : SonicError
    
    /** Catch-all for unexpected platform or logic errors */
    data class Unknown(val message: String? = null) : SonicError
}

/**
 * Standard error envelope matching the Sonic backend's GlobalExceptionFilter
 * and BetterAuth's error structure.
 */
@Serializable
data class ApiError(
    val message: String? = null,
    val statusCode: Int? = null,
    val error: BetterAuthError? = null,
    val timestamp: String? = null,
    val path: String? = null
)

@Serializable
data class BetterAuthError(
    val message: String? = null,
    val status: Int? = null,
    val code: String? = null
)
