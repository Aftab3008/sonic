package com.aftab005.sonic.core.network

import kotlinx.serialization.Serializable

/**
 * Generic wrapper matching the Sonic backend's standard response envelope: { data: T }
 *
 * Expo: kyInstance.get("v1/discovery/home").json<{ data: HomeDiscoveryResponse }>()
 * KMP:  httpClient.get("v1/discovery/home").body<ApiResponse<HomeDiscoveryResponse>>()
 */
@Serializable
data class ApiResponse<T>(
    val data: T
)

/**
 * Standard error shape returned by the backend.
 */
@Serializable
data class ApiError(
    val message: String,
    val statusCode: Int = 0
)
