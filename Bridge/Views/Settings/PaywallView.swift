import SwiftUI

/// One-time unlock, $14.99 (spec section 2). Shown after the first free session.
/// StoreKit purchase wiring is intentionally left as a single call site here so it can
/// be dropped in later without touching the rest of the flow.
///
/// Includes the Restore Purchases button, and Terms/Privacy links, that Apple's App
/// Store review requires on any paywall (checklist B.5) — a missing Restore Purchases
/// button is one of the most common avoidable rejection reasons.
struct PaywallView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var showingTerms = false
    @State private var showingPrivacy = false
    @State private var restoreAlertMessage: String?

    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Image(systemName: "lock.open.fill")
                .font(.system(size: 48))
                .foregroundStyle(Color(red: 0.36, green: 0.31, blue: 0.27))
            Text(LocalizedStringKey("paywall.title"))
                .font(.title.weight(.semibold))
            Text(LocalizedStringKey("paywall.body"))
                .font(.body)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
            Text(LocalizedStringKey("paywall.packs_coming_soon"))
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 30)
            Spacer()
            PrimaryButton(titleKey: "paywall.unlock_button") {
                unlock()
            }
            Button(LocalizedStringKey("paywall.restore")) {
                restore()
            }
            .font(.subheadline.weight(.medium))
            SecondaryButton(titleKey: "paywall.maybe_later") {
                dismiss()
            }

            HStack(spacing: 16) {
                Button(LocalizedStringKey("terms.title")) { showingTerms = true }
                Text("·").foregroundStyle(.secondary)
                Button(LocalizedStringKey("privacy.title")) { showingPrivacy = true }
            }
            .font(.caption)
            .foregroundStyle(.secondary)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
        .sheet(isPresented: $showingTerms) { TermsOfUseView() }
        .sheet(isPresented: $showingPrivacy) { PrivacyPolicyView() }
        .alert(restoreAlertMessage ?? "", isPresented: Binding(
            get: { restoreAlertMessage != nil },
            set: { if !$0 { restoreAlertMessage = nil } }
        )) {
            Button(LocalizedStringKey("paywall.ok")) { restoreAlertMessage = nil }
        }
    }

    private func unlock() {
        guard var profile = appState.activeProfile else { return }
        profile.hasUnlockedFullVersion = true
        appState.activeProfile = profile
        dismiss()
    }

    /// No StoreKit integration yet (see README) — this reflects the one signal the app
    /// actually has (the local unlock flag) rather than pretending to contact a store.
    private func restore() {
        if appState.activeProfile?.hasUnlockedFullVersion == true {
            restoreAlertMessage = NSLocalizedString("paywall.restore_success", comment: "")
            dismiss()
        } else {
            restoreAlertMessage = NSLocalizedString("paywall.restore_none_found", comment: "")
        }
    }
}
