package com.aftab005.sonic.features.discovery.data

import com.aftab005.sonic.core.network.models.ApiResponse
import com.aftab005.sonic.core.network.util.CacheManager
import com.aftab005.sonic.core.network.util.Result
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.safeApiCall
import io.ktor.client.HttpClient
import io.ktor.client.request.get

class DiscoveryRepository(
    private val httpClient: HttpClient,
    private val cacheManager: CacheManager
) {
    private var cachedGenres: GenresDetailsResponse? = null

    companion object {
        private const val KEY_GENRE_DISCOVERY = "genre_discovery_cache"
    }

    suspend fun getGenresDetails(forceRefresh: Boolean = false): Result<GenresDetailsResponse, SonicError> {
        if (!forceRefresh && cachedGenres != null) {
            return Result.Success(cachedGenres!!)
        }

        val result = safeApiCall<ApiResponse<GenresDetailsResponse>> {
            httpClient.get("v1/discovery/genres")
        }

        return when (result) {
            is Result.Success -> {
                val data = result.data.data
                cachedGenres = data
                cacheManager.save(KEY_GENRE_DISCOVERY, data)
                Result.Success(data)
            }
            is Result.Error -> {
                val isAuthError = result.error is SonicError.Api &&
                    (result.error as SonicError.Api).code == 401

                if (isAuthError) {
                    cachedGenres = null
                    Result.Error(result.error)
                } else {
                    val diskCache = cacheManager.load<GenresDetailsResponse>(KEY_GENRE_DISCOVERY)
                    if (diskCache != null) {
                        cachedGenres = diskCache
                        Result.Success(diskCache)
                    } else {
                        Result.Error(result.error)
                    }
                }
            }
        }
    }

    suspend fun getGenreDetail(slug: String): Result<GenreDetail, SonicError> {
        val result =
                safeApiCall<ApiResponse<GenreDetail>> {
                    httpClient.get("v1/discovery/genres/$slug")
                }

        return when (result) {
            is Result.Success -> {
                val data = result.data.data
                Result.Success(data)
            }
            is Result.Error -> {
                Result.Error(result.error)
            }
        }
    }
}
