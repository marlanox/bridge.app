import SwiftUI

/// Shown upright, between two partners' turns in a sequential room — replaces a literal
/// phone flip. The incoming partner reads what the previous partner shared, then taps
/// Continue themselves once ready, so nothing is ever shown upside down.
struct HandoffView: View {
    let fromName: String
    let fromColor: PartnerColor
    let toName: String
    let cards: [CardPlay]
    let onContinue: () -> Void

    var body: some View {
        VStack(spacing: 20) {
            Spacer()

            HStack(spacing: 6) {
                Circle().fill(fromColor.color).frame(width: 10, height: 10)
                Text(LF("handoff.shared_title", fromName))
                    .font(.bridgeSerifHeadline(20))
            }

            VStack(alignment: .leading, spacing: 10) {
                ForEach(cards) { play in
                    Text(cardDisplayText(play))
                        .font(.subheadline.weight(.medium))
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(fromColor.color.opacity(0.15), in: RoundedRectangle(cornerRadius: 12))
                }
            }
            .padding(.horizontal, 24)

            Text(LF("handoff.prompt", toName))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Spacer()

            PrimaryButton(titleKey: "handoff.continue", action: onContinue)
                .padding(.horizontal, 24)
                .padding(.bottom, 24)
        }
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }

    private func cardDisplayText(_ play: CardPlay) -> String {
        if let custom = play.customText { return custom }
        let deck = DeckData.deck(play.deckID)
        if let card = deck.cards.first(where: { $0.id == play.cardID }) {
            return L(card.textKey)
        }
        return ""
    }
}
