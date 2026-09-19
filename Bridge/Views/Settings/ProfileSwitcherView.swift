import SwiftUI
import Foundation

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
                    ForEach(appState.profiles) { (profile: RelationshipProfile) in
                        ProfileRow(
                            profile: profile,
                            isActive: profile.id == appState.activeProfileID,
                            onSelect: {
                                appState.selectProfile(profile.id)
                                dismiss()
                            }
                        )
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
}

/// One row in the profile switcher — pulled out of `ForEach`'s trailing closure so each
/// row's body is checked as its own independent unit.
private struct ProfileRow: View {
    let profile: RelationshipProfile
    let isActive: Bool
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(title)
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.primary)
                    Text(summary)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Spacer()
                if isActive {
                    Image(systemName: "checkmark").foregroundStyle(Color.accentColor)
                }
            }
        }
    }

    private var title: String {
        if !profile.partnerAName.isEmpty && !profile.partnerBName.isEmpty {
            return "\(profile.partnerAName) & \(profile.partnerBName)"
        }
        return profile.displayName.isEmpty ? L("profiles.new_relationship_fallback") : profile.displayName
    }

    private var summary: String {
        String(format: L("profiles.summary"), profile.currency, profile.sessionHistory.count)
    }
}
