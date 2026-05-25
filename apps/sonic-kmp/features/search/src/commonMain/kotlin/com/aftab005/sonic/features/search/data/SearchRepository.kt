package com.aftab005.sonic.features.search.data

import com.aftab005.sonic.core.network.models.ApiResponse
import com.aftab005.sonic.core.network.util.Result
import com.aftab005.sonic.core.network.util.SonicError
import com.aftab005.sonic.core.network.util.safeApiCall
import io.ktor.client.HttpClient
import io.ktor.client.request.get
import io.ktor.client.request.parameter

class SearchRepository(
    private val httpClient: HttpClient,
) {
    /**
     * Search across songs, albums, and artists.
     *
     * @param query The search query (min 2 chars, max 200 chars)
     * @param type  Filter by type: "all", "songs", "albums", "artists"
     * @param limit Max results per index (1–50)
     * @param offset Pagination offset
     */
    suspend fun search(
        query: String,
        type: String = "all",
        limit: Int = 20,
        offset: Int = 0,
    ): Result<SearchResponse, SonicError> {
        val result = safeApiCall<ApiResponse<SearchResponse>> {
            httpClient.get("v1/search") {
                parameter("q", query)
                parameter("type", type)
                parameter("limit", limit)
                parameter("offset", offset)
            }
        }
        return when (result) {
            is Result.Success -> Result.Success(result.data.data)
            is Result.Error -> Result.Error(result.error)
        }
    }
}
