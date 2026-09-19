import Foundation

/// The full walk through the house (spec section 4), as concretely ordered on screen.
///
/// Reconciliation note: section 4's flow string places "INTENSITY & STATE" *after* the
/// ritual, but section 5 makes the calm-down step (before the oath) conditional on
/// intensity being high. Those two requirements can't both be literally true — calm-down
/// needs an intensity reading before the oath even happens. This build takes the intensity
/// + state screen right after the dice roll (before calm-down/oath/ritual), which preserves
/// section 5's dependency and still keeps the screen in the same neighborhood of the flow
/// section 4 describes.
enum AppFlowStep: Equatable {
    case welcome
    case howItWorksWhatIsBridge
    case howItWorksApology
    case howItWorksModes
    /// Wellness disclaimer (App Store checklist B.1) — shown once at first-launch
    /// onboarding, and separately reachable anytime from Settings.
    case disclaimer
    /// House map overview — shown once, last in onboarding, and reachable anytime
    /// from Settings as "View the path."
    case houseMap
    case names
    case comprehensionAgreement
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

    var stepOrder: Int {
        switch self {
        case .welcome: return 0
        case .howItWorksWhatIsBridge: return 1
        case .howItWorksApology: return 2
        case .howItWorksModes: return 3
        case .disclaimer: return 4
        case .houseMap: return 5
        case .names: return 6
        case .comprehensionAgreement: return 7
        case .couplesAgreementSetup: return 8
        case .dice: return 9
        case .intensityState: return 10
        case .calmDown: return 11
        case .oath: return 12
        case .ritual: return 13
        case .room(let kind): return 14 + kind.rawValue
        case .basement: return 30
        case .bridgeFinale: return 31
        case .voiceSnapshot: return 32
        case .closing: return 33
        }
    }
}

/// Manual `Codable` so an in-progress session (which room, mid-walk) can be persisted and
/// resumed after the app is closed or backgrounded — see `SessionSnapshot`.
extension AppFlowStep: Codable {
    private enum Tag: String, Codable {
        case welcome, howItWorksWhatIsBridge, howItWorksApology, howItWorksModes, disclaimer
        case houseMap, names, comprehensionAgreement, couplesAgreementSetup, dice
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
        case .howItWorksModes: self = .howItWorksModes
        case .disclaimer: self = .disclaimer
        case .houseMap: self = .houseMap
        case .names: self = .names
        case .comprehensionAgreement: self = .comprehensionAgreement
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
        case .howItWorksModes: try container.encode(Tag.howItWorksModes, forKey: .tag)
        case .disclaimer: try container.encode(Tag.disclaimer, forKey: .tag)
        case .houseMap: try container.encode(Tag.houseMap, forKey: .tag)
        case .names: try container.encode(Tag.names, forKey: .tag)
        case .comprehensionAgreement: try container.encode(Tag.comprehensionAgreement, forKey: .tag)
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
