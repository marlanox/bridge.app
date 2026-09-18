import SwiftUI

/// One-time unlock, $14.99 (spec section 2). Shown after the first free session.
/// StoreKit purchase wiring is intentionally left as a single call site here so it can
/// be dropped in later without touching the rest of the flow.
struct PaywallView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(spacing: 24) {
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
            SecondaryButton(titleKey: "paywall.maybe_later") {
                dismiss()
            }
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }

    private func unlock() {
        guard var profile = appState.activeProfile else { return }
        profile.hasUnlockedFullVersion = true
        appState.activeProfile = profile
        dismiss()
    }
}
