package com.aftab005.sonic

import android.app.Application
import com.aftab005.sonic.core.auth.di.androidAuthModule
import com.aftab005.sonic.core.auth.di.authModule
import com.aftab005.sonic.core.network.di.networkModule
import com.aftab005.sonic.core.player.di.platformPlayerModule
import com.aftab005.sonic.features.auth.di.featureAuthModule
import com.aftab005.sonic.features.home.di.homeModule
import com.aftab005.sonic.features.player.di.featurePlayerModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin
import org.koin.core.logger.Level

class SonicApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AppContext.instance = this
        startKoin {
            androidLogger(Level.DEBUG)
            androidContext(this@SonicApplication)
            modules(
                networkModule,
                authModule,
                androidAuthModule,
                homeModule,
                featureAuthModule,
                platformPlayerModule(),
                featurePlayerModule
            )
        }
    }
}
