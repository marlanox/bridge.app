import Foundation

enum RoomMode: String, Codable, Hashable {
    /// 🎤 one partner speaks
    case speaks
    /// 👂 the other only listens
    case listensOnly
    /// 💬 discussion allowed
    case discussion
    /// 🤫 silence / strict turn-based protocol (Basement)
    case silentProtocol

    var iconSystemName: String {
        switch self {
        case .speaks: return "mic.fill"
        case .listensOnly: return "ear.fill"
        case .discussion: return "bubble.left.and.bubble.right.fill"
        case .silentProtocol: return "hand.raised.fill"
        }
    }
}

/// One "room" in the universal room screen (spec section 6 / section 11 item 8).
/// Hall, Living Room, Study, Kids' Room, Kitchen and Needs Room are all instances
/// of the same reusable component, driven by this config.
enum RoomKind: Int, Codable, CaseIterable, Identifiable, Hashable {
    case hall = 1
    case livingRoom = 2
    case study = 3
    case kidsRoom = 4
    case kitchen = 5
    case basement = 6
    case needsRoom = 7
    case bridge = 8

    var id: Int { rawValue }

    var next: RoomKind? {
        RoomKind(rawValue: rawValue + 1)
    }
}

struct RoomConfig {
    let kind: RoomKind
    let nameKey: String
    let questionKey: String
    let timeMinutes: Int?
    let modes: [RoomMode]
    let forbiddenKey: String?
    let deckIDs: [String]
    let backgroundImageName: String

    static let all: [RoomKind: RoomConfig] = [
        .hall: RoomConfig(
            kind: .hall,
            nameKey: "room.hall.name",
            questionKey: "room.hall.question",
            timeMinutes: 7,
            modes: [.speaks, .listensOnly],
            forbiddenKey: "room.hall.forbidden",
            deckIDs: ["events"],
            backgroundImageName: "hall"
        ),
        .livingRoom: RoomConfig(
            kind: .livingRoom,
            nameKey: "room.living_room.name",
            questionKey: "room.living_room.question",
            timeMinutes: 7,
            modes: [.speaks, .listensOnly],
            forbiddenKey: nil,
            deckIDs: ["emotions", "body_sensations"],
            backgroundImageName: "living-room"
        ),
        .study: RoomConfig(
            kind: .study,
            nameKey: "room.study.name",
            questionKey: "room.study.question",
            timeMinutes: 7,
            modes: [.speaks, .listensOnly],
            forbiddenKey: nil,
            deckIDs: ["interpretations"],
            backgroundImageName: "study"
        ),
        .kidsRoom: RoomConfig(
            kind: .kidsRoom,
            nameKey: "room.kids_room.name",
            questionKey: "room.kids_room.question",
            timeMinutes: 7,
            modes: [.speaks, .listensOnly],
            forbiddenKey: "room.kids_room.forbidden",
            deckIDs: ["childhood"],
            backgroundImageName: "kids-room"
        ),
        .kitchen: RoomConfig(
            kind: .kitchen,
            nameKey: "room.kitchen.name",
            questionKey: "room.kitchen.question",
            timeMinutes: 7,
            modes: [.discussion],
            forbiddenKey: nil,
            deckIDs: ["step_toward"],
            backgroundImageName: "kitchen"
        ),
        .needsRoom: RoomConfig(
            kind: .needsRoom,
            nameKey: "room.needs_room.name",
            questionKey: "room.needs_room.question",
            timeMinutes: 5,
            modes: [.discussion],
            forbiddenKey: nil,
            deckIDs: ["needs_connection"],
            backgroundImageName: "needs-room"
        ),
    ]
}
