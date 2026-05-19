package com.aftab005.sonic.core.auth.di

import com.aftab005.sonic.core.auth.*
import com.aftab005.sonic.core.auth.presentation.AuthViewModel
import com.aftab005.sonic.core.auth.data.AuthRepository
import com.aftab005.sonic.core.auth.session.SessionAuthEventHandler
import com.aftab005.sonic.core.auth.session.SessionManager
import com.aftab005.sonic.core.auth.session.SessionStorage
import com.aftab005.sonic.core.network.auth.AuthEventHandler
import com.aftab005.sonic.core.network.session.TokenProvider
import com.russhwolf.settings.ExperimentalSettingsApi
import kotlinx.coroutines.CoroutineScope
import org.koin.core.qualifier.named
import org.koin.dsl.module
import org.koin.core.module.dsl.viewModelOf

@OptIn(ExperimentalSettingsApi::class)
val authModule = module {
    single { get<SecureSettingsFactory>().create() }

    single { SessionStorage(get()) }

    single { SessionManager(get()) }

    single<TokenProvider> { SettingsTokenProvider(get()) }

    single { AuthRepository(get(named("unauth"))) }

    single<AuthEventHandler> {
        SessionAuthEventHandler(
            sessionManager = get<SessionManager>(),
            scope = get<CoroutineScope>()
        )
    }

    viewModelOf(::AuthViewModel)
}
