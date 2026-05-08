package com.aftab005.sonic.core.auth.presentation

import com.aftab005.sonic.core.auth.models.UserSession

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
    object Loading : AuthState()
    data class Authenticated(val user: UserSession) : AuthState()
    object Unauthenticated : AuthState()
}