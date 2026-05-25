package com.aftab005.sonic.features.album.data

import com.aftab005.sonic.core.network.models.AlbumDetail
import com.aftab005.sonic.core.network.models.ApiResponse
import com.aftab005.sonic.core.network.util.CacheManager
import com.aftab005.sonic.core.network.util.Result
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.safeApiCall
import io.ktor.client.HttpClient
import io.ktor.client.request.get

class AlbumRepository(
    private val httpClient: HttpClient,
    private val cacheManager: CacheManager,
) {
    private val memoryCache = mutableMapOf<String, AlbumDetail>()

    private fun cacheKey(albumId: String) = "album_detail_$albumId"

    suspend fun getAlbumDetail(
        albumId: String,
        forceRefresh: Boolean = false,
    ): Result<AlbumDetail, SonicError> {
        if (!forceRefresh) {
            memoryCache[albumId]?.let {
                return Result.Success(it)
            }
        }

        val result = safeApiCall<ApiResponse<AlbumDetail>> {
            httpClient.get("v1/albums/$albumId")
        }

        return when (result) {
            is Result.Success -> {
                val detail = result.data.data
                memoryCache[albumId] = detail
                cacheManager.save(cacheKey(albumId), detail)
                Result.Success(detail)
            }
            is Result.Error -> {
                val isAuthError = result.error is SonicError.Api &&
                    (result.error as SonicError.Api).code == 401

                if (isAuthError) {
                    clearAll()
                    Result.Error(result.error)
                } else {
                    val cached = cacheManager.load<AlbumDetail>(cacheKey(albumId))
                    if (cached != null) {
                        memoryCache[albumId] = cached
                        Result.Success(cached)
                    } else {
                        Result.Error(result.error)
                    }
                }
            }
        }
    }

    fun evict(albumId: String) {
        memoryCache.remove(albumId)
    }

    fun clearAll() {
        memoryCache.clear()
    }
}
