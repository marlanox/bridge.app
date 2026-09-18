import Foundation

/// Simple JSON-file persistence in the app's Documents directory.
/// No server, no third-party DB dependency — matches "local storage" (build order step 1).
final class PersistenceManager {
    static let shared = PersistenceManager()

    private let profilesFileName = "relationship_profiles.json"
    private let activeProfileIDKey = "com.bridge.app.activeProfileID"

    private var documentsURL: URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    private var profilesURL: URL {
        documentsURL.appendingPathComponent(profilesFileName)
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

    func loadProfiles() -> [RelationshipProfile] {
        guard let data = try? Data(contentsOf: profilesURL) else { return [] }
        return (try? decoder.decode([RelationshipProfile].self, from: data)) ?? []
    }

    func saveProfiles(_ profiles: [RelationshipProfile]) {
        guard let data = try? encoder.encode(profiles) else { return }
        try? data.write(to: profilesURL, options: .atomic)
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
        let folder = documentsURL.appendingPathComponent("VoiceNotes", isDirectory: true)
        if !FileManager.default.fileExists(atPath: folder.path) {
            try? FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
        }
        return folder.appendingPathComponent("\(sessionID.uuidString)_\(role.rawValue).m4a")
    }
}
