package com.aftab005.sonic.core.auth.crypto

import android.content.Context
import androidx.core.content.edit
import com.google.crypto.tink.Aead
import com.google.crypto.tink.KeyTemplates
import com.google.crypto.tink.RegistryConfiguration
import com.google.crypto.tink.aead.AeadConfig
import com.google.crypto.tink.integration.android.AndroidKeysetManager

object TinkCryptoManager {
    private const val KEYSET_NAME = "sonic_keyset"
    private const val PREFERENCE_FILE = "sonic_tink_prefs"
    private const val MASTER_KEY_URI = "android-keystore://sonic_master_key"

    init {
        AeadConfig.register()
    }

    fun getAead(context: Context): Aead {
        return try {
            buildKeysetManager(context).keysetHandle.getPrimitive(RegistryConfiguration.get(), Aead::class.java)
        } catch (e: Exception) {
            context.getSharedPreferences(PREFERENCE_FILE, Context.MODE_PRIVATE).edit { clear() }
            buildKeysetManager(context).keysetHandle.getPrimitive(RegistryConfiguration.get(), Aead::class.java)
        }
    }

    private fun buildKeysetManager(context: Context): AndroidKeysetManager {
        return AndroidKeysetManager.Builder()
            .withSharedPref(context, KEYSET_NAME, PREFERENCE_FILE)
            .withKeyTemplate(KeyTemplates.get("AES256_GCM"))
            .withMasterKeyUri(MASTER_KEY_URI)
            .build()
    }
}