package com.aftab005.sonic.core.network.util

import com.russhwolf.settings.coroutines.SuspendSettings
import kotlinx.serialization.json.Json

/**
 * Generic Cache Manager to reduce boilerplate in repositories.
 * 
 * Handles serialization, persistence using [SuspendSettings], and retrieval.
 */
class CacheManager(
    @PublishedApi internal val settings: SuspendSettings,
    @PublishedApi internal val json: Json,
) {

    suspend inline fun <reified T> save(key: String, data: T) {
        try {
            val jsonString = json.encodeToString(data)
            settings.putString(key, jsonString)
        } catch (_: Exception) {
            // Ignore cache save errors to prevent breaking the app flow
        }
    }

    suspend inline fun <reified T> load(key: String): T? {
        return try {
            val jsonString = settings.getStringOrNull(key) ?: return null
            json.decodeFromString<T>(jsonString)
        } catch (_: Exception) {
            null
        }
    }

    suspend fun clear(key: String) {
        settings.remove(key)
    }
}
