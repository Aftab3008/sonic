package com.aftab005.sonic.core.auth

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.core.DataStoreFactory
import androidx.datastore.preferences.core.Preferences
import com.aftab005.sonic.core.auth.crypto.EncryptedPreferencesSerializer
import com.aftab005.sonic.core.auth.crypto.TinkCryptoManager
import com.russhwolf.settings.ExperimentalSettingsApi
import com.russhwolf.settings.ExperimentalSettingsImplementation
import com.russhwolf.settings.coroutines.SuspendSettings
import com.russhwolf.settings.datastore.DataStoreSettings
import java.io.File

class AndroidSecureSettingsFactory(private val context: Context) : SecureSettingsFactory {
    @OptIn(ExperimentalSettingsApi::class, ExperimentalSettingsImplementation::class)
    override fun create(): SuspendSettings {
        val aead = TinkCryptoManager.getAead(context)
        val serializer = EncryptedPreferencesSerializer(aead)
        
        val dataStore: DataStore<Preferences> = DataStoreFactory.create(
            serializer = serializer,
            produceFile = { File(context.filesDir, "datastore/sonic_secure_prefs.preferences_pb") }
        )
        
        return DataStoreSettings(dataStore)
    }
}
