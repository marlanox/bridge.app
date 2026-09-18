import SwiftUI

/// The settings hub — App Store checklist B.1/B.2/B.5 all point here: the wellness
/// disclaimer and crisis resources must be reachable outside onboarding, and the
/// privacy policy / terms / restore purchases / data deletion all need a home.
struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var loc: LocalizationManager
    @Environment(\.dismiss) private var dismiss

    @State private var showingProfiles = false
    @State private var showingDisclaimer = false
    @State private var showingCrisis = false
    @State private var showingPrivacy = false
    @State private var showingTerms = false
    @State private var showingDeleteConfirm = false
    @State private var showingLanguagePicker = false
    @State private var showingHouseMap = false
    @State private var restoreAlertMessage: String?

    private var appVersion: String {
        Bundle.main.object(forInfoDictionaryKey: "CFBundleShortVersionString") as? String ?? "1.0"
    }

    var body: some View {
        NavigationStack {
            List {
                Section(L("settings.section_relationship")) {
                    Button(L("settings.relationships_row")) {
                        showingProfiles = true
                    }
                    Button(L("settings.view_path_row")) {
                        showingHouseMap = true
                    }
                }

                Section(L("settings.section_support")) {
                    Button(L("settings.disclaimer_row")) {
                        showingDisclaimer = true
                    }
                    Button(L("settings.crisis_row")) {
                        showingCrisis = true
                    }
                    Button(L("settings.language_row")) {
                        showingLanguagePicker = true
                    }
                }

                Section(L("settings.section_legal")) {
                    Button(L("settings.privacy_row")) {
                        showingPrivacy = true
                    }
                    Button(L("settings.terms_row")) {
                        showingTerms = true
                    }
                    Button(L("settings.restore_purchases_row")) {
                        restore()
                    }
                }

                Section(L("settings.section_data")) {
                    Button(role: .destructive) {
                        showingDeleteConfirm = true
                    } label: {
                        Text(L("settings.delete_data_row"))
                    }
                }

                Section {
                    HStack {
                        Text(L("settings.version_row"))
                        Spacer()
                        Text(appVersion).foregroundStyle(.secondary)
                    }
                }
            }
            .navigationTitle(Text(L("settings.title")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(L("settings.done")) { dismiss() }
                }
            }
        }
        .sheet(isPresented: $showingProfiles) { ProfileSwitcherView() }
        .sheet(isPresented: $showingHouseMap) { HouseMapView(context: .settings) }
        .confirmationDialog(L("settings.language_row"), isPresented: $showingLanguagePicker) {
            ForEach(AppLanguage.allCases) { language in
                Button(language.displayName) { loc.setLanguage(language) }
            }
        }
        .sheet(isPresented: $showingCrisis) { CrisisResourcesView() }
        .sheet(isPresented: $showingPrivacy) { PrivacyPolicyView() }
        .sheet(isPresented: $showingTerms) { TermsOfUseView() }
        .sheet(isPresented: $showingDisclaimer) {
            NavigationStack {
                ScrollView { DisclaimerContent().padding(24) }
                    .toolbar {
                        ToolbarItem(placement: .confirmationAction) {
                            Button(L("settings.done")) { showingDisclaimer = false }
                        }
                    }
            }
        }
        .confirmationDialog(
            Text(L("settings.delete_confirm_title")),
            isPresented: $showingDeleteConfirm,
            titleVisibility: .visible
        ) {
            Button(L("settings.delete_confirm_button"), role: .destructive) {
                appState.deleteActiveProfileData()
                dismiss()
            }
            Button(L("settings.cancel"), role: .cancel) { }
        } message: {
            Text(L("settings.delete_confirm_message"))
        }
        .alert(restoreAlertMessage ?? "", isPresented: Binding(
            get: { restoreAlertMessage != nil },
            set: { if !$0 { restoreAlertMessage = nil } }
        )) {
            Button(L("paywall.ok")) { restoreAlertMessage = nil }
        }
    }

    /// No StoreKit integration yet (see README) — this reflects the one signal the app
    /// actually has (the local unlock flag) rather than pretending to contact a store.
    private func restore() {
        if appState.activeProfile?.hasUnlockedFullVersion == true {
            restoreAlertMessage = L("paywall.restore_success")
        } else {
            restoreAlertMessage = L("paywall.restore_none_found")
        }
    }
}
