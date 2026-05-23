package com.aftab005.sonic.features.home.presentation

import com.aftab005.sonic.core.network.models.AlbumCard

sealed class HomeIntent {
    object LoadDiscovery : HomeIntent()
    object RefreshDiscovery : HomeIntent()
    data class FetchAndPlaySingle(val card: AlbumCard) : HomeIntent()
}
