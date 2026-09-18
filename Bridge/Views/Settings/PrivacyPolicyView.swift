import SwiftUI

/// Full legal text lives here (not in Localizable.strings, unlike the rest of the app's
/// copy) since a privacy policy needs deliberate legal review before translation, not
/// automatic localization. The identical text is also published as `Docs/PRIVACY_POLICY.md`
/// for hosting at a real URL — required before App Store submission (checklist B.2).
struct PrivacyPolicyView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(Self.text)
                    .font(.body)
                    .padding(24)
            }
            .navigationTitle(Text(LocalizedStringKey("privacy.title")))
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

    Bridge is designed to work without a server. This policy describes exactly what the app does, matching its actual architecture — nothing here describes aspirational or future behavior.

    WHAT BRIDGE COLLECTS

    • Partner names, session data (intensity, state, cards played, token counts), and your Couple's Agreement are stored only in the app's local storage on your device. None of it is sent to us or to any third party.
    • Voice snapshots (the optional 10-second recordings at the Bridge) are saved only as audio files on your device. They are never uploaded, synced, or shared — including with us.
    • Bridge does not require an account, sign-in, or internet connection to work.
    • Bridge does not use analytics, advertising SDKs, or third-party trackers.

    WHAT BRIDGE DOES NOT DO

    • We do not sell your data. There is no data to sell — it never leaves your device.
    • We do not share your data with third parties, because we never receive it in the first place.

    DELETING YOUR DATA

    You can permanently delete a relationship profile — its tokens, session history, couple's agreement, and any voice notes — from Settings → Delete this relationship's data. Deleting the app itself also removes all of its local data, per standard iOS behavior.

    CHILDREN

    Bridge is not directed at children and is rated 12+ due to mature emotional themes.

    CHANGES

    If this policy changes, the updated text will ship with the app update and the "Last updated" line above will change accordingly.

    CONTACT

    Questions about this policy can be sent to the support address listed on Bridge's App Store page.
    """
}
