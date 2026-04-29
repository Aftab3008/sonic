package com.aftab005.sonic.core.auth

import com.russhwolf.settings.Settings

/**
 * Persists the user session using multiplatform-settings.
 *
 * Platform backends:
 *   Android → SharedPreferences
 *   iOS     → NSUserDefaults
 *
 * Equivalent of the Expo SecureStore usage inside better-auth/expo:
 *   storage: SecureStore (storagePrefix: "sonic")
 */
class SessionStorage(private val settings: Settings) {

    companion object {
        private const val KEY_TOKEN = "sonic_session_token"
        private const val KEY_USER_ID = "sonic_user_id"
        private const val KEY_USER_NAME = "sonic_user_name"
        private const val KEY_USER_EMAIL = "sonic_user_email"
    }

    fun getToken(): String? = settings.getStringOrNull(KEY_TOKEN)

    fun saveSession(session: UserSession) {
        settings.putString(KEY_TOKEN, session.token)
        settings.putString(KEY_USER_ID, session.userId)
        settings.putString(KEY_USER_NAME, session.name)
        settings.putString(KEY_USER_EMAIL, session.email)
    }

    fun getSession(): UserSession? {
        val token = settings.getStringOrNull(KEY_TOKEN) ?: return null
        val userId = settings.getStringOrNull(KEY_USER_ID) ?: return null
        val name = settings.getStringOrNull(KEY_USER_NAME) ?: return null
        val email = settings.getStringOrNull(KEY_USER_EMAIL) ?: return null
        return UserSession(token = token, userId = userId, name = name, email = email)
    }

    fun clearSession() {
        settings.remove(KEY_TOKEN)
        settings.remove(KEY_USER_ID)
        settings.remove(KEY_USER_NAME)
        settings.remove(KEY_USER_EMAIL)
    }

    fun hasSession(): Boolean = settings.getStringOrNull(KEY_TOKEN) != null
}
