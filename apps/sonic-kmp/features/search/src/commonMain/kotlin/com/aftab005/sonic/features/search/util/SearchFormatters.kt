package com.aftab005.sonic.features.search.util

/**
 * Formats duration in milliseconds to "m:ss" format.
 */
fun formatDuration(ms: Long): String {
    val totalSec = ms / 1000
    val min = totalSec / 60
    val sec = totalSec % 60
    return "$min:${sec.toString().padStart(2, '0')}"
}

/**
 * Formats monthly listeners count to a human-readable string (e.g., 1.5M, 10K).
 */
fun formatListeners(count: Int): String {
    return when {
        count >= 1_000_000 -> "${count / 1_000_000}M"
        count >= 1_000 -> "${count / 1_000}K"
        else -> count.toString()
    }
}
