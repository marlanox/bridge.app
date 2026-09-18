import Foundation

struct Deck: Identifiable, Codable, Hashable {
    let id: String
    let nameKey: String
    var cards: [Card]

    /// Cards grouped by category in declared order, for the categorized grid.
    /// Decks with no categories return a single unnamed section.
    var sections: [(category: String?, cards: [Card])] {
        var order: [String?] = []
        var buckets: [String?: [Card]] = [:]
        for card in cards {
            if buckets[card.category] == nil {
                order.append(card.category)
                buckets[card.category] = []
            }
            buckets[card.category]?.append(card)
        }
        return order.map { ($0, buckets[$0] ?? []) }
    }

    /// The full grid a partner sees: real cards followed by the "Write your own" tile.
    var gridCards: [Card] {
        cards + [Card.writeYourOwn()]
    }
}
