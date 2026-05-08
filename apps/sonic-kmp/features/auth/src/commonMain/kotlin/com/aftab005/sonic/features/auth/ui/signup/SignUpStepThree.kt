package com.aftab005.sonic.features.auth.ui.signup

import com.aftab005.sonic.features.auth.ui.common.AuthBackButton
import com.aftab005.sonic.features.auth.ui.common.GradientButton
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Warning
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.aftab005.sonic.core.ui.theme.SonicTheme
import com.aftab005.sonic.core.ui.theme.mScaled
import com.aftab005.sonic.core.ui.theme.mTextScaled
import com.aftab005.sonic.features.auth.presentation.SignUpUiState
import com.aftab005.sonic.features.auth.presentation.SignUpViewModel
import com.aftab005.sonic.features.auth.theme.CosmicViolet
import com.aftab005.sonic.features.auth.theme.CosmicVioletSoft

@Composable
fun SignUpStepThree(
    state: SignUpUiState,
    viewModel: SignUpViewModel
) {
    Column(verticalArrangement = Arrangement.spacedBy(16.mScaled)) {
        AuthBackButton(onClick = viewModel::onBackClicked)
        Column(modifier = Modifier.padding(start = 2.mScaled)) {
            Text(
                text = "ALMOST THERE",
                color = Color.White.copy(alpha = 0.3f),
                fontSize = 10.mTextScaled,
                fontWeight = FontWeight.W800,
                letterSpacing = 3.sp
            )
            Spacer(Modifier.height(4.mScaled))
            Text(
                text = "Join",
                color = Color.White,
                fontSize = 36.mTextScaled,
                fontWeight = FontWeight.W900,
                letterSpacing = (-1.5).sp,
                lineHeight = 38.mTextScaled
            )
            Text(
                text = "Sonic",
                style = TextStyle(
                    brush = Brush.horizontalGradient(
                        colors = listOf(CosmicViolet, CosmicVioletSoft)
                    ),
                    fontSize = 36.mTextScaled,
                    fontWeight = FontWeight.W900,
                    letterSpacing = (-1.5).sp,
                    lineHeight = 38.mTextScaled
                )
            )
        }

        Spacer(Modifier.height(8.mScaled))

        if (state.serverError != null) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(
                        width = 1.dp,
                        color = SonicTheme.colors.error.copy(alpha = 0.3f),
                        shape = RoundedCornerShape(12.mScaled)
                    )
                    .background(
                        SonicTheme.colors.errorContainer.copy(alpha = 0.10f),
                        RoundedCornerShape(12.mScaled)
                    )
                    .padding(12.mScaled),
                horizontalArrangement = Arrangement.spacedBy(10.mScaled),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Outlined.Warning,
                    contentDescription = null,
                    tint = SonicTheme.colors.error,
                    modifier = Modifier.size(16.mScaled)
                )
                Text(
                    text = state.serverError,
                    color = SonicTheme.colors.error,
                    fontSize = 13.mTextScaled,
                    fontWeight = FontWeight.W600
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    CosmicViolet.copy(alpha = 0.08f),
                    RoundedCornerShape(14.mScaled)
                )
                .border(
                    width = 1.dp,
                    color = CosmicViolet.copy(alpha = 0.2f),
                    shape = RoundedCornerShape(14.mScaled)
                )
                .padding(16.mScaled),
            verticalArrangement = Arrangement.spacedBy(8.mScaled)
        ) {
            SummaryRow(label = "NAME", value = state.name)
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(Color.White.copy(alpha = 0.05f))
            )
            SummaryRow(label = "EMAIL", value = state.email)
        }

        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { viewModel.onTermsAcceptedChanged(!state.termsAccepted) }
                    .padding(vertical = 8.mScaled, horizontal = 4.mScaled),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.mScaled)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(20.mScaled)
                        .background(
                            if (state.termsAccepted) CosmicViolet.copy(alpha = 0.2f)
                            else Color.White.copy(alpha = 0.04f),
                            RoundedCornerShape(5.mScaled)
                        )
                        .border(
                            width = 1.5.dp,
                            color = if (state.termsAccepted) CosmicViolet.copy(alpha = 0.6f)
                            else Color.White.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(5.mScaled)
                        )
                ) {
                    if (state.termsAccepted) {
                        Text(
                            text = "✓",
                            color = CosmicViolet,
                            fontSize = 12.mTextScaled,
                            fontWeight = FontWeight.W700
                        )
                    }
                }

                Text(
                    text = buildAnnotatedString {
                        withStyle(SpanStyle(color = Color.White.copy(alpha = 0.5f))) {
                            append("I agree to the ")
                        }
                        withStyle(
                            SpanStyle(
                                color = Color.White.copy(alpha = 0.85f),
                                fontWeight = FontWeight.W700
                            )
                        ) {
                            append("Terms of Service")
                        }
                        withStyle(SpanStyle(color = Color.White.copy(alpha = 0.5f))) {
                            append(" and ")
                        }
                        withStyle(
                            SpanStyle(
                                color = Color.White.copy(alpha = 0.85f),
                                fontWeight = FontWeight.W700
                            )
                        ) {
                            append("Privacy Policy")
                        }
                    },
                    fontSize = 12.mTextScaled,
                    lineHeight = 18.mTextScaled
                )
            }
            if (state.termsError != null) {
                Text(
                    text = state.termsError,
                    color = SonicTheme.colors.error,
                    fontSize = 11.mTextScaled,
                    fontWeight = FontWeight.W500,
                    modifier = Modifier.padding(start = 8.mScaled, top = 2.mScaled)
                )
            }
        }

        Spacer(Modifier.height(4.mScaled))

        GradientButton(
            title = "JOIN SONIC",
            isLoading = state.isLoading,
            enabled = !state.isLoading,
            onClick = viewModel::onSignUpClicked
        )
    }
}


@Composable
private fun SummaryRow(label: String, value: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            color = Color.White.copy(alpha = 0.3f),
            fontSize = 9.mTextScaled,
            fontWeight = FontWeight.W700,
            letterSpacing = 1.5.sp
        )
        Text(
            text = value,
            color = Color.White.copy(alpha = 0.75f),
            fontSize = 12.mTextScaled,
            fontWeight = FontWeight.W600
        )
    }
}


