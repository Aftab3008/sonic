package com.aftab005.sonic

import androidx.compose.ui.window.ComposeUIViewController
import platform.UIKit.NSLayoutConstraint
import platform.UIKit.UIStatusBarStyle
import platform.UIKit.UIStatusBarStyleLightContent
import platform.UIKit.UIViewController
import platform.UIKit.addChildViewController
import platform.UIKit.didMoveToParentViewController

@Suppress("FunctionName", "unused")
fun MainViewController(onStateLoaded: (Boolean) -> Unit): UIViewController = SonicMainViewController(onStateLoaded)

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
