// This is the final, correct, and stable version of MainActivity.kt

package com.myapp

import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen // 1. We need this import again

class MainActivity : ReactActivity() {

  /**
   * This is the official, non-crashing way to show the splash screen.
   * We call `super.onCreate()` FIRST, and then show the splash screen.
   */
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState) // 2. Call the original method first
    SplashScreen.show(this)             // 3. Then, show our splash screen
  }

  override fun getMainComponentName(): String = "MyApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}