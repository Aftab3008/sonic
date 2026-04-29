package com.aftab005.sonic.core.auth

import kotlinx.serialization.Serializable

/**
 * Represents a persisted user session.
 * Stored field-by-field in multiplatform-settings (SessionStorage).
 */
@Serializable
data class UserSession(
    val token: String,
    val userId: String,
    val name: String,
    val email: String
)
