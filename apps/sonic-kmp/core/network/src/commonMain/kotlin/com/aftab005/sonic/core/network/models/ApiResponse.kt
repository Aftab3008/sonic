package com.aftab005.sonic.core.network.models

import kotlinx.serialization.Serializable

/**
 * Generic wrapper matching the Sonic backend's standard response envelope: { data: T }
 *
 * KMP:  httpClient.get("v1/discovery/home").body<ApiResponse<HomeDiscoveryResponse>>()
 */
@Serializable
data class ApiResponse<T>(
    val data: T
)