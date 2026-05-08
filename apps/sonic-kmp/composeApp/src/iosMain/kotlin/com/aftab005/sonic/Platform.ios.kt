package com.aftab005.sonic

import platform.UIKit.UIDevice
import platform.Foundation.NSFileManager
import platform.Foundation.NSCachesDirectory
import platform.Foundation.NSUserDomainMask
import platform.Foundation.NSURL

class IOSPlatform: Platform {
    override val name: String = UIDevice.currentDevice.systemName() + " " + UIDevice.currentDevice.systemVersion
    override val cacheDir: String = NSFileManager.defaultManager.URLsForDirectory(NSCachesDirectory, NSUserDomainMask).first()?.let {
        (it as NSURL).path
    } ?: ""
}

actual fun getPlatform(): Platform = IOSPlatform()