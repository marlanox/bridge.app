import Foundation

/// JSON-file persistence in the app's Documents directory — this stays the sole, synchronous
/// source of truth for every existing read/write, so nothing about today's behavior changes.
/// On top of that, every save is mirrored best-effort into the app's iCloud ubiquity
/// container in the background, and a fresh install with no local data yet is offered a
/// restore from that mirror — so a lost phone or a reinstall doesn't lose progress or voice
/// notes. iCloud is purely additive: with no iCloud account, iCloud Drive off, or the
/// capability unprovisioned, `url(forUbiquityContainerIdentifier:)` returns nil and every
/// mirror/restore call below silently no-ops, exactly like before iCloud support existed.
final class PersistenceManager {
    static let shared = PersistenceManager()

    private let profilesFileName = "relationship_profiles.json"
    private let activeProfileIDKey = "com.bridge.app.activeProfileID"

    /// File I/O against the iCloud container can block on network/disk, so it never runs on
    /// the caller's thread — callers get results back via completion handlers instead.
    private let iCloudQueue = DispatchQueue(label: "com.bridge.app.icloud-mirror", qos: .utility)

    private var documentsURL: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    private var profilesURL: URL {
        documentsURL.appendingPathComponent(profilesFileName)
    }

    private func voiceNotesFolderURL(in documentsRoot: URL) -> URL {
        documentsRoot.appendingPathComponent("VoiceNotes", isDirectory: true)
    }

    private let encoder: JSONEncoder = {
        let e = JSONEncoder()
        e.dateEncodingStrategy = .iso8601
        e.outputFormatting = [.prettyPrinted, .sortedKeys]
        return e
    }()

    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.dateDecodingStrategy = .iso8601
        return d
    }()

    private init() {}

    /// Whether this device already has local profile data, checked once before anything
    /// else touches disk this launch — callers use this to decide whether an iCloud restore
    /// is even worth attempting, since `saveProfiles` creates this file immediately (even for
    /// a brand-new default profile), which would otherwise make that check always true.
    var hasLocalProfilesFile: Bool {
        FileManager.default.fileExists(atPath: profilesURL.path)
    }

    func loadProfiles() -> [RelationshipProfile] {
        guard let data = try? Data(contentsOf: profilesURL) else { return [] }
        return (try? decoder.decode([RelationshipProfile].self, from: data)) ?? []
    }

    func saveProfiles(_ profiles: [RelationshipProfile]) {
        guard let data = try? encoder.encode(profiles) else { return }
        try? data.write(to: profilesURL, options: .atomic)
        mirrorToiCloud(data: data, relativePath: profilesFileName)
    }

    var activeProfileID: UUID? {
        get {
            guard let s = UserDefaults.standard.string(forKey: activeProfileIDKey) else { return nil }
            return UUID(uuidString: s)
        }
        set {
            UserDefaults.standard.set(newValue?.uuidString, forKey: activeProfileIDKey)
        }
    }

    /// Voice snapshot audio files live alongside profile data, named by session + partner.
    func voiceNoteURL(sessionID: UUID, role: PartnerRole) -> URL {
        let folder = voiceNotesFolderURL(in: documentsURL)
        if !FileManager.default.fileExists(atPath: folder.path) {
            try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        }
        return folder.appendingPathComponent("\(sessionID.uuidString)_\(role.rawValue).m4a")
    }

    /// Call once a voice note finishes recording so it rides along with the profile mirror —
    /// the recording itself only ever touches local disk, so mic capture is never slowed down
    /// or made to depend on iCloud's availability.
    func mirrorVoiceNoteToiCloud(sessionID: UUID, role: PartnerRole) {
        let url = voiceNoteURL(sessionID: sessionID, role: role)
        guard let data = try? Data(contentsOf: url) else { return }
        mirrorToiCloud(data: data, relativePath: "VoiceNotes/\(url.lastPathComponent)")
    }

    /// Attempts to fetch this device's iCloud mirror, if any. Callers must only invoke this
    /// when `hasLocalProfilesFile` was `false` *before* the first `saveProfiles` call this
    /// launch (a fresh install or a new phone) — an existing install's data must never be
    /// overwritten by an async iCloud result. Downloads the profiles JSON plus every voice
    /// note and hands the decoded profiles back via `completion`, called on the main queue.
    /// `nil` means there was nothing to restore, or iCloud isn't available.
    func fetchFromiCloud(completion: @escaping ([RelationshipProfile]?) -> Void) {
        let localProfilesURL = profilesURL
        let localVoiceNotesURL = voiceNotesFolderURL(in: documentsURL)
        let fileName = profilesFileName
        iCloudQueue.async { [decoder] in
            guard let container = FileManager.default.url(forUbiquityContainerIdentifier: nil) else {
                Task { @MainActor in completion(nil) }
                return
            }
            let remoteDocs = container.appendingPathComponent("Documents", isDirectory: true)
            let remoteProfilesURL = remoteDocs.appendingPathComponent(fileName)
            try? FileManager.default.startDownloadingUbiquitousItem(at: remoteProfilesURL)

            guard let data = try? Data(contentsOf: remoteProfilesURL),
                  let profiles = try? decoder.decode([RelationshipProfile].self, from: data) else {
                Task { @MainActor in completion(nil) }
                return
            }
            try? data.write(to: localProfilesURL, options: .atomic)

            let remoteVoiceNotes = remoteDocs.appendingPathComponent("VoiceNotes", isDirectory: true)
            if let files = try? FileManager.default.contentsOfDirectory(at: remoteVoiceNotes, includingPropertiesForKeys: nil) {
                try? FileManager.default.createDirectory(at: localVoiceNotesURL, withIntermediateDirectories: true)
                for file in files {
                    try? FileManager.default.startDownloadingUbiquitousItem(at: file)
                    let destination = localVoiceNotesURL.appendingPathComponent(file.lastPathComponent)
                    if !FileManager.default.fileExists(atPath: destination.path) {
                        try? FileManager.default.copyItem(at: file, to: destination)
                    }
                }
            }

            Task { @MainActor in completion(profiles) }
        }
    }

    /// Best-effort background copy into the app's iCloud ubiquity container. Silently does
    /// nothing if iCloud isn't available for this install — a convenience mirror, never a
    /// requirement for the app to function.
    private func mirrorToiCloud(data: Data, relativePath: String) {
        iCloudQueue.async {
            guard let container = FileManager.default.url(forUbiquityContainerIdentifier: nil) else { return }
            let destination = container
                .appendingPathComponent("Documents", isDirectory: true)
                .appendingPathComponent(relativePath)
            try? FileManager.default.createDirectory(
                at: destination.deletingLastPathComponent(),
                withIntermediateDirectories: true
            )
            try? data.write(to: destination, options: .atomic)
        }
    }
}
