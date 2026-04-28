package com.aftab005.sonic.core.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

@Composable
fun HomeTabIcon(
    iconSize: Dp = 24.dp,
    color: Color = Color.White,
    focused: Boolean = false,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.size(iconSize)) {
        val s = size.width
        val scale = s / 24f
        if (focused) {
            val path = Path().apply {
                moveTo(12f * scale, 3f * scale)
                lineTo(2f * scale, 10.5f * scale)
                lineTo(5f * scale, 10.5f * scale)
                lineTo(5f * scale, 21f * scale)
                lineTo(10f * scale, 21f * scale)
                lineTo(10f * scale, 14f * scale)
                lineTo(14f * scale, 14f * scale)
                lineTo(14f * scale, 21f * scale)
                lineTo(19f * scale, 21f * scale)
                lineTo(19f * scale, 10.5f * scale)
                lineTo(22f * scale, 10.5f * scale)
                close()
            }
            drawPath(path, color = color, style = Fill)
        } else {
            val path1 = Path().apply {
                moveTo(3f * scale, 10f * scale)
                lineTo(12f * scale, 3.5f * scale)
                lineTo(21f * scale, 10f * scale)
                lineTo(21f * scale, 20f * scale)
                lineTo(21f * scale, 21f * scale)
                lineTo(3f * scale, 21f * scale)
                lineTo(3f * scale, 10f * scale)
            }
            drawPath(
                path1, 
                color = color, 
                style = Stroke(width = 2f * scale, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )
            val path2 = Path().apply {
                moveTo(9f * scale, 21f * scale)
                lineTo(9f * scale, 12f * scale)
                lineTo(15f * scale, 12f * scale)
                lineTo(15f * scale, 21f * scale)
            }
            drawPath(
                path2, 
                color = color, 
                style = Stroke(width = 2f * scale, cap = StrokeCap.Round, join = StrokeJoin.Round)
            )
        }
    }
}

@Composable
fun DiscoveryTabIcon(
    iconSize: Dp = 24.dp,
    color: Color = Color.White,
    focused: Boolean = false,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.size(iconSize)) {
        val s = size.width
        val scale = s / 24f
        if (focused) {
            drawCircle(color = color, radius = 10f * scale, center = Offset(12f * scale, 12f * scale), alpha = 0.25f)
            drawCircle(
                color = color, 
                radius = 10f * scale, 
                center = Offset(12f * scale, 12f * scale), 
                style = Stroke(width = 2f * scale)
            )
            val path = Path().apply {
                moveTo(16.24f * scale, 7.76f * scale)
                lineTo(14.12f * scale, 14.12f * scale)
                lineTo(7.76f * scale, 16.24f * scale)
                lineTo(9.88f * scale, 9.88f * scale)
                close()
            }
            drawPath(path, color = color, style = Fill)
        } else {
            drawCircle(
                color = color, 
                radius = 10f * scale, 
                center = Offset(12f * scale, 12f * scale), 
                style = Stroke(width = 2f * scale)
            )
            val path = Path().apply {
                moveTo(16.24f * scale, 7.76f * scale)
                lineTo(14.12f * scale, 14.12f * scale)
                lineTo(7.76f * scale, 16.24f * scale)
                lineTo(9.88f * scale, 9.88f * scale)
                close()
            }
            drawPath(path, color = color, style = Stroke(width = 2f * scale, join = StrokeJoin.Round))
        }
    }
}

@Composable
fun LibraryTabIcon(
    iconSize: Dp = 24.dp,
    color: Color = Color.White,
    focused: Boolean = false,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.size(iconSize)) {
        val s = size.width
        val scale = s / 24f
        if (focused) {
            drawRoundRect(
                color = color,
                topLeft = Offset(3f * scale, 10f * scale),
                size = Size(18f * scale, 11f * scale),
                cornerRadius = CornerRadius(2f * scale, 2f * scale),
                style = Fill
            )
            val path = Path().apply {
                moveTo(7f * scale, 6f * scale)
                lineTo(17f * scale, 6f * scale)
                moveTo(5f * scale, 8f * scale)
                lineTo(19f * scale, 8f * scale)
            }
            drawPath(path, color = color, style = Stroke(width = 2f * scale, cap = StrokeCap.Round))
        } else {
            drawRoundRect(
                color = color,
                topLeft = Offset(3f * scale, 10f * scale),
                size = Size(18f * scale, 11f * scale),
                cornerRadius = CornerRadius(2f * scale, 2f * scale),
                style = Stroke(width = 2f * scale)
            )
            val path = Path().apply {
                moveTo(7f * scale, 6f * scale)
                lineTo(17f * scale, 6f * scale)
                moveTo(5f * scale, 8f * scale)
                lineTo(19f * scale, 8f * scale)
            }
            drawPath(path, color = color, style = Stroke(width = 2f * scale, cap = StrokeCap.Round))
        }
    }
}

@Composable
fun SearchTabIcon(
    iconSize: Dp = 24.dp,
    color: Color = Color.White,
    focused: Boolean = false,
    modifier: Modifier = Modifier
) {
    Canvas(modifier = modifier.size(iconSize)) {
        val s = size.width
        val scale = s / 24f
        if (focused) {
            drawCircle(
                color = color,
                radius = 8f * scale,
                center = Offset(11f * scale, 11f * scale),
                style = Fill
            )
            val path = Path().apply {
                moveTo(21f * scale, 21f * scale)
                lineTo(16.65f * scale, 16.65f * scale)
            }
            drawPath(path, color = color, style = Stroke(width = 3f * scale, cap = StrokeCap.Round))
        } else {
            drawCircle(
                color = color,
                radius = 8f * scale,
                center = Offset(11f * scale, 11f * scale),
                style = Stroke(width = 2f * scale)
            )
            val path = Path().apply {
                moveTo(21f * scale, 21f * scale)
                lineTo(16.65f * scale, 16.65f * scale)
            }
            drawPath(path, color = color, style = Stroke(width = 2f * scale, cap = StrokeCap.Round))
        }
    }
}
