package com.aftab005.sonic.features.home.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.ui.components.VanguardSectionHeader
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

import com.aftab005.sonic.core.network.models.Album

@Composable
fun MadeForYouSection(
    albums: List<Album>,
    modifier: Modifier = Modifier
) {
    if (albums.isEmpty()) return
    
    val gridColumns = SonicTheme.dimensions.gridColumns
    val isExpanded = gridColumns > 2

    Column(modifier = modifier.fillMaxWidth()) {
        VanguardSectionHeader(title = "Made for You")
        
        Spacer(modifier = Modifier.height(SonicTheme.dimensions.cardSpacing))

        if (isExpanded) {
            // Expanded Layout: 3-column row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = SonicTheme.dimensions.screenPadding),
                horizontalArrangement = Arrangement.spacedBy(SonicTheme.dimensions.cardSpacing)
            ) {
                albums.take(3).forEach { album ->
                    MadeForYouLargeCard(
                        album = album,
                        modifier = Modifier.weight(1f).aspectRatio(1f)
                    )
                }
            }
        } else {
            // Compact Layout: Original 1.1f / 0.9f split
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(340.scaled)
                    .padding(horizontal = SonicTheme.dimensions.screenPadding),
                horizontalArrangement = Arrangement.spacedBy(12.scaled)
            ) {
                albums.firstOrNull()?.let { album ->
                    MadeForYouLargeCard(
                        album = album,
                        modifier = Modifier.weight(1.1f)
                    )
                }

                Column(
                    modifier = Modifier.weight(0.9f),
                    verticalArrangement = Arrangement.spacedBy(12.scaled)
                ) {
                    albums.getOrNull(1)?.let { album ->
                        MadeForYouSideCard(
                            album = album,
                            modifier = Modifier.weight(1f),
                            icon = Icons.Default.Star,
                            iconColor = SonicTheme.colors.secondary,
                            tag = "DISCOVER"
                        )
                    } ?: Spacer(modifier = Modifier.weight(1f))

                    albums.getOrNull(2)?.let { album ->
                        MadeForYouSideCard(
                            album = album,
                            modifier = Modifier.weight(1f),
                            icon = Icons.Default.Favorite,
                            iconColor = SonicTheme.colors.tertiary,
                            tag = "LIKED"
                        )
                    } ?: Spacer(modifier = Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
private fun MadeForYouLargeCard(
    album: Album,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxHeight()
            .clip(RoundedCornerShape(16.dp))
            .clickable { /* logic */ }
    ) {
        AsyncImage(
            model = album.coverImageUrl,
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )
        
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.8f))
                    )
                )
        )
        
        Column(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .padding(20.scaled)
        ) {
            Text(
                text = album.title,
                color = Color.White,
                fontSize = 24.mTextScaled,
                fontWeight = FontWeight.ExtraBold,
                lineHeight = 28.sp,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = album.artists?.firstOrNull()?.artist?.name ?: "Personalized Mix",
                color = Color.White.copy(alpha = 0.7f),
                fontSize = 12.mTextScaled,
                fontWeight = FontWeight.Medium,
                modifier = Modifier.padding(top = 6.vScaled)
            )
        }
    }
}

@Composable
private fun MadeForYouSideCard(
    album: Album,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconColor: Color,
    tag: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(SonicTheme.colors.surfaceContainer)
            .border(
                width = 1.dp,
                color = SonicTheme.colors.outlineVariant.copy(alpha = 0.15f),
                shape = RoundedCornerShape(16.dp)
            )
            .clickable { /* logic */ }
            .padding(18.scaled)
    ) {
        Column(
            verticalArrangement = Arrangement.SpaceBetween,
            modifier = Modifier.fillMaxSize()
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                 Icon(
                     imageVector = icon,
                     contentDescription = null,
                     tint = iconColor,
                     modifier = Modifier.size(20.scaled)
                 )
                 Box(
                     modifier = Modifier
                         .background(
                             color = iconColor.copy(alpha = 0.15f),
                             shape = RoundedCornerShape(6.dp)
                         )
                         .padding(horizontal = 8.scaled, vertical = 3.scaled)
                 ) {
                     Text(
                         text = tag,
                         color = iconColor,
                         fontSize = 8.mTextScaled,
                         fontWeight = FontWeight.Bold,
                         letterSpacing = 1.sp
                     )
                 }
            }
            
            Column {
                Text(
                    text = album.title,
                    color = SonicTheme.colors.onSurface,
                    fontSize = 15.mTextScaled,
                    fontWeight = FontWeight.Bold,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
                Text(
                    text = album.artists?.firstOrNull()?.artist?.name ?: "Mix",
                    color = SonicTheme.colors.onSurfaceVariant,
                    fontSize = 11.mTextScaled,
                    fontWeight = FontWeight.Medium,
                    modifier = Modifier.padding(top = 4.vScaled),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}
