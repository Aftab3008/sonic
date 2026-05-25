package com.aftab005.sonic.features.album.di

import com.aftab005.sonic.features.album.data.AlbumRepository
import com.aftab005.sonic.features.album.presentation.AlbumDetailViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.core.qualifier.named
import org.koin.dsl.module

val albumModule = module {
    single {
        AlbumRepository(
            get(
                named("auth")
            ),
            get()
        )
    }
    viewModelOf(::AlbumDetailViewModel)
}
