package com.aftab005.sonic.features.discovery.presentation


sealed class DiscoveryIntent {
    object LoadGenre : DiscoveryIntent()
    object RefreshGenre : DiscoveryIntent()
}