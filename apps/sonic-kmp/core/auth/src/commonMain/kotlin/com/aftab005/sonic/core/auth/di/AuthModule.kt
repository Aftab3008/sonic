package com.aftab005.sonic.core.auth.di

import com.aftab005.sonic.core.auth.*
import com.aftab005.sonic.core.network.TokenProvider
import com.russhwolf.settings.ExperimentalSettingsApi
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.koin.core.module.dsl.viewModelOf

@OptIn(ExperimentalSettingsApi::class)
val authModule = module {
    single { get<SecureSettingsFactory>().create() }
    
    single { SessionStorage(get()) }
    
    single<TokenProvider> { SettingsTokenProvider(get()) }

    single { AuthRepository(get(named("unauth"))) }
    
    viewModelOf(::AuthViewModel)
}
