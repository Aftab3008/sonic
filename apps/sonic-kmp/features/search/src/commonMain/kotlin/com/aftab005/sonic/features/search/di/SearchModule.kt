package com.aftab005.sonic.features.search.di

import com.aftab005.sonic.features.search.data.SearchRepository
import com.aftab005.sonic.features.search.presentation.SearchViewModel
import org.koin.core.module.dsl.viewModelOf
import org.koin.core.qualifier.named
import org.koin.dsl.module

val searchModule = module {
    single {
        SearchRepository(
            httpClient = get(named("auth"))
        )
    }
    viewModelOf(::SearchViewModel)
}
