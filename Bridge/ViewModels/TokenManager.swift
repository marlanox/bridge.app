import Foundation

/// Awards the green/red tokens described in spec section 7.
///
/// The app has no way to objectively detect yelling, interrupting or manipulation from a
/// silent phone screen, so tokens are earned two ways: automatically, for procedural
/// milestones the app *can* observe (oath spoken through, ritual completed, a room
/// finished by both partners), and by honest self-report, via a single "we broke our
/// agreement just now" flag available during a room — consistent with the oath itself
/// ("I promise to be honest"). Nothing about the running balance is ever shown mid-session
/// (spec: the closing screen deliberately hides it too).
enum TokenManager {
    static let greenPerRoomCompleted = 1
    static let greenForOath = 1
    static let greenForRitual = 1
    static let greenForBasementFollowedProtocol = 1
    static let greenForBridgeFinale = 1
    static let redForAgreementBroken = 1

    static func awardOath(session: inout GameSession) {
        session.greenTokensEarned += greenForOath * 2 // both partners spoke it together
    }

    static func awardRitual(session: inout GameSession) {
        session.greenTokensEarned += greenForRitual * 2
    }

    static func awardRoomCompleted(session: inout GameSession) {
        session.greenTokensEarned += greenPerRoomCompleted * 2
    }

    static func awardBasementProtocolFollowed(session: inout GameSession) {
        session.greenTokensEarned += greenForBasementFollowedProtocol * 2
    }

    static func awardBridgeFinale(session: inout GameSession) {
        session.greenTokensEarned += greenForBridgeFinale * 2
    }

    static func flagAgreementBroken(session: inout GameSession) {
        session.redTokensEarned += redForAgreementBroken
    }

    /// Called once, at session close, to fold the session's earned tokens into the
    /// profile's persistent balance (1 green cancels 1 red; remainder becomes currency).
    static func settle(session: GameSession, into profile: inout RelationshipProfile) {
        profile.applyTokens(green: session.greenTokensEarned, red: session.redTokensEarned)
    }
}
