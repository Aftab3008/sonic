package com.aftab005.sonic.features.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled

/**
 * Glass-style text input — KMP equivalent of the Expo GlassInput component.
 *
 * Used in both LoginScreen and SignUpScreen.
 * Supports: label, placeholder, error state, trailing icon, secure text, keyboard config.
 * Implements pixel-perfect scaling matching Expo's moderateScale logic.
 */
@Composable
fun AuthTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    placeholder: String = "",
    modifier: Modifier = Modifier,
    errorMessage: String? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    enabled: Boolean = true
) {
    var isFocused by remember { mutableStateOf(false) }
    val hasError = errorMessage != null

    val labelColor = when {
        hasError -> SonicTheme.colors.error
        isFocused -> SonicTheme.colors.primary
        else -> Color.White.copy(alpha = 0.6f)
    }

    val borderColor = when {
        hasError -> SonicTheme.colors.error.copy(alpha = 0.6f)
        isFocused -> SonicTheme.colors.primary.copy(alpha = 0.6f)
        else -> Color.White.copy(alpha = 0.1f)
    }

    Column(modifier = modifier.fillMaxWidth()) {
        Text(
            text = label.uppercase(),
            color = labelColor,
            fontSize = 10.5f.mTextScaled,
            fontWeight = FontWeight.W900,
            letterSpacing = 2.5.sp,
            modifier = Modifier.padding(start = 16.mScaled, bottom = 9.mScaled)
        )

        Box(
            contentAlignment = Alignment.CenterStart,
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 60.mScaled)
                .clip(RoundedCornerShape(22.mScaled))
                .background(Color.White.copy(alpha = 0.06f))
                .border(
                    width = 1.dp,
                    color = borderColor,
                    shape = RoundedCornerShape(22.mScaled)
                )
                .padding(horizontal = 20.mScaled)
        ) {
            BasicTextField(
                value = value,
                onValueChange = onValueChange,
                enabled = enabled,
                textStyle = TextStyle(
                    color = Color.White,
                    fontSize = 14.mTextScaled,
                    fontWeight = FontWeight.W600,
                    letterSpacing = 0.5.sp
                ),
                cursorBrush = SolidColor(SonicTheme.colors.primary),
                visualTransformation = visualTransformation,
                keyboardOptions = keyboardOptions,
                keyboardActions = keyboardActions,
                singleLine = true,
                decorationBox = { innerTextField ->
                    Box(contentAlignment = Alignment.CenterStart) {
                        if (value.isEmpty()) {
                            Text(
                                text = placeholder,
                                color = Color.White.copy(alpha = 0.25f),
                                fontSize = 14.mTextScaled,
                                fontWeight = FontWeight.W400
                            )
                        }
                        innerTextField()
                    }
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .onFocusChanged { isFocused = it.isFocused }
                    .padding(end = if (trailingIcon != null) 36.mScaled else 0.dp)
            )

            if (trailingIcon != null) {
                Box(modifier = Modifier.align(Alignment.CenterEnd)) {
                    trailingIcon()
                }
            }
        }

        if (hasError) {
            Text(
                text = errorMessage,
                color = SonicTheme.colors.error,
                fontSize = 12.mTextScaled,
                fontWeight = FontWeight.W500,
                modifier = Modifier.padding(start = 8.mScaled, top = 4.mScaled)
            )
        }
    }
}
