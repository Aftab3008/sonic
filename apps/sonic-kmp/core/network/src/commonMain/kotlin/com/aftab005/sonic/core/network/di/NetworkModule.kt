package com.aftab005.sonic.core.network.di

import com.aftab005.sonic.core.network.createSonicHttpClient
import com.aftab005.sonic.core.network.createUnauthenticatedClient
import org.koin.core.qualifier.named
import org.koin.dsl.module

val networkModule = module {
    // Unauthenticated client — sign-in / sign-up only
    single(qualifier = named("unauth")) { createUnauthenticatedClient() }
    
    // Authenticated client — reads token from TokenProvider via Ktor Auth plugin
    // TokenProvider is provided by core:auth module
    single(qualifier = named("auth")) { createSonicHttpClient(get()) }
}
