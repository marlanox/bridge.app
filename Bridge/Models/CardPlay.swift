import Foundation

struct CardPlay: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var room: RoomKind
    var deckID: String
    var cardID: String
    /// Only set when cardID == Card.writeYourOwnID — a one-off, not saved to the shared deck.
    var customText: String?
    var playedBy: PartnerRole
    var timestamp: Date = Date()
}

/// Each partner's mandatory Bridge-finale choices (spec section 6, "Garden → Bridge").
/// `stepTowardCardID` is their own free choice; `completedMandatoryCard` tracks the
/// separate, fixed closing card every partner must complete aloud regardless of choice.
struct BridgeFinalSelection: Codable, Equatable {
    var stepTowardCardID: String?
    var needCardID: String?
    var giftCardID: String?
    var completedMandatoryCard: Bool = false

    var isComplete: Bool {
        stepTowardCardID != nil && needCardID != nil && giftCardID != nil && completedMandatoryCard
    }
}

enum BasementResponse: String, Codable, Hashable {
    case yes
    case no
    case partially
    case understand
}

/// One question/answer round in the Basement's strict protocol (spec section 6, room 6).
struct BasementExchange: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var askedBy: PartnerRole
    var fearCardID: String
    /// Set only when the asker wrote their own fear instead of picking a deck card.
    var customFearText: String?
    var response: BasementResponse
    var explanation: String?
    var timestamp: Date = Date()
}
