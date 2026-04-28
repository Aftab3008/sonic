package com.aftab005.sonic.core.navigation

import kotlinx.serialization.Serializable

sealed class SonicRoute {
    @Serializable data object Home : SonicRoute()
    @Serializable data object Search : SonicRoute()
    @Serializable data object Discovery : SonicRoute()
    @Serializable data object Library : SonicRoute()
}
