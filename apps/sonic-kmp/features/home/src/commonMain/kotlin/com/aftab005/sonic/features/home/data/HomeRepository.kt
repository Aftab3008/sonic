package com.aftab005.sonic.features.home.data

import com.aftab005.sonic.core.network.models.ApiResponse
import com.aftab005.sonic.core.network.models.HomeDiscoveryResponse
import com.aftab005.sonic.core.network.util.CacheManager
import com.aftab005.sonic.core.network.util.Result
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.safeApiCall
import io.ktor.client.HttpClient
import io.ktor.client.request.get

class HomeRepository(
    private val httpClient: HttpClient,
    private val cacheManager: CacheManager
) {

    private var cachedDiscovery: HomeDiscoveryResponse? = null

    companion object {
        private const val KEY_HOME_DISCOVERY = "home_discovery_cache"
    }

    suspend fun getHomeDiscovery(forceRefresh: Boolean = false): Result<HomeDiscoveryResponse, SonicError> {
        if (!forceRefresh && cachedDiscovery != null) {
            return Result.Success(cachedDiscovery!!)
        }

        val result = safeApiCall<ApiResponse<HomeDiscoveryResponse>> {
            httpClient.get("v1/discovery/home")
        }
        
        return when (result) {
            is Result.Success -> {
                val data = result.data.data
                cachedDiscovery = data
                cacheManager.save(KEY_HOME_DISCOVERY, data)
                Result.Success(data)
            }
            is Result.Error -> {
                val cached = cacheManager.load<HomeDiscoveryResponse>(KEY_HOME_DISCOVERY)
                if (cached != null) {
                    cachedDiscovery = cached
                    Result.Success(cached)
                } else {
                    Result.Error(result.error)
                }
            }
        }
    }
}
