package com.aftab005.sonic

import androidx.compose.ui.window.ComposeUIViewController
import platform.UIKit.NSLayoutConstraint
import platform.UIKit.UIStatusBarStyle
import platform.UIKit.UIStatusBarStyleLightContent
import platform.UIKit.UIViewController
import platform.UIKit.addChildViewController
import platform.UIKit.didMoveToParentViewController
import com.aftab005.sonic.core.auth.di.authModule
import com.aftab005.sonic.core.auth.di.iosAuthModule
import com.aftab005.sonic.core.network.di.networkModule
import com.aftab005.sonic.core.player.di.platformPlayerModule
import com.aftab005.sonic.features.auth.di.featureAuthModule
import com.aftab005.sonic.features.album.di.albumModule
import com.aftab005.sonic.features.home.di.homeModule
import com.aftab005.sonic.features.player.di.featurePlayerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.MainScope
import org.koin.core.context.startKoin
import org.koin.core.context.stopKoin
import org.koin.dsl.module
import org.koin.mp.KoinPlatformTools

@Suppress("FunctionName", "unused")
fun MainViewController(onStateLoaded: (Boolean) -> Unit): UIViewController {
    startKoin {
        modules(
            module { single<CoroutineScope> { MainScope() } },
            networkModule,
            authModule,
            iosAuthModule,
            homeModule,
            albumModule,
            featureAuthModule,
            platformPlayerModule(),
            featurePlayerModule
        )
    }
    return SonicMainViewController(onStateLoaded)
}

fun onAppTerminate() {
    try {
        val koin = KoinPlatformTools.defaultContext().get()
        val player = koin.get<com.aftab005.sonic.core.player.SonicPlayer>(
            clazz = com.aftab005.sonic.core.player.SonicPlayer::class,
            qualifier = null,
            parameters = null
        )
        player.release()
        stopKoin()
    } catch (e: Exception) {
        println("[MainViewController] Cleanup failed: ${e.message}")
    }
}

class SonicMainViewController(private val onStateLoaded: (Boolean) -> Unit) : UIViewController(null, null) {
    @Suppress("unused")
    fun prefersHomeIndicatorAutoHidden(): Boolean = true
    override fun preferredStatusBarStyle(): UIStatusBarStyle = UIStatusBarStyleLightContent

    override fun viewDidLoad() {
        super.viewDidLoad()
        val appViewController = ComposeUIViewController { App(onStateLoaded = onStateLoaded) }
        addChildViewController(appViewController)
        view.addSubview(appViewController.view)

        appViewController.view.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activateConstraints(listOf(
            appViewController.view.topAnchor.constraintEqualToAnchor(view.topAnchor),
            appViewController.view.bottomAnchor.constraintEqualToAnchor(view.bottomAnchor),
            appViewController.view.leadingAnchor.constraintEqualToAnchor(view.leadingAnchor),
            appViewController.view.trailingAnchor.constraintEqualToAnchor(view.trailingAnchor)
        ))

        appViewController.didMoveToParentViewController(this)
    }
}
