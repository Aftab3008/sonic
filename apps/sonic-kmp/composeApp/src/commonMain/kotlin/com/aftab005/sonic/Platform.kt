package com.aftab005.sonic

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform