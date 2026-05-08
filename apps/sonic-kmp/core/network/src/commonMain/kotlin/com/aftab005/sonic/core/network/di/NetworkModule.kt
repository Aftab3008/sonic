package com.aftab005.sonic.core.network.di

import com.aftab005.sonic.core.network.TokenProvider
import com.aftab005.sonic.core.network.createSonicHttpClient
import com.aftab005.sonic.core.network.createUnauthenticatedClient
import com.aftab005.sonic.core.network.util.CacheManager
import com.russhwolf.settings.coroutines.SuspendSettings
import kotlinx.serialization.json.Json
import org.koin.core.qualifier.named
import org.koin.dsl.module

val networkModule = module {
    single {
        Json {
            ignoreUnknownKeys = true
            isLenient = true
            encodeDefaults = true
        }
    }

    single(qualifier = named("unauth")) { createUnauthenticatedClient(get<Json>()) }

    single(qualifier = named("auth")) { createSonicHttpClient(get<TokenProvider>(), get<Json>()) }

    single { CacheManager(get<SuspendSettings>(), get<Json>()) }
}
