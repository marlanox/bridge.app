import SwiftUI

/// Cards a partner has chosen this turn, shown as if set down on the room's table —
/// "integrates into the room scene... not just added to an abstract list" (spec section 2).
struct PlacedCardsOverlay: View {
    let plays: [CardPlay]

    var body: some View {
        if !plays.isEmpty {
            VStack(alignment: .leading, spacing: 6) {
                ForEach(plays) { play in
                    Text(displayText(for: play))
                        .font(.caption.weight(.medium))
                        .foregroundStyle(Color.bridgeInk)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.bridgeIvory, in: Capsule())
                        .overlay(Capsule().strokeBorder(Color.bridgeGold.opacity(0.5), lineWidth: 1))
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .animation(.spring(response: 0.4, dampingFraction: 0.8), value: plays.count)
        }
    }

    private func displayText(for play: CardPlay) -> String {
        if let custom = play.customText { return custom }
        let deck = DeckData.deck(play.deckID)
        if let card = deck.cards.first(where: { $0.id == play.cardID }) {
            return L(card.textKey)
        }
        return ""
    }
}
