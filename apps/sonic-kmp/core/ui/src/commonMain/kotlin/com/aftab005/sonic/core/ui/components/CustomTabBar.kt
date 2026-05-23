package com.aftab005.sonic.core.ui.components

import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateDp
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.core.updateTransition
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.max
import com.aftab005.sonic.core.navigation.data.SonicTabItem
import com.aftab005.sonic.core.ui.navigation.SonicUiNavigationMap
import com.aftab005.sonic.core.ui.theme.*

@Composable
fun CustomTabBar(
    selectedIndex: Int,
    onTabSelected: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val easing = CubicBezierEasing(0.25f, 0.1f, 0.25f, 1f)
    val bottomPadding = 4.vScaled

    BoxWithConstraints(
        modifier = modifier.padding(bottom = bottomPadding).fillMaxWidth(),
        contentAlignment = Alignment.Center
    ) {
        val screenWidth = maxWidth
        val maxAllowedWidth =
            SonicTheme.dimensions.maxContentWidth.takeIf {
                it != Dp.Unspecified
            }
                ?: 420.scaled
        val tabBarWidth = minOf(max(screenWidth - 32.scaled, 0.dp), maxAllowedWidth)

        val innerPadding = 12.mScaled
        val availableWidth = max(tabBarWidth - innerPadding, 0.dp)
        val tabCount = SonicUiNavigationMap.size
        val tabWidth = if (tabCount > 0) availableWidth / tabCount.toFloat() else 0.dp

        val minTabHeight = 60.vScaled
        val minTabsRowHeight = 76.vScaled
        val pillRadius = 30.mScaled
        val pillHInset = 6.mScaled

        Box(modifier = Modifier.width(tabBarWidth).heightIn(min = minTabsRowHeight)) {
            Box(
                modifier =
                    Modifier.matchParentSize()
                        .offset(y = 3.mScaled)
                        .clip(RoundedCornerShape(30.mScaled))
                        .background(
                            SonicTheme.colors.primaryContainer.copy(alpha = 0.08f)
                        )
            )
            Box(
                modifier =
                    Modifier.matchParentSize()
                        .clip(RoundedCornerShape(32.mScaled))
                        .border(
                            1.2.scaled,
                            Color.White.copy(alpha = 0.12f),
                            RoundedCornerShape(32.mScaled)
                        )
                        .background(
                            Brush.verticalGradient(
                                colors =
                                    listOf(
                                        SonicTheme.colors
                                            .tabBarGradientStart,
                                        SonicTheme.colors
                                            .tabBarGradientEnd
                                    )
                            )
                        )
            ) {
                Box(
                    modifier =
                        Modifier.fillMaxWidth()
                            .padding(horizontal = 24.mScaled)
                            .height(1.2.scaled)
                            .background(
                                Brush.horizontalGradient(
                                    colors =
                                        listOf(
                                            Color.Transparent,
                                            SonicTheme.colors.primary
                                                .copy(alpha = 0.15f),
                                            SonicTheme.colors
                                                .primaryContainer
                                                .copy(alpha = 0.12f),
                                            Color.Transparent
                                        )
                                )
                            )
                )

                val hasMeasured = tabWidth > 0.dp

                val transition = updateTransition(
                    targetState = selectedIndex,
                    label = "tabIndicatorTransition"
                )

                val indicatorOffset by transition.animateDp(
                    transitionSpec = { tween(320, easing = easing) },
                    label = "indicatorOffset"
                ) { index ->
                    if (hasMeasured) tabWidth * index else 0.dp
                }

                val indicatorLeft = (innerPadding / 2f) + pillHInset
                val indicatorWidth = max(tabWidth - (pillHInset * 2f), 0.dp)
                if (hasMeasured) {
                    Box(
                        modifier =
                            Modifier.offset(x = indicatorOffset + indicatorLeft, y = 8.mScaled)
                                .width(indicatorWidth)
                                .height(minTabHeight)
                                .clip(RoundedCornerShape(pillRadius))
                                .background(
                                    Brush.linearGradient(
                                        colors =
                                            listOf(
                                                SonicTheme.colors
                                                    .tabBarIndicatorStart,
                                                SonicTheme.colors
                                                    .tabBarIndicatorEnd
                                            )
                                    )
                                )
                                .border(
                                    0.8.scaled,
                                    SonicTheme.colors.primary.copy(alpha = 0.12f),
                                    RoundedCornerShape(pillRadius)
                                )
                    )
                }

                Row(modifier = Modifier.matchParentSize().padding(horizontal = innerPadding / 2f)) {
                    SonicUiNavigationMap.forEachIndexed { index, tab ->
                        CustomTabItem(
                            tab = tab,
                            isSelected = selectedIndex == index,
                            easing = easing,
                            onTabSelected = { onTabSelected(index) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CustomTabItem(
    tab: SonicTabItem,
    isSelected: Boolean,
    easing: androidx.compose.animation.core.Easing,
    onTabSelected: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val focus by animateFloatAsState(
        targetValue = if (isSelected) 1f else 0f,
        animationSpec = tween(280, easing = easing)
    )

    val activeTranslationY = (-14).vScaled
    val inactiveTranslationY = 2.vScaled
    val minTabHeight = 60.vScaled

    Box(
        modifier =
            modifier.fillMaxHeight().clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null
            ) { onTabSelected() }
    ) {
        Box(
            modifier =
                Modifier.fillMaxWidth()
                    .heightIn(min = minTabHeight)
                    .align(Alignment.Center)
                    .padding(vertical = 4.mScaled)
        ) {
            Box(
                modifier =
                    Modifier.align(Alignment.Center).graphicsLayer {
                        translationY = activeTranslationY.toPx() * focus
                        scaleX = 1f + (0.05f * focus)
                        scaleY = 1f + (0.05f * focus)
                    }
            ) {
                tab.icon(
                    24.mScaled,
                    if (isSelected) SonicTheme.colors.primary
                    else SonicTheme.colors.outline.copy(alpha = 0.8f),
                    isSelected,
                    Modifier
                )
            }

            Text(
                text = tab.title,
                color = SonicTheme.colors.primary,
                fontSize = 12.mTextScaled,
                fontWeight = androidx.compose.ui.text.font.FontWeight.Bold,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                modifier =
                    Modifier.align(Alignment.BottomCenter)
                        .padding(bottom = 8.mScaled)
                        .alpha(focus)
                        .graphicsLayer {
                            translationY = inactiveTranslationY.toPx() * (1f - focus)
                        }
            )
        }
    }
}
