import SwiftUI

/// The settings hub — App Store checklist B.1/B.2/B.5 all point here: the wellness
/// disclaimer and crisis resources must be reachable outside onboarding, and the
/// privacy policy / terms / restore purchases / data deletion all need a home.
struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @Environment(\.dismiss) private var dismiss

    @State private var showingProfiles = false
    @State private var showingDisclaimer = false
    @State private var showingCrisis = false
    @State private var showingPrivacy = false
    @State private var showingTerms = false
    @State private var showingDeleteConfirm = false
    @State private var restoreAlertMessage: String?

    private var appVersion: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
    }

    var body: some View {
        NavigationStack {
            List {
                Section(LocalizedStringKey("settings.section_relationship")) {
                    Button(LocalizedStringKey("settings.relationships_row")) {
                        showingProfiles = true
                    }
                }

                Section(LocalizedStringKey("settings.section_support")) {
                    Button(LocalizedStringKey("settings.disclaimer_row")) {
                        showingDisclaimer = true
                    }
                    Button(LocalizedStringKey("settings.crisis_row")) {
                        showingCrisis = true
                    }
                }

                Section(LocalizedStringKey("settings.section_legal")) {
                    Button(LocalizedStringKey("settings.privacy_row")) {
                        showingPrivacy = true
                    }
                    Button(LocalizedStringKey("settings.terms_row")) {
                        showingTerms = true
                    }
                    Button(LocalizedStringKey("settings.restore_purchases_row")) {
                        restore()
                    }
                }

                Section(LocalizedStringKey("settings.section_data")) {
                    Button(role: .destructive) {
                        showingDeleteConfirm = true
                    } label: {
                        Text(LocalizedStringKey("settings.delete_data_row"))
                    }
                }

                Section {
                    HStack {
                        Text(LocalizedStringKey("settings.version_row"))
                        Spacer()
                        Text(appVersion).foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle(Text(LocalizedStringKey("settings.title")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(LocalizedStringKey("settings.done")) { dismiss() }
                }
            }
        }
        .sheet(isPresented: $showingProfiles) { ProfileSwitcherView() }
        .sheet(isPresented: $showingCrisis) { CrisisResourcesView() }
        .sheet(isPresented: $showingPrivacy) { PrivacyPolicyView() }
        .sheet(isPresented: $showingTerms) { TermsOfUseView() }
        .sheet(isPresented: $showingDisclaimer) {
            NavigationStack {
                ScrollView { DisclaimerContent().padding(24) }
                    .toolbar {
                        ToolbarItem(placement: .confirmationAction) {
                            Button(LocalizedStringKey("settings.done")) { showingDisclaimer = false }
                        }
                    }
            }
        }
        .confirmationDialog(
            Text(LocalizedStringKey("settings.delete_confirm_title")),
            isPresented: $showingDeleteConfirm,
            titleVisibility: .visible
        ) {
            Button(LocalizedStringKey("settings.delete_confirm_button"), role: .destructive) {
                appState.deleteActiveProfileData()
                dismiss()
            }
            Button(LocalizedStringKey("settings.cancel"), role: .cancel) { }
        } message: {
            Text(LocalizedStringKey("settings.delete_confirm_message"))
        }
        .alert(restoreAlertMessage ?? "", isPresented: Binding(
            get: { restoreAlertMessage != nil },
            set: { if !$0 { restoreAlertMessage = nil } }
        )) {
            Button(LocalizedStringKey("paywall.ok")) { restoreAlertMessage = nil }
        }
    }

    /// No StoreKit integration yet (see README) — this reflects the one signal the app
    /// actually has (the local unlock flag) rather than pretending to contact a store.
    private func restore() {
        if appState.activeProfile?.hasUnlockedFullVersion == true {
            restoreAlertMessage = NSLocalizedString("paywall.restore_success", comment: "")
        } else {
            restoreAlertMessage = NSLocalizedString("paywall.restore_none_found", comment: "")
        }
    }
}
