import Foundation
import Combine

/// Owns the list of relationship profiles and the current session. There is always a
/// `session` (it starts parked at `.welcome`) so the app has one continuous view
/// hierarchy — finishing or abandoning a walk through the house simply hands back a
/// fresh session at Welcome for the same active profile.
///
/// Marked `@MainActor` (matching `StoreManager`) since it's only ever touched from
/// SwiftUI via `@StateObject`/`@EnvironmentObject`, which already guarantees main-thread
/// use — this just makes that explicit for the compiler's actor-isolation checking.
@MainActor
final class AppState: ObservableObject {
    @Published var profiles: [RelationshipProfile]
    @Published var activeProfileID: UUID?
    @Published var session: SessionViewModel

    private let persistence = PersistenceManager.shared

    init() {
        // Captured before anything below writes to disk — `saveProfiles` a few lines down
        // creates this file immediately (even for a brand-new default profile), which would
        // otherwise make "does local data already exist" always true by the time we ask.
        let hadNoLocalDataAtLaunch = !persistence.hasLocalProfilesFile

        var loaded = persistence.loadProfiles()
        if loaded.isEmpty {
            loaded = [RelationshipProfile()]
        }
        self.profiles = loaded
        let activeID = persistence.activeProfileID ?? loaded[0].id
        let resolvedActiveID = loaded.contains(where: { $0.id == activeID }) ? activeID : loaded[0].id
        self.activeProfileID = resolvedActiveID
        self.session = SessionViewModel(profile: loaded.first { $0.id == resolvedActiveID } ?? loaded[0])
        persistence.saveProfiles(self.profiles)

        // Real StoreKit entitlement is the source of truth for the unlock, so re-check it
        // at launch (covers reinstalls / new devices) and whenever the App Store reports
        // a change (a purchase completed elsewhere, a pending purchase clearing, etc.).
        StoreManager.shared.onEntitlementChanged = { [weak self] in self?.syncEntitlementFromStore() }
        syncEntitlementFromStore()

        // A fresh install/new phone has no local profile data yet — offer a restore from
        // this device's iCloud mirror (if any) before the app finishes launching. Never
        // attempted on a device that already had local data at launch.
        if hadNoLocalDataAtLaunch {
            persistence.fetchFromiCloud { [weak self] restored in
                self?.applyRestoredProfiles(restored)
            }
        }
    }

    private func applyRestoredProfiles(_ restored: [RelationshipProfile]?) {
        guard let restored, !restored.isEmpty else { return }
        profiles = restored
        let activeID = persistence.activeProfileID ?? restored[0].id
        activeProfileID = restored.contains(where: { $0.id == activeID }) ? activeID : restored[0].id
        session = SessionViewModel(profile: restored.first { $0.id == activeProfileID } ?? restored[0])
        persistence.saveProfiles(profiles)
    }

    private func syncEntitlementFromStore() {
        Task {
            let entitled = await StoreManager.shared.isEntitledToFullVersion()
            guard entitled, var profile = activeProfile, !profile.hasUnlockedFullVersion else { return }
            profile.hasUnlockedFullVersion = true
            activeProfile = profile
        }
    }

    var activeProfile: RelationshipProfile? {
        get { profiles.first { $0.id == activeProfileID } }
        set {
            guard let newValue else { return }
            if let index = profiles.firstIndex(where: { $0.id == newValue.id }) {
                profiles[index] = newValue
                persistence.saveProfiles(profiles)
            }
        }
    }

    @discardableResult
    func createProfile(displayName: String) -> RelationshipProfile {
        let profile = RelationshipProfile(displayName: displayName)
        profiles.append(profile)
        persistence.saveProfiles(profiles)
        selectProfile(profile.id)
        return profile
    }

    func selectProfile(_ id: UUID) {
        activeProfileID = id
        persistence.activeProfileID = id
        if let profile = activeProfile {
            session = SessionViewModel(profile: profile)
        }
    }

    /// Folds the finished session's tokens into the profile, persists the updated
    /// couple's agreement, and parks a fresh session back at Welcome.
    func endActiveSession() {
        guard var profile = activeProfile else { return }
        session.finish()
        TokenManager.settle(session: session.session, into: &profile)
        profile.couplesAgreement = session.couplesAgreement
        profile.partnerAName = session.session.partnerA.name
        profile.partnerBName = session.session.partnerB.name
        profile.hasCompletedFirstSession = true
        profile.sessionHistory.append(
            SessionSummary(
                id: session.session.id,
                date: Date(),
                greenEarned: session.session.greenTokensEarned,
                redEarned: session.session.redTokensEarned
            )
        )
        activeProfile = profile
        session = SessionViewModel(profile: profile)
    }

    func abandonActiveSession() {
        guard let profile = activeProfile else { return }
        session = SessionViewModel(profile: profile)
    }

    /// A brand-new session may only begin if the profile hasn't used its one free
    /// session yet, or has unlocked the full version (spec section 2, monetization).
    var canStartSession: Bool {
        guard let profile = activeProfile else { return false }
        return !profile.hasCompletedFirstSession || profile.hasUnlockedFullVersion
    }

    /// Permanently deletes the active relationship profile — its tokens, session
    /// history, couple's agreement, and every voice note it ever recorded — per the
    /// App Store checklist's in-app deletion requirement. Always leaves at least one
    /// (fresh) profile behind so the app has somewhere to land.
    func deleteActiveProfileData() {
        guard let profile = activeProfile else { return }

        var sessionIDs = Set(profile.sessionHistory.map(\.id))
        sessionIDs.insert(session.session.id)
        for sessionID in sessionIDs {
            for role in PartnerRole.allCases {
                try? FileManager.default.removeItem(at: persistence.voiceNoteURL(sessionID: sessionID, role: role))
            }
        }

        profiles.removeAll { $0.id == profile.id }
        if profiles.isEmpty {
            profiles = [RelationshipProfile()]
        }
        persistence.saveProfiles(profiles)
        selectProfile(profiles[0].id)
    }
}
