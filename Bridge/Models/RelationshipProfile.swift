import Foundation

/// Persists for the lifetime of one relationship (spec sections 2 and 10).
/// The app supports several of these under one account/device.
struct RelationshipProfile: Codable, Identifiable, Equatable {
    var id: UUID = UUID()
    var createdAt: Date = Date()
    var displayName: String = "" // e.g. "Alex & Jordan" — for the profile switcher only

    var partnerAName: String = ""
    var partnerBName: String = ""

    var greenTokens: Int = 0
    var redTokens: Int = 0
    var currency: Int = 0

    var hasCompletedFirstSession: Bool = false
    var hasUnlockedFullVersion: Bool = false

    var couplesAgreement: [String] = []
    var sessionHistory: [SessionSummary] = []

    /// 1 green cancels 1 red, remaining greens convert to spendable currency (spec section 7).
    mutating func applyTokens(green: Int, red: Int) {
        greenTokens += green
        redTokens += red
        let cancel = min(greenTokens, redTokens)
        greenTokens -= cancel
        redTokens -= cancel
        currency += greenTokens
        greenTokens = 0
    }

    /// First session always gets one free gift credit, even at zero balance.
    var availableGiftCredits: Int {
        currency + (hasCompletedFirstSession ? 0 : 1)
    }
}
