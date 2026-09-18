import Foundation

/// One walk through the house, from the dice roll to the closing screen.
/// Mirrors the "Game session" object in spec section 10.
struct GameSession: Codable, Identifiable {
    var id: UUID = UUID()
    var partnerA: PartnerInfo
    var partnerB: PartnerInfo

    var intensityA: Int = 0 // 0-10
    var intensityB: Int = 0 // 0-10
    var stateA: EmotionalState?
    var stateB: EmotionalState?

    var firstToSpeak: PartnerRole?
    var currentRoom: RoomKind = .hall

    /// Green/red earned *this session* (also folded into the profile totals as they occur).
    var greenTokensEarned: Int = 0
    var redTokensEarned: Int = 0

    var cardsPlayed: [CardPlay] = []
    var basementExchanges: [BasementExchange] = []
    var bridgeFinal: [PartnerRole: BridgeFinalSelection] = [
        .partnerA: BridgeFinalSelection(),
        .partnerB: BridgeFinalSelection()
    ]

    var voiceNoteRecorded: [PartnerRole: Bool] = [:]

    var startedAt: Date = Date()
    var completedAt: Date?

    func name(for role: PartnerRole) -> String {
        role == .partnerA ? partnerA.name : partnerB.name
    }

    func color(for role: PartnerRole) -> PartnerColor {
        role == .partnerA ? partnerA.color : partnerB.color
    }

    var highestIntensity: Int { max(intensityA, intensityB) }
}

struct SessionSummary: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date
    var greenEarned: Int
    var redEarned: Int
}
