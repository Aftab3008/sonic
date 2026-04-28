package com.aftab005.sonic.core.ui.navigation

import com.aftab005.sonic.core.navigation.SonicRoute
import com.aftab005.sonic.core.navigation.SonicTabItem
import com.aftab005.sonic.core.ui.components.DiscoveryTabIcon
import com.aftab005.sonic.core.ui.components.HomeTabIcon
import com.aftab005.sonic.core.ui.components.LibraryTabIcon
import com.aftab005.sonic.core.ui.components.SearchTabIcon

val SonicUiNavigationMap = listOf(
    SonicTabItem(0, "Home", SonicRoute.Home, icon = { iconSize, color, focused, modifier -> 
        HomeTabIcon(iconSize, color, focused, modifier) 
    }),
    SonicTabItem(1, "Search", SonicRoute.Search, icon = { iconSize, color, focused, modifier -> 
        SearchTabIcon(iconSize, color, focused, modifier) 
    }),
    SonicTabItem(2, "Discovery", SonicRoute.Discovery, icon = { iconSize, color, focused, modifier -> 
        DiscoveryTabIcon(iconSize, color, focused, modifier) 
    }),
    SonicTabItem(3, "Library", SonicRoute.Library, icon = { iconSize, color, focused, modifier -> 
        LibraryTabIcon(iconSize, color, focused, modifier) 
    })
)
