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
/// Hall, Living Room, Study, Kids' Room and Kitchen are all instances of the same
/// reusable component, driven by this config. Basement and Bridge are special screens
/// with their own views. There is no separate Needs Room or Garden: the "Needs &
/// Connection" and gift/step-toward cards are all chosen together at the Bridge finale.
enum RoomKind: Int, Codable, CaseIterable, Identifiable, Hashable {
    case hall = 1
    case livingRoom = 2
    case study = 3
    case kidsRoom = 4
    case kitchen = 5
    case basement = 6

    var id: Int { rawValue }

    var next: RoomKind? {
        RoomKind(rawValue: rawValue + 1)
    }
}

struct RoomConfig {
    let kind: RoomKind
    let nameKey: String
    let questionKey: String
    /// A short, concrete "how to do this, with an example" line — every room gets one,
    /// since the point of the walk is a specific kind of sentence (a fact, a feeling, a
    /// story, a memory), and couples otherwise blur them together.
    let instructionKey: String
    /// One short, compassionate sentence naming what this room's exercise is actually
    /// for — not another rule, but the reason the couple should trust the process.
    let whyItHelpsKey: String
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
            instructionKey: "room.hall.instruction",
            whyItHelpsKey: "room.hall.why_it_helps",
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
            instructionKey: "room.living_room.instruction",
            whyItHelpsKey: "room.living_room.why_it_helps",
            timeMinutes: 7,
            modes: [.speaks, .listensOnly],
            forbiddenKey: "room.living_room.forbidden",
            deckIDs: ["emotions", "body_sensations"],
            backgroundImageName: "living-room"
        ),
        .study: RoomConfig(
            kind: .study,
            nameKey: "room.study.name",
            questionKey: "room.study.question",
            instructionKey: "room.study.instruction",
            whyItHelpsKey: "room.study.why_it_helps",
            timeMinutes: 7,
            modes: [.speaks, .listensOnly],
            forbiddenKey: "room.study.forbidden",
            deckIDs: ["interpretations"],
            backgroundImageName: "study"
        ),
        .kidsRoom: RoomConfig(
            kind: .kidsRoom,
            nameKey: "room.kids_room.name",
            questionKey: "room.kids_room.question",
            instructionKey: "room.kids_room.instruction",
            whyItHelpsKey: "room.kids_room.why_it_helps",
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
            instructionKey: "room.kitchen.instruction",
            whyItHelpsKey: "room.kitchen.why_it_helps",
            timeMinutes: 7,
            modes: [.discussion],
            forbiddenKey: nil,
            deckIDs: [],
            backgroundImageName: "kitchen"
        ),
    ]
}
