package com.aftab005.sonic.core.auth.di

import com.aftab005.sonic.core.auth.IosSecureSettingsFactory
import com.aftab005.sonic.core.auth.SecureSettingsFactory
import org.koin.core.module.Module
import org.koin.dsl.module

val iosAuthModule: Module = module {
    single<SecureSettingsFactory> { IosSecureSettingsFactory() }
}
