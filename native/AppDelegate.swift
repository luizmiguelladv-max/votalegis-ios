import UIKit
import WebKit
import Capacitor

/// Bridge próprio do VotaLegis.
///
/// O site continua sendo a fonte da interface, mas o contêiner iOS precisa
/// controlar comportamentos que pertencem ao WKWebView: zoom, viewport móvel e
/// aplicação consistente das safe areas em todas as rotas remotas.
@objc(VotaLegisBridgeViewController)
final class VotaLegisBridgeViewController: CAPBridgeViewController {
    private var appliedSafeAreaInsets: UIEdgeInsets?

    override func webViewConfiguration(
        for instanceConfiguration: InstanceConfiguration
    ) -> WKWebViewConfiguration {
        let configuration = super.webViewConfiguration(for: instanceConfiguration)

        guard
            let scriptURL = Bundle.main.url(
                forResource: "votalegis-ios",
                withExtension: "js",
                subdirectory: "public"
            ),
            let source = try? String(contentsOf: scriptURL, encoding: .utf8)
        else {
            assertionFailure("Integração iOS do VotaLegis não foi incluída no bundle")
            return configuration
        }

        configuration.userContentController.addUserScript(
            WKUserScript(
                source: source,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true
            )
        )
        return configuration
    }

    override func capacitorDidLoad() {
        super.capacitorDidLoad()

        let appBackground = UIColor(
            red: 7.0 / 255.0,
            green: 20.0 / 255.0,
            blue: 38.0 / 255.0,
            alpha: 1
        )
        view.backgroundColor = appBackground
        webView?.backgroundColor = appBackground
        webView?.scrollView.backgroundColor = appBackground

        guard let scrollView = webView?.scrollView else {
            return
        }

        // O zoom de página não faz sentido no app. Além de parecer um site,
        // ele alterava a viewport efetiva e fazia cards e botões se sobreporem.
        scrollView.pinchGestureRecognizer?.isEnabled = false
        scrollView.minimumZoomScale = 1
        scrollView.maximumZoomScale = 1

        // As safe areas são aplicadas pela folha injetada. Manter o ajuste
        // nativo desligado evita somar o inset duas vezes.
        scrollView.contentInsetAdjustmentBehavior = .never
        scrollView.alwaysBounceHorizontal = false
        scrollView.showsHorizontalScrollIndicator = false
        scrollView.isDirectionalLockEnabled = true

        DispatchQueue.main.async { [weak self] in
            self?.syncSafeAreaInsetsIntoWebView()
        }
    }

    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        syncSafeAreaInsetsIntoWebView()
    }

    override func viewSafeAreaInsetsDidChange() {
        super.viewSafeAreaInsetsDidChange()
        syncSafeAreaInsetsIntoWebView()
    }

    private func syncSafeAreaInsetsIntoWebView() {
        guard isViewLoaded, let webView else {
            return
        }

        let insets = view.safeAreaInsets
        if let applied = appliedSafeAreaInsets,
           applied.top == insets.top,
           applied.right == insets.right,
           applied.bottom == insets.bottom,
           applied.left == insets.left {
            return
        }
        appliedSafeAreaInsets = insets

        let script = Self.safeAreaScript(for: insets)

        // O script persistente cobre login, redirecionamentos e trocas de rota
        // que criam um novo documento. A avaliação imediata corrige a página
        // que já estiver aberta quando o UIKit concluir o primeiro layout.
        webView.configuration.userContentController.addUserScript(
            WKUserScript(
                source: script,
                injectionTime: .atDocumentStart,
                forMainFrameOnly: true
            )
        )
        webView.evaluateJavaScript(script, completionHandler: nil)
    }

    private static func safeAreaScript(for insets: UIEdgeInsets) -> String {
        let top = cssPixels(insets.top)
        let right = cssPixels(insets.right)
        let bottom = cssPixels(insets.bottom)
        let left = cssPixels(insets.left)

        return """
        (() => {
          const root = document.documentElement;
          if (!root) return;
          root.style.setProperty('--vl-ios-native-safe-top', '\(top)px');
          root.style.setProperty('--vl-ios-native-safe-right', '\(right)px');
          root.style.setProperty('--vl-ios-native-safe-bottom', '\(bottom)px');
          root.style.setProperty('--vl-ios-native-safe-left', '\(left)px');
          root.dataset.vlIosNativeSafeArea = '\(top),\(right),\(bottom),\(left)';
          window.dispatchEvent(new Event('vl-ios-safe-area-change'));
        })();
        """
    }

    private static func cssPixels(_ value: CGFloat) -> String {
        String(format: "%.2f", locale: Locale(identifier: "en_US_POSIX"), Double(value))
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        window?.backgroundColor = UIColor(
            red: 7.0 / 255.0,
            green: 20.0 / 255.0,
            blue: 38.0 / 255.0,
            alpha: 1
        )
        return true
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey: Any] = [:]
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(app, open: url, options: options)
    }

    func application(
        _ application: UIApplication,
        continue userActivity: NSUserActivity,
        restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void
    ) -> Bool {
        return ApplicationDelegateProxy.shared.application(
            application,
            continue: userActivity,
            restorationHandler: restorationHandler
        )
    }
}
