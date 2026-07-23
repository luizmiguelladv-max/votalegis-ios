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
    }
}

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
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
