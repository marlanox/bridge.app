import SwiftUI

/// One-time unlock, $14.99 (spec section 2), via real StoreKit 2. Shown after the first
/// free session. `StoreManager.fullVersionProduct` is nil until the App Store (or the
/// local `Bridge.storekit` config in the simulator) responds — the button falls back to
/// the static "$14.99" copy until then, then shows the live, localized store price.
///
/// Includes the Restore Purchases button, and Terms/Privacy links, that Apple's App
/// Store review requires on any paywall (checklist B.5) — a missing Restore Purchases
/// button is one of the most common avoidable rejection reasons.
struct PaywallView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var store = StoreManager.shared
    @Environment(\.dismiss) private var dismiss

    @State private var showingTerms = false
    @State private var showingPrivacy = false
    @State private var isPurchasing = false
    @State private var isRestoring = false
    @State private var alertMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "lock.open.fill")
                .font(.system(size: 48))
                .foregroundStyle(Color(red: 0.36, green: 0.31, blue: 0.27))
            Text(L("paywall.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("paywall.body"))
                .font(.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
            Text(L("paywall.packs_coming_soon"))
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 30)
            Spacer()

            PrimaryButton(
                titleKey: "paywall.unlock_button",
                customTitle: store.fullVersionProduct.map { LF("paywall.unlock_button_priced", $0.displayPrice) },
                isLoading: isPurchasing
            ) {
                Task { await purchase() }
            }

            Button {
                Task { await restore() }
            } label: {
                if isRestoring {
                    ProgressView()
                } else {
                    Text(L("paywall.restore"))
                }
            }
            .font(.subheadline.weight(.medium))
            .disabled(isRestoring)

            SecondaryButton(titleKey: "paywall.maybe_later") {
                dismiss()
            }

            HStack(spacing: 16) {
                Button(L("terms.title")) { showingTerms = true }
                Text("·").foregroundStyle(.secondary)
                Button(L("privacy.title")) { showingPrivacy = true }
            }
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
        .task { await store.loadProducts() }
        .sheet(isPresented: $showingTerms) { TermsOfUseView() }
        .sheet(isPresented: $showingPrivacy) { PrivacyPolicyView() }
        .alert(alertMessage ?? "", isPresented: Binding(
            get: { alertMessage != nil },
            set: { if !$0 { alertMessage = nil } }
        )) {
            Button(L("paywall.ok")) { alertMessage = nil }
        }
    }

    private func purchase() async {
        isPurchasing = true
        let success = await store.purchaseFullVersion()
        isPurchasing = false
        if success {
            unlockLocally()
            dismiss()
        } else if let error = store.lastErrorMessage {
            alertMessage = error
        }
    }

    private func restore() async {
        isRestoring = true
        let entitled = await store.restorePurchases()
        isRestoring = false
        if entitled {
            unlockLocally()
            alertMessage = L("paywall.restore_success")
        } else {
            alertMessage = L("paywall.restore_none_found")
        }
    }

    private func unlockLocally() {
        guard var profile = appState.activeProfile else { return }
        profile.hasUnlockedFullVersion = true
        appState.activeProfile = profile
    }
}
