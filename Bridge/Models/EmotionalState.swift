import Foundation

/// The seven core feelings offered on the Intensity & State screen. A person can select more
/// than one at once (see `EmotionalStateSelection`) — real reactions are rarely just one
/// thing — and can always add their own words instead of, or alongside, these.
enum EmotionalState: String, Codable, CaseIterable, Identifiable, Hashable {
    case hurt
    case angry
    case scared
    case guilty
    case ashamed
    case sad
    case confused

    var id: String { rawValue }

    var textKey: String {
        switch self {
        case .hurt: return "state.hurt"
        case .angry: return "state.angry"
        case .scared: return "state.scared"
        case .guilty: return "state.guilty"
        case .ashamed: return "state.ashamed"
        case .sad: return "state.sad"
        case .confused: return "state.confused"
        }
    }
}

/// A partner's answer on the Intensity & State screen: any number of the seven core
/// feelings, plus optional free text for anything those don't cover.
struct EmotionalStateSelection: Codable, Equatable {
    var states: Set<EmotionalState> = []
    var customText: String = ""

    var isEmpty: Bool {
        states.isEmpty && customText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
}
