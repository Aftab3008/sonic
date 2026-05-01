package com.aftab005.sonic.core.auth

import android.content.Context
import com.google.crypto.tink.Aead
import com.google.crypto.tink.KeyTemplates
import com.google.crypto.tink.aead.AeadConfig
import com.google.crypto.tink.integration.android.AndroidKeysetManager

object TinkCryptoManager {
    private const val KEYSET_NAME = "sonic_keyset"
    private const val PREFERENCE_FILE = "sonic_tink_prefs"
    private const val MASTER_KEY_URI = "android-keystore://sonic_master_key"

    fun getAead(context: Context): Aead {
        AeadConfig.register()

        return AndroidKeysetManager.Builder()
            .withSharedPref(context, KEYSET_NAME, PREFERENCE_FILE)
            .withKeyTemplate(KeyTemplates.get("AES256_GCM"))
            .withMasterKeyUri(MASTER_KEY_URI)
            .build()
            .keysetHandle
            .getPrimitive(Aead::class.java)
    }
}
