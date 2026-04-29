package com.aftab005.sonic.core.auth

/**
 * Reactive auth state — the KMP equivalent of Expo's authClient.useSession():
 *
 *   Expo:  isPending = true            →  KMP: AuthState.Loading
 *   Expo:  session != null             →  KMP: AuthState.Authenticated(user)
 *   Expo:  session == null             →  KMP: AuthState.Unauthenticated
 *
 * Collected in App.kt via collectAsState() to drive NavHost startDestination.
 */
sealed class AuthState {
    /** Session validation in progress — show SplashScreen */
    object Loading : AuthState()

    /** Valid session found — navigate to Home */
    data class Authenticated(val user: UserSession) : AuthState()

    /** No session or expired — navigate to Login */
    object Unauthenticated : AuthState()
}
