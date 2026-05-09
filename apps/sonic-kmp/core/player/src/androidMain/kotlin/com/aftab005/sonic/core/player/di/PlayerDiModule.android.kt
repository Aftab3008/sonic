package com.aftab005.sonic.core.player.di

import com.aftab005.sonic.core.player.AndroidSonicPlayer
import com.aftab005.sonic.core.player.SonicPlayer
import org.koin.core.module.Module
import org.koin.dsl.module

actual fun platformPlayerModule(): Module = module {
    single<SonicPlayer> { AndroidSonicPlayer(get()) }
}
