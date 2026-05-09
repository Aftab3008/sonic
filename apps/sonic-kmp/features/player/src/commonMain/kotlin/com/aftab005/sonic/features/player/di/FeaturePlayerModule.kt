package com.aftab005.sonic.features.player.di

import com.aftab005.sonic.features.player.presentation.PlayerViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

val featurePlayerModule = module {
    viewModelOf(::PlayerViewModel)
}
