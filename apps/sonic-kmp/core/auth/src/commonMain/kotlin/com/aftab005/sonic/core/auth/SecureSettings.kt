package com.aftab005.sonic.core.auth

import com.russhwolf.settings.ExperimentalSettingsApi
import com.russhwolf.settings.coroutines.SuspendSettings

interface SecureSettingsFactory {
    @OptIn(ExperimentalSettingsApi::class)
    fun create(): SuspendSettings
}
