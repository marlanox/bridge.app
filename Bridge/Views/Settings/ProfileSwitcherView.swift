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
                                    Text(String(format: L("profiles.summary"), profile.currency, profile.sessionHistory.count))
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
                    Text(L("profiles.new_profile_prompt"))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Button(L("profiles.start_new")) {
                        showingNewProfileConfirm = true
                    }
                }
            }
            .navigationTitle(Text(L("profiles.title")))
            .navigationBarTitleDisplayMode(.inline)
            .confirmationDialog(
                Text(L("profiles.start_new")),
                isPresented: $showingNewProfileConfirm,
                titleVisibility: .visible
            ) {
                Button(L("profiles.start_new")) {
                    appState.createProfile(displayName: "")
                    dismiss()
                }
                Button(L("nav.skip"), role: .cancel) { }
            } message: {
                Text(L("profiles.new_profile_prompt"))
            }
        }
    }

    private func profileTitle(_ profile: RelationshipProfile) -> String {
        if !profile.partnerAName.isEmpty && !profile.partnerBName.isEmpty {
            return "\(profile.partnerAName) & \(profile.partnerBName)"
        }
        return profile.displayName.isEmpty ? L("profiles.new_relationship_fallback") : profile.displayName
    }
}
