package com.aftab005.sonic.features.discovery.util

import androidx.compose.ui.graphics.Color

fun parseColorString(colorStr: String): Color? {
    return try {
        val cleanColor = colorStr.removePrefix("#")
        when (cleanColor.length) {
            6 -> {
                Color(cleanColor.toLong(16) or 0xFF000000)
            }
            8 -> {
                Color(cleanColor.toLong(16))
            }
            else -> {
                null
            }
        }
    } catch (e: Exception) {
        null
    }
}
