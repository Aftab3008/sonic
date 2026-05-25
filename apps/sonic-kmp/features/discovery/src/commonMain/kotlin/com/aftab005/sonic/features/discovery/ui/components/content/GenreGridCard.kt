package com.aftab005.sonic.features.discovery.ui.components.content

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.features.discovery.data.Genre
import com.aftab005.sonic.features.discovery.util.parseColorString

@Composable
fun GenreGridCard(
    genre: Genre,
    onClick: () -> Unit
) {
    val primaryColor = remember(genre.primaryColor) {
        genre.primaryColor?.let { parseColorString(it) } ?: Color(0xFF6200EE)
    }
    val secondaryColor = remember(genre.secondaryColor) {
        genre.secondaryColor?.let { parseColorString(it) } ?: primaryColor.copy(alpha = 0.6f)
    }

    val gradient = remember(primaryColor, secondaryColor) {
        Brush.linearGradient(
            colors = listOf(primaryColor, secondaryColor)
        )
    }

    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(120.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(gradient)
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Text(
            text = genre.name,
            color = Color.White,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.align(Alignment.BottomStart)
        )
    }
}
