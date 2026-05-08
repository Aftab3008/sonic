package com.aftab005.sonic.features.auth.di

import com.aftab005.sonic.features.auth.presentation.LoginViewModel
import com.aftab005.sonic.features.auth.presentation.SignUpViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.dsl.module

val featureAuthModule = module {
    viewModelOf(::LoginViewModel)
    viewModelOf(::SignUpViewModel)
}
