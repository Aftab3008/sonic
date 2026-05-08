package com.aftab005.sonic.core.ui.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharedFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Base ViewModel for consistent State and Effect management.
 * 
 * @param S The type of the UI State (usually a data class).
 * @param E The type of the UI Effect (usually a sealed class/object for one-time events).
 * @param initialState The initial state of the UI.
 */
abstract class BaseViewModel<S, E>(initialState: S) : ViewModel() {

    private val _uiState = MutableStateFlow(initialState)
    val uiState: StateFlow<S> = _uiState.asStateFlow()

    private val _uiEffect = MutableSharedFlow<E>()
    val uiEffect: SharedFlow<E> = _uiEffect.asSharedFlow()

    protected fun updateState(update: (S) -> S) {
        _uiState.value = update(_uiState.value)
    }

    protected fun emitEffect(effect: E) {
        viewModelScope.launch {
            _uiEffect.emit(effect)
        }
    }
}
