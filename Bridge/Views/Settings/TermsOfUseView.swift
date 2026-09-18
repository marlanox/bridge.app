import SwiftUI

/// Full legal text lives here for the same reason as `PrivacyPolicyView` — deliberate
/// legal review, not the auto-localization table. Mirrored in `Docs/TERMS_OF_USE.md`.
struct TermsOfUseView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(Self.text)
                    .font(.body)
                    .padding(24)
            }
            .navigationTitle(Text(LocalizedStringKey("terms.title")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(LocalizedStringKey("settings.done")) { dismiss() }
                }
            }
        }
    }

    static let text = """
    Last updated: this text ships with the app source and should be re-dated whenever it changes.

    By using Bridge, you agree to these terms.

    WHAT BRIDGE IS

    Bridge is a guided communication tool for couples — a structured set of prompts, cards, and rituals meant to help two people talk through a conflict. It is not therapy, counseling, or any form of medical or mental health treatment, and it does not replace professional support. If you or your partner are experiencing abuse, crisis, or ongoing distress, please contact a licensed professional or a crisis line in your country (see Settings → Need help now?).

    PURCHASES

    Bridge's first full session is free. The full version is unlocked with a one-time, non-subscription in-app purchase, processed by Apple. You can restore a previous purchase on a new device from the paywall's Restore Purchases button. Refunds are handled by Apple under the App Store's standard refund policy — Bridge cannot issue refunds directly.

    YOUR CONTENT

    Anything you type or record in Bridge (names, cards, voice notes) stays on your device, as described in the Privacy Policy. You're responsible for what you and your partner choose to write, say, or record.

    NO WARRANTY

    Bridge is provided "as is." We don't guarantee it will resolve any particular conflict or improve any particular relationship — it's a tool, not a promise.

    LIMITATION OF LIABILITY

    To the fullest extent permitted by law, Bridge's developer is not liable for any indirect, incidental, or consequential damages arising from use of the app.

    CHANGES

    If these terms change, the updated text will ship with the app update and the "Last updated" line above will change accordingly.

    CONTACT

    Questions about these terms can be sent to the support address listed on Bridge's App Store page.
    """
}
