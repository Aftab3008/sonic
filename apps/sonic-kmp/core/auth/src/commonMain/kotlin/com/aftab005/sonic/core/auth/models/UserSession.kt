package com.aftab005.sonic.core.auth.models

import kotlinx.serialization.Serializable

/**
 * Represents an authenticated user session.
 */
@Serializable
data class UserSession(
    val token: String,
    val userId: String,
    val name: String,
    val email: String,
    val avatarUrl: String?
) {
    val displayAvatarUrl: String
        get() {
            if (!avatarUrl.isNullOrBlank()) {
                return avatarUrl
            }
            val seed = name.filter {
                it.isLetterOrDigit()
            }.ifBlank {
                userId
            }
            return "https://picsum.photos/seed/$seed/200/200"
        }
}
