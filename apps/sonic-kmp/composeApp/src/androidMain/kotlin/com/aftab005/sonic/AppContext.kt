package com.aftab005.sonic

import android.annotation.SuppressLint
import android.content.Context

@SuppressLint("StaticFieldLeak")
object AppContext {
    lateinit var instance: Context
}
