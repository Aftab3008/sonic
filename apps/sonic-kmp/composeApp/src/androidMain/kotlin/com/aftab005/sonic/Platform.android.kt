package com.aftab005.sonic

import android.os.Build

class AndroidPlatform : Platform {
    override val name: String = "Android ${Build.VERSION.SDK_INT}"
    override val cacheDir: String = AppContext.instance.cacheDir.absolutePath
}

actual fun getPlatform(): Platform = AndroidPlatform()