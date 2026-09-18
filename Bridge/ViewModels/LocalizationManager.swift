import Foundation
import Combine

/// English or Russian, chosen once in-app (not derived from the device's system
/// language) and reusable anytime from Settings.
enum AppLanguage: String, CaseIterable, Codable, Identifiable, Hashable {
    case en
    case ru

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .en: return "English"
        case .ru: return "Русский"
        }
    }
}

/// Looks up strings from a specific `.lproj` bundle chosen in-app, bypassing the
/// system's automatic locale-based resource selection entirely. This is what lets a
/// couple pick Russian on an English-system-language phone (or vice versa) and have
/// it stick, with no restart required.
final class LocalizationManager: ObservableObject {
    static let shared = LocalizationManager()

    private static let storageKey = "com.bridge.app.language"

    /// nil means "not chosen yet" — the app shows the language picker in this state.
    @Published private(set) var language: AppLanguage?

    private var bundle: Bundle = .main

    private init() {
        if let raw = UserDefaults.standard.string(forKey: Self.storageKey), let lang = AppLanguage(rawValue: raw) {
            language = lang
            bundle = Self.bundle(for: lang)
        }
    }

    func setLanguage(_ lang: AppLanguage) {
        language = lang
        bundle = Self.bundle(for: lang)
        UserDefaults.standard.set(lang.rawValue, forKey: Self.storageKey)
    }

    private static func bundle(for language: AppLanguage) -> Bundle {
        guard let path = Bundle.main.path(forResource: language.rawValue, ofType: "lproj"),
              let b = Bundle(path: path) else {
            return .main
        }
        return b
    }

    func string(_ key: String) -> String {
        bundle.localizedString(forKey: key, value: nil, table: nil)
    }
}

/// Looks up `key` in the user's chosen language. Use everywhere instead of
/// `LocalizedStringKey`/`NSLocalizedString`, which both follow the device's system
/// language rather than the in-app choice.
func L(_ key: String) -> String {
    LocalizationManager.shared.string(key)
}

/// `L` plus `String(format:)`, for strings with `%@`/`%d` placeholders.
func LF(_ key: String, _ args: CVarArg...) -> String {
    String(format: L(key), arguments: args)
}
