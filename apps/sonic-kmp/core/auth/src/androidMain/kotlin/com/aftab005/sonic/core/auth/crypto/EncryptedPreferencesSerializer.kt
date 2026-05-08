package com.aftab005.sonic.core.auth.crypto

import androidx.datastore.core.Serializer
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.PreferencesSerializer
import com.google.crypto.tink.Aead
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okio.Buffer
import java.io.InputStream
import java.io.OutputStream

/**
 * A [androidx.datastore.core.Serializer] for [androidx.datastore.preferences.core.Preferences] that encrypts data using Tink's [com.google.crypto.tink.Aead].
 */
class EncryptedPreferencesSerializer(private val aead: Aead) : Serializer<Preferences> {
    override val defaultValue: Preferences = PreferencesSerializer.defaultValue

    override suspend fun readFrom(input: InputStream): Preferences {
        val encryptedBytes = input.readBytes()
        if (encryptedBytes.isEmpty()) return defaultValue

        return try {
            val decryptedBytes = aead.decrypt(encryptedBytes, null)
            val buffer = Buffer().apply { write(decryptedBytes) }
            PreferencesSerializer.readFrom(buffer)
        } catch (_: Exception) {
            // If decryption fails (e.g. keyset changed or data corrupted), return default value.
            // This allows DataStore to recover and eventually overwrite the corrupted file.
            defaultValue
        }
    }

    override suspend fun writeTo(t: Preferences, output: OutputStream) {
        val buffer = Buffer()
        PreferencesSerializer.writeTo(t, buffer)
        val encryptedBytes = aead.encrypt(buffer.readByteArray(), null)
        withContext(Dispatchers.IO) {
            output.write(encryptedBytes)
        }
    }
}