package com.aftab005.sonic.features.home.data

import com.aftab005.sonic.core.network.ApiResponse
import com.aftab005.sonic.core.network.models.HomeDiscoveryResponse
import com.aftab005.sonic.core.network.util.Result
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.safeApiCall
import io.ktor.client.HttpClient
import io.ktor.client.request.get

class HomeRepository(private val httpClient: HttpClient) {

    private var cachedDiscovery: HomeDiscoveryResponse? = null

    suspend fun getHomeDiscovery(forceRefresh: Boolean = false): Result<HomeDiscoveryResponse, SonicError> {
        if (!forceRefresh && cachedDiscovery != null) {
            return Result.Success(cachedDiscovery!!)
        }

        val result = safeApiCall<ApiResponse<HomeDiscoveryResponse>> {
            httpClient.get("v1/discovery/home")
        }
        
        return when (result) {
            is Result.Success -> {
                cachedDiscovery = result.data.data
                Result.Success(result.data.data)
            }
            is Result.Error -> Result.Error(result.error)
        }
    }
}
