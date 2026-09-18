import Foundation

/// state_A / state_B from the Intensity & State screen (spec section 10).
enum EmotionalState: String, Codable, CaseIterable, Identifiable, Hashable {
    case hurt
    case guilty
    case both
    case confused
    case dontKnow

    var id: String { rawValue }

    var textKey: String {
        switch self {
        case .hurt: return "state.hurt"
        case .guilty: return "state.guilty"
        case .both: return "state.both"
        case .confused: return "state.confused"
        case .dontKnow: return "state.dont_know"
        }
    }
}
