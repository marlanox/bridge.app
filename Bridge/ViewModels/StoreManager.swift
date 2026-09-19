import Foundation
import StoreKit

/// Product identifiers for Bridge's in-app purchases.
///
/// `fullVersion` is a **placeholder** — replace it with the real product identifier once
/// it exists in App Store Connect (App → Features → In-App Purchases → "+", type
/// Non-Consumable), and update the matching `productID` in `Bridge/Bridge.storekit`.
/// Nothing else in the app needs to change — everything reads this one constant.
enum StoreProductID {
    static let fullVersion = "com.bridge.app.fullversion"
}

enum StoreVerificationError: Error {
    case failedVerification
}

/// Real StoreKit 2 purchase flow for the one-time "Full version" unlock (spec section 2:
/// non-consumable, $14.99, no subscription, no server involved — Apple is the source of
/// truth for entitlement). `Bridge/Bridge.storekit` lets this be tested in the simulator
/// today, with the placeholder product ID, before any App Store Connect setup exists.
@MainActor
final class StoreManager: ObservableObject {
    static let shared = StoreManager()

    @Published private(set) var fullVersionProduct: Product?
    @Published private(set) var isLoadingProducts = false
    @Published var lastErrorMessage: String?

    /// Fires when a transaction updates outside an explicit purchase/restore call (a
    /// purchase completed on another device, a pending purchase clearing, etc.) —
    /// `AppState` listens to this to re-check entitlement and unlock the profile.
    var onEntitlementChanged: (() -> Void)?

    private var transactionListenerTask: Task<Void, Never>?

    private init() {
        transactionListenerTask = Task {
            for await result in Transaction.updates {
                if let transaction = try? Self.checkVerified(result) {
                    await transaction.finish()
                }
                onEntitlementChanged?()
            }
        }
        Task { await loadProducts() }
    }

    deinit {
        transactionListenerTask?.cancel()
    }

    func loadProducts() async {
        isLoadingProducts = true
        defer { isLoadingProducts = false }
        do {
            let products = try await Product.products(for: [StoreProductID.fullVersion])
            fullVersionProduct = products.first
        } catch {
            lastErrorMessage = error.localizedDescription
        }
    }

    /// Returns true only once the purchase is verified and finished — the caller can
    /// unlock the local profile immediately after.
    @discardableResult
    func purchaseFullVersion() async -> Bool {
        guard let product = fullVersionProduct else {
            lastErrorMessage = "This item isn't available right now. Please try again later."
            return false
        }
        do {
            let result = try await product.purchase()
            switch result {
            case .success(let verification):
                let transaction = try Self.checkVerified(verification)
                await transaction.finish()
                return true
            case .userCancelled, .pending:
                return false
            @unknown default:
                return false
            }
        } catch {
            lastErrorMessage = error.localizedDescription
            return false
        }
    }

    /// Syncs with the App Store and reports whether the full version is entitled — used
    /// by both the paywall's "Restore Purchases" button and a silent check at launch.
    @discardableResult
    func restorePurchases() async -> Bool {
        do {
            try await AppStore.sync()
        } catch {
            lastErrorMessage = error.localizedDescription
        }
        return await isEntitledToFullVersion()
    }

    func isEntitledToFullVersion() async -> Bool {
        for await result in Transaction.currentEntitlements {
            if let transaction = try? Self.checkVerified(result), transaction.productID == StoreProductID.fullVersion {
                return true
            }
        }
        return false
    }

    private static func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw StoreVerificationError.failedVerification
        case .verified(let safe):
            return safe
        }
    }
}
