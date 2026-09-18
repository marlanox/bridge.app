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
        case .names: return 5
        case .comprehensionAgreement: return 6
        case .couplesAgreementSetup: return 7
        case .dice: return 8
        case .intensityState: return 9
        case .calmDown: return 10
        case .oath: return 11
        case .ritual: return 12
        case .room(let kind): return 13 + kind.rawValue
        case .basement: return 30
        case .bridgeFinale: return 31
        case .voiceSnapshot: return 32
        case .closing: return 33
        }
    }
}
