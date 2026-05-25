package com.aftab005.sonic.features.discovery.di

import com.aftab005.sonic.features.discovery.data.DiscoveryRepository
import com.aftab005.sonic.features.discovery.presentation.DiscoveryViewModel
import com.aftab005.sonic.features.discovery.presentation.GenreDetailViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.core.qualifier.named
import org.koin.dsl.module

val discoveryModule = module {
    single {
        DiscoveryRepository(
            get(named("auth")),
            get()
        )
    }

    viewModelOf(::DiscoveryViewModel)
    viewModelOf(::GenreDetailViewModel)
}