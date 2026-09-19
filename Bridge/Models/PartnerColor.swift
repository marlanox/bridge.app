import SwiftUI

/// Internal dev shorthand only — never shown in UI, where real first names are used instead.
enum PartnerRole: String, Codable, CaseIterable, Hashable {
    case partnerA
    case partnerB

    var other: PartnerRole {
        self == .partnerA ? .partnerB : .partnerA
    }

    /// The fixed physical seat rotation for this partner: partners sit facing each
    /// other across the phone, so partnerA's seat is always "upright" (0°) and
    /// partnerB's is always the opposite side (180°) — regardless of whose turn it is.
    /// Room content rotates to whichever seat is currently answering; anything that must
    /// stay readable for a *specific* seat (the waiting badge, a reveal card) uses this
    /// directly instead.
    var seatRotationDegrees: Double {
        self == .partnerB ? 180 : 0
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
