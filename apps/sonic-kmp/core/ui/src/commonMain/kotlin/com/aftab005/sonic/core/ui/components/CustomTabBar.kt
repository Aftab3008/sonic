package com.aftab005.sonic.core.ui.components

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.unit.dp
import com.aftab005.sonic.core.ui.navigation.SonicUiNavigationMap
import com.aftab005.sonic.core.ui.theme.*

@OptIn(androidx.compose.ui.ExperimentalComposeUiApi::class)
@Composable
fun CustomTabBar(
    selectedIndex: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val easing = CubicBezierEasing(0.25f, 0.1f, 0.25f, 1f)
    val bottomPadding = 24.vScaled

    BoxWithConstraints(
        modifier = modifier
            .padding(bottom = bottomPadding)
            .fillMaxWidth(),
        contentAlignment = Alignment.Center
    ) {
        val screenWidth = maxWidth
        val maxAllowedWidth = SonicTheme.dimensions.maxContentWidth.takeIf { it != androidx.compose.ui.unit.Dp.Unspecified } ?: 420.scaled
        val tabBarWidth = minOf(androidx.compose.ui.unit.max(screenWidth - 32.scaled, 0.dp), maxAllowedWidth)
        
        val innerPadding = 12.mScaled
        val availableWidth = androidx.compose.ui.unit.max(tabBarWidth - innerPadding, 0.dp)
        val tabCount = SonicUiNavigationMap.size
        val tabWidth = if (tabCount > 0) availableWidth / tabCount.toFloat() else 0.dp
        
        val minTabHeight = 62.vScaled
        val minTabsRowHeight = 78.vScaled
        val pillRadius = 31.mScaled
        val pillHInset = 4.mScaled
        
        val activeTranslationY = (-12).vScaled
        val inactiveTranslationY = 4.vScaled

        Box(
            modifier = Modifier
                .width(tabBarWidth)
                .heightIn(min = minTabsRowHeight)
        ) {
            Box(
                modifier = Modifier
                    .matchParentSize()
                    .offset(y = 4.mScaled)
                    .clip(RoundedCornerShape(28.mScaled))
                    .background(SonicTheme.colors.primaryContainer.copy(alpha = 0.06f))
            )

            Box(
                modifier = Modifier
                    .matchParentSize()
                    .clip(RoundedCornerShape(32.mScaled))
                    .border(1.dp, Color.White.copy(alpha = 0.08f), RoundedCornerShape(32.mScaled))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(
                                Color(0xD91E1E28),
                                Color(0xEB0F0F17)
                            )
                        )
                    )
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.mScaled)
                        .height(1.dp)
                        .background(
                            Brush.horizontalGradient(
                                colors = listOf(
                                    Color.Transparent,
                                    SonicTheme.colors.primaryContainer.copy(alpha = 0.09f),
                                    SonicTheme.colors.primary.copy(alpha = 0.06f),
                                    Color.Transparent
                                )
                            )
                        )
                )

                val indicatorOffset by animateFloatAsState(
                    targetValue = (selectedIndex * tabWidth.value),
                    animationSpec = tween(280, easing = easing)
                )

                val indicatorLeft = (innerPadding / 2f) + pillHInset
                val indicatorWidth = androidx.compose.ui.unit.max(tabWidth - (pillHInset * 2f), 0.dp)

                Box(
                    modifier = Modifier
                        .offset(x = indicatorOffset.dp + indicatorLeft, y = 6.mScaled)
                        .width(indicatorWidth)
                        .heightIn(min = minTabHeight)
                        .clip(RoundedCornerShape(pillRadius))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    SonicTheme.colors.primaryContainer.copy(alpha = 0.15f),
                                    SonicTheme.colors.primary.copy(alpha = 0.07f)
                                )
                            )
                        )
                )

                Row(
                    modifier = Modifier
                        .matchParentSize()
                        .padding(horizontal = innerPadding / 2f)
                ) {
                    SonicUiNavigationMap.forEachIndexed { index, tab ->
                        val isSelected = selectedIndex == index
                        val focus by animateFloatAsState(
                            targetValue = if (isSelected) 1f else 0f,
                            animationSpec = tween(280, easing = easing)
                        )

                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .fillMaxHeight()
                                .clickable(
                                    interactionSource = remember { MutableInteractionSource() },
                                    indication = null
                                ) { onTabSelected(index) }
                        ) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .heightIn(min = minTabHeight)
                                    .align(Alignment.Center)
                                    .padding(vertical = 4.mScaled)
                            ) {
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.Center)
                                        .graphicsLayer {
                                            translationY = activeTranslationY.toPx() * focus
                                        }
                                ) {
                                    tab.icon(
                                        26.mScaled,
                                        if (isSelected) SonicTheme.colors.primary else SonicTheme.colors.outline,
                                        isSelected,
                                        Modifier
                                    )
                                }
                                
                                Text(
                                    text = tab.title,
                                    color = SonicTheme.colors.primary,
                                    fontSize = 13.mTextScaled,
                                    fontWeight = androidx.compose.ui.text.font.FontWeight.SemiBold,
                                    maxLines = 1,
                                    overflow = androidx.compose.ui.text.style.TextOverflow.Ellipsis,
                                    modifier = Modifier
                                        .align(Alignment.BottomCenter)
                                        .padding(bottom = 6.mScaled)
                                        .alpha(focus)
                                        .graphicsLayer {
                                            translationY = inactiveTranslationY.toPx() * (1f - focus)
                                        }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
