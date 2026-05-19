package com.aftab005.sonic.core.auth.session

import com.aftab005.sonic.core.network.auth.AuthEventHandler
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * Implements [AuthEventHandler] (declared in core:network).
 *
 * When [SonicHttpClient] detects a 401, it calls [onUnauthorized], which clears the
 * stored session via [SessionManager]. The [SessionManager.currentSession] flow then
 * emits null, which [AuthViewModel] collects to set [AuthState.Unauthenticated] and
 * navigate to Login.
 *
 * No singleton buses, no SharedFlow subscriptions, no lambdas — pure interface-driven DI.
 */
class SessionAuthEventHandler(
    private val sessionManager: SessionManager,
    private val scope: CoroutineScope
) : AuthEventHandler {

    override fun onUnauthorized() {
        scope.launch(Dispatchers.Main.immediate) {
            sessionManager.clearSession()
            // SessionManager.currentSession emits null →
            // AuthViewModel.authState becomes AuthState.Unauthenticated →
            // LaunchedEffect(authState) in App.kt navigates to Login
        }
    }
}
