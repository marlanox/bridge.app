import SwiftUI

/// Full legal text now lives in Localizable.strings (`terms.full_text`) for the same
/// reason as `PrivacyPolicyView`. Mirrored in `Docs/TERMS_OF_USE.md`.
struct TermsOfUseView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(L("terms.full_text"))
                    .font(.body)
                    .padding(24)
            }
            .navigationTitle(Text(L("terms.title")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(L("settings.done")) { dismiss() }
                        .accessibilityIdentifier("uitest.legal.done")
                }
            }
        }
    }
}
