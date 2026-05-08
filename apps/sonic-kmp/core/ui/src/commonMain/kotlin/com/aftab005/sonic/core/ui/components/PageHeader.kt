package com.aftab005.sonic.core.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.core.ui.theme.scaled
import com.aftab005.sonic.core.ui.theme.vScaled

@Composable
fun PageHeader(
        title: String,
        subtitle: String? = null,
        profileImageUrl: String? = null,
        onProfileClick: () -> Unit = {},
        onNotificationsClick: () -> Unit = {},
        showNotifications: Boolean = true,
        scrollY: Float = 0f,
        modifier: Modifier = Modifier
) {
    val bgAlpha = (scrollY / 80f).coerceIn(0f, 0.98f)
    val borderAlpha = (scrollY / 80f).coerceIn(0f, 0.15f)

    Row(
            modifier =
                    modifier.fillMaxWidth()
                            .background(SonicTheme.colors.surface.copy(alpha = bgAlpha))
                            .border(
                                    width = 1.dp,
                                    color =
                                            SonicTheme.colors.outlineVariant.copy(
                                                    alpha = borderAlpha
                                            )
                            )
                            .padding(horizontal = SonicTheme.dimensions.screenPadding)
                            .padding(top = 54.vScaled, bottom = 12.vScaled),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            if (subtitle != null) {
                Text(
                        text = subtitle,
                        color = SonicTheme.colors.onSurfaceVariant,
                        fontSize = 14.mTextScaled,
                        fontWeight = FontWeight.Medium,
                        modifier = Modifier.padding(bottom = 2.vScaled)
                )
            }
            Text(
                    text = title,
                    color = SonicTheme.colors.onSurface,
                    fontSize = 28.mTextScaled,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-0.8).sp
            )
        }

        Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(16.scaled)
        ) {
            if (showNotifications) {
                IconButton(onClick = onNotificationsClick, modifier = Modifier.size(32.scaled)) {
                    Icon(
                            imageVector = Icons.Outlined.Notifications,
                            contentDescription = "Notifications",
                            tint = SonicTheme.colors.onSurface,
                            modifier = Modifier.size(24.scaled)
                    )
                }
            }

            IconButton(
                    onClick = onProfileClick,
                    modifier =
                            Modifier.size(32.scaled)
                                    .clip(CircleShape)
                                    .border(
                                            width = 1.5.dp,
                                            color = SonicTheme.colors.primary.copy(alpha = 0.3f),
                                            shape = CircleShape
                                    )
            ) {
                AsyncImage(
                        model = profileImageUrl ?: "https://avatar.iran.liara.run/public/30",
                        contentDescription = "Profile",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                )
            }
        }
    }
}
