package com.aftab005.sonic.core.auth.di

import com.aftab005.sonic.core.auth.AndroidSecureSettingsFactory
import com.aftab005.sonic.core.auth.SecureSettingsFactory
import org.koin.core.module.Module
import org.koin.dsl.module

val androidAuthModule: Module = module {
    single<SecureSettingsFactory> { AndroidSecureSettingsFactory(get()) }
}
