package com.aftab005.sonic.features.home.di

import com.aftab005.sonic.features.album.data.AlbumRepository
import com.aftab005.sonic.features.home.data.HomeRepository
import com.aftab005.sonic.features.home.presentation.HomeViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.core.qualifier.named
import org.koin.dsl.module

val homeModule = module {
    single { HomeRepository(get(named("auth")), get()) }
    viewModelOf(::HomeViewModel)
}
