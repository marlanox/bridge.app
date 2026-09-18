import Foundation

/// A single card belonging to a deck. `textKey` looks up the display string in
/// Localizable.strings so all card text stays i18n-ready (spec section 2).
struct Card: Identifiable, Codable, Hashable {
    let id: String
    let textKey: String
    let category: String?

    init(id: String, textKey: String, category: String? = nil) {
        self.id = id
        self.textKey = textKey
        self.category = category
    }
}

/// Every deck grid ends with a "Write your own" tile (spec section 8, custom card rule).
/// It is not part of the persisted deck — it opens a free-text field and the result
/// becomes a one-off `CardPlay` for that turn only.
extension Card {
    static let writeYourOwnID = "write_your_own"

    static func writeYourOwn(category: String? = nil) -> Card {
        Card(id: Self.writeYourOwnID, textKey: "card.write_your_own", category: category)
    }

    var isWriteYourOwn: Bool { id == Self.writeYourOwnID }
}
