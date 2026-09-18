import SwiftUI

/// Internal dev shorthand only — never shown in UI, where real first names are used instead.
enum PartnerRole: String, Codable, CaseIterable, Hashable {
    case partnerA
    case partnerB

    var other: PartnerRole {
        self == .partnerA ? .partnerB : .partnerA
    }
}

enum PartnerColor: String, Codable, Hashable {
    case purple
    case green

    var color: Color {
        switch self {
        case .purple: return Color(red: 0.55, green: 0.47, blue: 0.86)
        case .green: return Color(red: 0.42, green: 0.62, blue: 0.45)
        }
    }
}

struct PartnerInfo: Codable, Equatable {
    var name: String
    var color: PartnerColor
}
