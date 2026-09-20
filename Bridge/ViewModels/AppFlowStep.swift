import Foundation

/// The full walk through the house (spec section 4), as concretely ordered on screen.
///
/// The apology ritual (explanation → the ritual itself → the oath) now happens early,
/// right after the wellness disclaimer and before the house map/names — it's something
/// the couple does before the walk, not a reward partway through it. Calm-down still sits
/// where intensity requires it: right after the intensity reading, immediately before the
/// couple actually enters the first room.
enum AppFlowStep: Equatable {
    case welcome
    case howItWorksWhatIsBridge
    case howItWorksApology
    /// Wellness disclaimer (App Store checklist B.1) — shown once at first-launch
    /// onboarding, and separately reachable anytime from Settings.
    case disclaimer
    /// House map overview — shown once, last in onboarding, and reachable anytime
    /// from Settings as "View the path."
    case houseMap
    case names
    case couplesAgreementSetup
    case dice
    case intensityState
    case calmDown
    case oath
    case ritual
    case room(RoomKind)
    case basement
    case bridgeFinale
    case voiceSnapshot
    case closing

    /// Everything before a couple actually starts walking through the house — the soft
    /// ambient pad (`AmbientMusic`) plays through these and falls silent the instant a
    /// room, the basement, or the Bridge finale begins.
    var isBeforeRooms: Bool {
        switch self {
        case .welcome, .howItWorksWhatIsBridge, .howItWorksApology, .disclaimer,
             .ritual, .oath, .houseMap, .names, .dice, .intensityState, .calmDown:
            return true
        case .couplesAgreementSetup, .room, .basement, .bridgeFinale, .voiceSnapshot, .closing:
            return false
        }
    }

    var stepOrder: Int {
        switch self {
        case .welcome: return 0
        case .howItWorksWhatIsBridge: return 1
        case .disclaimer: return 2
        case .howItWorksApology: return 3
        case .ritual: return 4
        case .oath: return 5
        case .houseMap: return 6
        case .names: return 7
        case .dice: return 8
        case .intensityState: return 9
        case .calmDown: return 10
        case .room(let kind): return 11 + kind.rawValue
        case .basement: return 27
        case .bridgeFinale: return 28
        // Comes after the actual conflict-repair work, not before it — the couple agrees
        // on ground rules (and any consequence) once they've felt why the rules matter,
        // not as an abstract checklist at the very start of the session.
        case .couplesAgreementSetup: return 29
        case .voiceSnapshot: return 30
        case .closing: return 31
        }
    }
}

/// Manual `Codable` so an in-progress session (which room, mid-walk) can be persisted and
/// resumed after the app is closed or backgrounded — see `SessionSnapshot`.
extension AppFlowStep: Codable {
    private enum Tag: String, Codable {
        case welcome, howItWorksWhatIsBridge, howItWorksApology, disclaimer
        case houseMap, names, couplesAgreementSetup, dice
        case intensityState, calmDown, oath, ritual, room, basement, bridgeFinale
        case voiceSnapshot, closing
    }

    private enum CodingKeys: String, CodingKey {
        case tag, room
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let tag = try container.decode(Tag.self, forKey: .tag)
        switch tag {
        case .welcome: self = .welcome
        case .howItWorksWhatIsBridge: self = .howItWorksWhatIsBridge
        case .howItWorksApology: self = .howItWorksApology
        case .disclaimer: self = .disclaimer
        case .houseMap: self = .houseMap
        case .names: self = .names
        case .couplesAgreementSetup: self = .couplesAgreementSetup
        case .dice: self = .dice
        case .intensityState: self = .intensityState
        case .calmDown: self = .calmDown
        case .oath: self = .oath
        case .ritual: self = .ritual
        case .room: self = .room(try container.decode(RoomKind.self, forKey: .room))
        case .basement: self = .basement
        case .bridgeFinale: self = .bridgeFinale
        case .voiceSnapshot: self = .voiceSnapshot
        case .closing: self = .closing
        }
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .welcome: try container.encode(Tag.welcome, forKey: .tag)
        case .howItWorksWhatIsBridge: try container.encode(Tag.howItWorksWhatIsBridge, forKey: .tag)
        case .howItWorksApology: try container.encode(Tag.howItWorksApology, forKey: .tag)
        case .disclaimer: try container.encode(Tag.disclaimer, forKey: .tag)
        case .houseMap: try container.encode(Tag.houseMap, forKey: .tag)
        case .names: try container.encode(Tag.names, forKey: .tag)
        case .couplesAgreementSetup: try container.encode(Tag.couplesAgreementSetup, forKey: .tag)
        case .dice: try container.encode(Tag.dice, forKey: .tag)
        case .intensityState: try container.encode(Tag.intensityState, forKey: .tag)
        case .calmDown: try container.encode(Tag.calmDown, forKey: .tag)
        case .oath: try container.encode(Tag.oath, forKey: .tag)
        case .ritual: try container.encode(Tag.ritual, forKey: .tag)
        case .room(let kind):
            try container.encode(Tag.room, forKey: .tag)
            try container.encode(kind, forKey: .room)
        case .basement: try container.encode(Tag.basement, forKey: .tag)
        case .bridgeFinale: try container.encode(Tag.bridgeFinale, forKey: .tag)
        case .voiceSnapshot: try container.encode(Tag.voiceSnapshot, forKey: .tag)
        case .closing: try container.encode(Tag.closing, forKey: .tag)
        }
    }
}
