plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.composeMultiplatform)
    alias(libs.plugins.composeCompiler)
    alias(libs.plugins.kotlinxSerialization)
}

kotlin {
    androidTarget {
        compilerOptions {
            jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_11)
        }
    }
    
    listOf(iosX64(),iosArm64(), iosSimulatorArm64()).forEach { it.binaries.framework { baseName = "FeatureHome"; isStatic = true } }
    
    sourceSets {
        commonMain.dependencies {
            implementation(project(":core:ui"))
            implementation(project(":core:auth"))
            implementation(project(":core:network"))
            implementation(project(":core:navigation"))
            implementation(libs.compose.runtime)
            implementation(libs.compose.foundation)
            implementation(libs.compose.material3)
            implementation(libs.compose.material.icons.extended)
            implementation(libs.koin.compose.viewmodel)
            implementation(libs.kotlinx.datetime)
            implementation(libs.androidx.lifecycle.runtimeCompose)
            implementation(libs.coil.compose)
            implementation(libs.coil.network.ktor)
            implementation(libs.ktor.client.core)
            implementation(libs.multiplatform.settings.coroutines)
            implementation(libs.kotlinx.serialization.json)
        }
    }
}

android {
    namespace = "com.aftab005.sonic.features.home"
    compileSdk = libs.versions.android.compileSdk.get().toInt()
    defaultConfig { minSdk = libs.versions.android.minSdk.get().toInt() }
    compileOptions { sourceCompatibility = JavaVersion.VERSION_11; targetCompatibility = JavaVersion.VERSION_11 }
}
