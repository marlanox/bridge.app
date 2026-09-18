import SwiftUI

/// Full legal text now lives in Localizable.strings (`privacy.full_text`, one entry per
/// language) so it translates natively along with the rest of the app. The identical
/// English text is also published as `Docs/PRIVACY_POLICY.md` for hosting at a real URL
/// — required before App Store submission (checklist B.2).
struct PrivacyPolicyView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(L("privacy.full_text"))
                    .font(.body)
                    .padding(24)
            }
            .navigationTitle(Text(L("privacy.title")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(L("settings.done")) { dismiss() }
                }
            }
        }
    }
}
