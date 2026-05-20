package com.aftab005.sonic.core.navigation

import kotlinx.serialization.Serializable

sealed class SonicRoute {
    @Serializable data object Splash : SonicRoute()
    @Serializable data object Login : SonicRoute()
    @Serializable data object SignUp : SonicRoute()

    @Serializable data object Home : SonicRoute()
    @Serializable data object Search : SonicRoute()
    @Serializable data object Discovery : SonicRoute()
    @Serializable data object Library : SonicRoute()
    @Serializable data class AlbumDetail(val albumId: String) : SonicRoute()
}
