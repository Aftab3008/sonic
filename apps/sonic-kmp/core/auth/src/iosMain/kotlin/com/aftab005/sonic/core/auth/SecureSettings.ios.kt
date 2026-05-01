package com.aftab005.sonic.core.auth

import com.russhwolf.settings.KeychainSettings
import com.russhwolf.settings.ExperimentalSettingsApi
import com.russhwolf.settings.ExperimentalSettingsImplementation
import com.russhwolf.settings.coroutines.SuspendSettings
import com.russhwolf.settings.coroutines.toSuspendSettings

@OptIn(ExperimentalSettingsApi::class, ExperimentalSettingsImplementation::class)
class IosSecureSettingsFactory : SecureSettingsFactory {
    override fun create(): SuspendSettings = KeychainSettings(service = "com.aftab005.sonic").toSuspendSettings()
}
