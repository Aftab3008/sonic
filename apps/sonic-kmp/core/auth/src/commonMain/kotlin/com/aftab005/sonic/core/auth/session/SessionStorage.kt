package com.aftab005.sonic.core.auth.session

import com.aftab005.sonic.core.auth.models.UserSession
import com.russhwolf.settings.ExperimentalSettingsApi
import com.russhwolf.settings.coroutines.SuspendSettings

/**
 * Persists the user session using multiplatform-settings.
 *
 * Platform backends:
 *   Android → DataStore (Encrypted with Tink)
 *   iOS     → Keychain
 *
 * Equivalent of the Expo SecureStore usage inside better-auth/expo:
 *   storage: SecureStore (storagePrefix: "sonic")
 */
@OptIn(ExperimentalSettingsApi::class)
class SessionStorage(private val settings: SuspendSettings) {

    companion object {
        private const val KEY_TOKEN = "sonic_session_token"
        private const val KEY_USER_ID = "sonic_user_id"
        private const val KEY_USER_NAME = "sonic_user_name"
        private const val KEY_USER_EMAIL = "sonic_user_email"
    }

    suspend fun getToken(): String? = settings.getStringOrNull(KEY_TOKEN)

    suspend fun saveSession(session: UserSession) {
        settings.putString(KEY_TOKEN, session.token)
        settings.putString(KEY_USER_ID, session.userId)
        settings.putString(KEY_USER_NAME, session.name)
        settings.putString(KEY_USER_EMAIL, session.email)
    }

    suspend fun getSession(): UserSession? {
        val token = settings.getStringOrNull(KEY_TOKEN) ?: return null
        val userId = settings.getStringOrNull(KEY_USER_ID) ?: return null
        val name = settings.getStringOrNull(KEY_USER_NAME) ?: return null
        val email = settings.getStringOrNull(KEY_USER_EMAIL) ?: return null
        return UserSession(token = token, userId = userId, name = name, email = email)
    }

    suspend fun clearSession() {
        settings.remove(KEY_TOKEN)
        settings.remove(KEY_USER_ID)
        settings.remove(KEY_USER_NAME)
        settings.remove(KEY_USER_EMAIL)
    }

    suspend fun hasSession(): Boolean = settings.getStringOrNull(KEY_TOKEN) != null
}