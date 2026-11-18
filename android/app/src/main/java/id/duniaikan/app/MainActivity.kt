package id.duniaikan.app

import android.annotation.SuppressLint
import android.content.ActivityNotFoundException
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.os.SystemClock
import android.text.InputType
import android.view.View
import android.webkit.CookieManager
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.EditText
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var splashOverlay: LinearLayout
    private lateinit var splashServerLabel: TextView
    private lateinit var errorOverlay: LinearLayout
    private lateinit var errorDetail: TextView

    private val mainHandler = Handler(Looper.getMainLooper())
    private var isSplashActive = false
    private var splashShownAtMs = 0L
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    private val splashTimeoutRunnable = Runnable { fadeOutSplash() }
    private val hideSplashRunnable = Runnable { fadeOutSplash() }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult(),
    ) { result ->
        val uris = WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data)
        filePathCallback?.onReceiveValue(uris)
        filePathCallback = null
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        enableEdgeToEdge()
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        WindowCompat.getInsetsController(window, window.decorView).apply {
            isAppearanceLightStatusBars = false
            isAppearanceLightNavigationBars = false
        }

        val rootContainer = findViewById<FrameLayout>(R.id.rootContainer)
        ViewCompat.setOnApplyWindowInsetsListener(rootContainer) { view, windowInsets ->
            val bars = windowInsets.getInsets(
                WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.ime(),
            )
            view.updatePadding(
                left = bars.left,
                top = bars.top,
                right = bars.right,
                bottom = bars.bottom,
            )
            windowInsets
        }

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        splashOverlay = findViewById(R.id.splashOverlay)
        splashServerLabel = findViewById(R.id.splashServerLabel)
        errorOverlay = findViewById(R.id.errorOverlay)
        errorDetail = findViewById(R.id.errorDetail)

        findViewById<Button>(R.id.retryButton).setOnClickListener {
            loadTargetWithSplash(getActiveServerUrl())
        }

        findViewById<Button>(R.id.switchServerButton).setOnClickListener {
            showServerPickerDialog()
        }

        configureWebView()
        registerBackNavigation()

        applyIntentServerOverride(intent)
        if (savedInstanceState != null) {
            dismissSplashImmediately()
            webView.restoreState(savedInstanceState)
        } else {
            loadTargetWithSplash(getActiveServerUrl())
        }

        if (intent?.action == ACTION_SERVER_SETTINGS ||
            intent?.getBooleanExtra(EXTRA_OPEN_SERVER_PICKER, false) == true
        ) {
            showServerPickerDialog()
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        val updated = applyIntentServerOverride(intent)
        if (updated) {
            loadTargetWithSplash(getActiveServerUrl())
        }
        if (intent.action == ACTION_SERVER_SETTINGS ||
            intent.getBooleanExtra(EXTRA_OPEN_SERVER_PICKER, false)
        ) {
            showServerPickerDialog()
        }
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        webView.saveState(outState)
    }

    override fun onDestroy() {
        mainHandler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun configureWebView() {
        val cookieManager = CookieManager.getInstance()
        cookieManager.setAcceptCookie(true)
        cookieManager.setAcceptThirdPartyCookies(webView, true)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            loadsImagesAutomatically = true
            mediaPlaybackRequiresUserGesture = false
            useWideViewPort = true
            loadWithOverviewMode = true
            javaScriptCanOpenWindowsAutomatically = true
            setSupportMultipleWindows(true)
            mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
            userAgentString = userAgentString.replace("; wv", "")
        }

        webView.setDownloadListener { url, _, _, _, _ ->
            openExternalUri(Uri.parse(url))
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                errorOverlay.visibility = View.GONE
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                CookieManager.getInstance().flush()
                if (isSplashActive && errorOverlay.visibility != View.VISIBLE) {
                    scheduleSplashFadeOut()
                }
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?,
            ) {
                if (request?.isForMainFrame == true) {
                    val code = error?.errorCode ?: 0
                    val desc = error?.description?.toString().orEmpty()
                    if (code != ERROR_UNSUPPORTED_SCHEME) {
                        dismissSplashImmediately()
                        errorDetail.text = getString(
                            R.string.app_name,
                        ) + " tidak bisa terhubung ke:\n${getActiveServerUrl()}\n\nDetail: $desc ($code)"
                        errorOverlay.visibility = View.VISIBLE
                    }
                }
            }

            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val uri = request?.url ?: return false
                return handleUriNavigation(uri)
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress in 1..99) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                }
            }

            override fun onShowFileChooser(
                webView: WebView?,
                callback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?,
            ): Boolean {
                filePathCallback?.onReceiveValue(null)
                filePathCallback = callback
                return try {
                    val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "image/*"
                    }
                    fileChooserLauncher.launch(intent)
                    true
                } catch (_: ActivityNotFoundException) {
                    filePathCallback?.onReceiveValue(null)
                    filePathCallback = null
                    Toast.makeText(this@MainActivity, "Pemilih berkas tidak tersedia.", Toast.LENGTH_SHORT).show()
                    false
                }
            }

            override fun onCreateWindow(
                view: WebView?,
                isDialog: Boolean,
                isUserGesture: Boolean,
                resultMsg: Message?,
            ): Boolean {
                val transport = resultMsg?.obj as? WebView.WebViewTransport ?: return false
                val tempWebView = WebView(this@MainActivity)
                tempWebView.webViewClient = object : WebViewClient() {
                    override fun shouldOverrideUrlLoading(
                        popupView: WebView?,
                        request: WebResourceRequest?,
                    ): Boolean {
                        val targetUri = request?.url ?: return true
                        if (!handleUriNavigation(targetUri)) {
                            webView.loadUrl(targetUri.toString())
                        }
                        popupView?.destroy()
                        return true
                    }
                }
                transport.webView = tempWebView
                resultMsg.sendToTarget()
                return true
            }
        }
    }

    private fun handleUriNavigation(uri: Uri): Boolean {
        val scheme = uri.scheme?.lowercase().orEmpty()

        if (scheme == "http" || scheme == "https") {
            val host = uri.host?.lowercase().orEmpty()
            if (isWhatsAppOrStoreHost(host)) {
                openExternalUri(uri)
                return true
            }
            if (isInAppHost(host)) {
                return false
            }
            openExternalUri(uri)
            return true
        }

        if (scheme == "intent") {
            return handleIntentScheme(uri.toString())
        }

        openExternalUri(uri)
        return true
    }

    private fun handleIntentScheme(rawUrl: String): Boolean {
        return try {
            val parsedIntent = Intent.parseUri(rawUrl, Intent.URI_INTENT_SCHEME)
            if (parsedIntent.resolveActivity(packageManager) != null) {
                startActivity(parsedIntent)
            } else {
                val fallback = parsedIntent.getStringExtra("browser_fallback_url")
                if (!fallback.isNullOrBlank()) {
                    val fallbackUri = Uri.parse(fallback)
                    if (!handleUriNavigation(fallbackUri)) {
                        webView.loadUrl(fallback)
                    }
                } else {
                    Toast.makeText(this, "Aplikasi pembayaran terkait belum terpasang.", Toast.LENGTH_SHORT).show()
                }
            }
            true
        } catch (_: Exception) {
            Toast.makeText(this, "Tautan aplikasi eksternal tidak valid.", Toast.LENGTH_SHORT).show()
            true
        }
    }

    private fun isWhatsAppOrStoreHost(host: String): Boolean {
        return host == "wa.me" ||
            host == "api.whatsapp.com" ||
            host == "play.google.com"
    }

    private fun isInAppHost(host: String): Boolean {
        val activeHost = Uri.parse(getActiveServerUrl()).host?.lowercase().orEmpty()
        val prodHost = Uri.parse(BuildConfig.PROD_URL).host?.lowercase().orEmpty()
        return host == activeHost ||
            host == prodHost ||
            host == "localhost" ||
            host == "127.0.0.1" ||
            host == "10.0.2.2" ||
            host.startsWith("192.168.") ||
            host.startsWith("10.") ||
            host.endsWith(".midtrans.com") ||
            host.endsWith(".veritrans.co.id") ||
            host == "challenges.cloudflare.com"
    }

    private fun openExternalUri(uri: Uri) {
        try {
            startActivity(Intent(Intent.ACTION_VIEW, uri))
        } catch (_: ActivityNotFoundException) {
            Toast.makeText(this, "Tidak ada aplikasi untuk membuka tautan ini.", Toast.LENGTH_SHORT).show()
        }
    }

    private fun registerBackNavigation() {
        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        isEnabled = false
                        onBackPressedDispatcher.onBackPressed()
                    }
                }
            },
        )
    }

    private fun applyIntentServerOverride(intent: Intent?): Boolean {
        val overrideUrl = intent?.getStringExtra(EXTRA_SERVER_URL)?.trim().orEmpty()
        if (overrideUrl.startsWith("http://") || overrideUrl.startsWith("https://")) {
            saveActiveServerUrl(overrideUrl.trimEnd('/'))
            return true
        }
        return false
    }

    private fun getActiveServerUrl(): String {
        val prefs = getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
        val saved = prefs.getString(KEY_SERVER_URL, null)
        // Migrate users upgrading from v1.0.0 away from the paused legacy Vercel deployment.
        if (saved == null || saved == LEGACY_PROD_URL) {
            if (saved == LEGACY_PROD_URL) {
                prefs.edit().putString(KEY_SERVER_URL, BuildConfig.PROD_URL).apply()
            }
            return BuildConfig.PROD_URL
        }
        return saved
    }

    private fun saveActiveServerUrl(url: String) {
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .edit()
            .putString(KEY_SERVER_URL, url.trimEnd('/'))
            .apply()
    }

    private fun showServerPickerDialog() {
        val current = getActiveServerUrl()
        val presets = arrayOf(
            "Online Vercel (${BuildConfig.PROD_URL})" to BuildConfig.PROD_URL,
            "Lokal Emulator AVD (${BuildConfig.LOCAL_EMULATOR_URL})" to BuildConfig.LOCAL_EMULATOR_URL,
            "Lokal USB / ADB Reverse (${BuildConfig.LOCAL_USB_URL})" to BuildConfig.LOCAL_USB_URL,
            "Custom IP Wi-Fi / LAN..." to "__custom__",
        )
        val labels = presets.map { (label, url) ->
            if (url == current) "● $label" else label
        }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("Pilih Server Dunia Ikan")
            .setItems(labels) { _, which ->
                val target = presets[which].second
                if (target == "__custom__") {
                    showCustomUrlDialog(current)
                } else {
                    saveActiveServerUrl(target)
                    loadTargetWithSplash(target)
                }
            }
            .setNegativeButton("Batal", null)
            .show()
    }

    private fun showCustomUrlDialog(current: String) {
        val input = EditText(this).apply {
            inputType = InputType.TYPE_TEXT_VARIATION_URI
            hint = "http://192.168.1.10:8000"
            setText(
                if (current.startsWith("http://192.168.") || current.startsWith("http://10.")) {
                    current
                } else {
                    "http://192.168.1."
                },
            )
            setPadding(48, 32, 48, 32)
        }

        AlertDialog.Builder(this)
            .setTitle("Alamat Server Lokal / LAN")
            .setMessage("Jalankan di PC: php artisan serve --host=0.0.0.0 --port=8000")
            .setView(input)
            .setPositiveButton("Pakai") { _, _ ->
                val raw = input.text.toString().trim().trimEnd('/')
                if (raw.startsWith("http://") || raw.startsWith("https://")) {
                    saveActiveServerUrl(raw)
                    loadTargetWithSplash(raw)
                } else {
                    Toast.makeText(this, "URL harus diawali http:// atau https://", Toast.LENGTH_SHORT).show()
                }
            }
            .setNegativeButton("Batal", null)
            .show()
    }

    private fun loadTargetWithSplash(url: String) {
        mainHandler.removeCallbacks(splashTimeoutRunnable)
        mainHandler.removeCallbacks(hideSplashRunnable)
        errorOverlay.visibility = View.GONE
        splashServerLabel.text = url
        splashOverlay.animate().cancel()
        splashOverlay.alpha = 1f
        splashOverlay.visibility = View.VISIBLE
        isSplashActive = true
        splashShownAtMs = SystemClock.elapsedRealtime()
        mainHandler.postDelayed(splashTimeoutRunnable, MAX_SPLASH_TIMEOUT_MS)
        webView.loadUrl(url)
    }

    private fun scheduleSplashFadeOut() {
        mainHandler.removeCallbacks(hideSplashRunnable)
        val elapsed = SystemClock.elapsedRealtime() - splashShownAtMs
        val remaining = maxOf(0L, MIN_SPLASH_DURATION_MS - elapsed)
        mainHandler.postDelayed(hideSplashRunnable, remaining)
    }

    private fun fadeOutSplash() {
        mainHandler.removeCallbacks(splashTimeoutRunnable)
        mainHandler.removeCallbacks(hideSplashRunnable)
        if (!isSplashActive) {
            return
        }
        isSplashActive = false
        splashOverlay.animate()
            .alpha(0f)
            .setDuration(260L)
            .withEndAction {
                splashOverlay.visibility = View.GONE
                splashOverlay.alpha = 1f
            }
            .start()
    }

    private fun dismissSplashImmediately() {
        mainHandler.removeCallbacks(splashTimeoutRunnable)
        mainHandler.removeCallbacks(hideSplashRunnable)
        isSplashActive = false
        splashOverlay.animate().cancel()
        splashOverlay.visibility = View.GONE
        splashOverlay.alpha = 1f
    }

    companion object {
        const val ACTION_SERVER_SETTINGS = "id.duniaikan.app.ACTION_SERVER_SETTINGS"
        const val EXTRA_SERVER_URL = "server_url"
        const val EXTRA_OPEN_SERVER_PICKER = "open_server_picker"
        private const val PREFS_NAME = "dunia_ikan_prefs"
        private const val KEY_SERVER_URL = "server_url"
        private const val LEGACY_PROD_URL = "https://dunia-ikan.vercel.app"
        private const val MIN_SPLASH_DURATION_MS = 1200L
        private const val MAX_SPLASH_TIMEOUT_MS = 8000L
    }
}
