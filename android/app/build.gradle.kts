plugins {
    id("com.android.application")
}

android {
    namespace = "id.duniaikan.app"
    compileSdk = 37

    defaultConfig {
        applicationId = "id.duniaikan.app"
        minSdk = 24
        targetSdk = 36
        versionCode = 2
        versionName = "1.0.1"

        buildConfigField("String", "PROD_URL", "\"https://dunia-ikan-one.vercel.app\"")
        buildConfigField("String", "LOCAL_EMULATOR_URL", "\"http://10.0.2.2:8000\"")
        buildConfigField("String", "LOCAL_USB_URL", "\"http://127.0.0.1:8000\"")
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        buildConfig = true
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.19.0")
    implementation("androidx.appcompat:appcompat:1.8.0")
    implementation("androidx.activity:activity-ktx:1.13.0")
}
