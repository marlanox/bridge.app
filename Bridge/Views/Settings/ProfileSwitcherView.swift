import SwiftUI

/// Relationship profile switcher (spec section 2 / section 11 item 12). Each profile
/// keeps its own separate currency and session history.
struct ProfileSwitcherView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var showingNewProfileConfirm = false

    var body: some View {
        NavigationStack {
            List {
                Section {
                    ForEach(appState.profiles) { profile in
                        Button {
                            appState.selectProfile(profile.id)
                            dismiss()
                        } label: {
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(profileTitle(profile))
                                        .font(.subheadline.weight(.medium))
                                        .foregroundStyle(.primary)
                                    Text(String(format: NSLocalizedString("profiles.summary", comment: ""), profile.currency, profile.sessionHistory.count))
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                                Spacer()
                                if profile.id == appState.activeProfileID {
                                    Image(systemName: "checkmark").foregroundStyle(.accentColor)
                                }
                            }
                        }
                    }
                }
                Section {
                    Text(LocalizedStringKey("profiles.new_profile_prompt"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Button(LocalizedStringKey("profiles.start_new")) {
                        showingNewProfileConfirm = true
                    }
                }
            }
            .navigationTitle(Text(LocalizedStringKey("profiles.title")))
            .navigationBarTitleDisplayMode(.inline)
            .confirmationDialog(
                Text(LocalizedStringKey("profiles.start_new")),
                isPresented: $showingNewProfileConfirm,
                titleVisibility: .visible
            ) {
                Button(LocalizedStringKey("profiles.start_new")) {
                    appState.createProfile(displayName: "")
                    dismiss()
                }
                Button(LocalizedStringKey("nav.skip"), role: .cancel) { }
            } message: {
                Text(LocalizedStringKey("profiles.new_profile_prompt"))
            }
        }
    }

    private func profileTitle(_ profile: RelationshipProfile) -> String {
        if !profile.partnerAName.isEmpty && !profile.partnerBName.isEmpty {
            return "\(profile.partnerAName) & \(profile.partnerBName)"
        }
        return profile.displayName.isEmpty ? NSLocalizedString("profiles.new_relationship_fallback", comment: "") : profile.displayName
    }
}
