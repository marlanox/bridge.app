import SwiftUI

/// Wellness-app disclaimer (App Store checklist B.1) — same pattern Calm/Headspace use.
/// Shown once during first-launch onboarding; also reachable anytime from Settings via
/// the standalone `DisclaimerContent` view below.
struct DisclaimerView: View {
    let onContinue: () -> Void

    @State private var showingCrisisResources = false

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            Spacer()
            DisclaimerContent()
            Button(L("disclaimer.need_help_now")) {
                showingCrisisResources = true
            }
            .font(.footnote.weight(.medium))
            Spacer()
            PrimaryButton(titleKey: "disclaimer.continue", action: onContinue)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
        .sheet(isPresented: $showingCrisisResources) {
            CrisisResourcesView()
        }
    }
}

/// The disclaimer text alone, reused by both the onboarding screen and Settings.
struct DisclaimerContent: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text(L("disclaimer.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("disclaimer.body"))
                .font(.body)
                .foregroundStyle(.secondary)
        }
    }
}
