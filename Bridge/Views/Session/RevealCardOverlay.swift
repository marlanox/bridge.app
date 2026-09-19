import SwiftUI

/// The "read what your partner shared" card. Critical rule: while someone is reading,
/// the room interior stays exactly as it was (still facing whoever just answered) — it
/// does NOT rotate. Only this card appears, on top of the room, rotated to face the
/// reader. The room itself only flips once the reader dismisses this card and it
/// becomes their turn to answer (`SessionViewModel.confirmReveal()`).
struct RevealCardOverlay: View {
    let fromName: String
    let fromColor: PartnerColor
    let toRole: PartnerRole
    let cards: [CardPlay]
    let onRead: () -> Void

    var body: some View {
        ZStack {
            Color.black.opacity(0.4)
                .ignoresSafeArea()

            card
                .rotationEffect(.degrees(toRole.seatRotationDegrees))
                .padding(.horizontal, 28)
        }
        .transition(.opacity.combined(with: .scale(scale: 0.92)))
    }

    private var card: some View {
        VStack(spacing: 18) {
            HStack(spacing: 6) {
                Circle().fill(fromColor.color).frame(width: 10, height: 10)
                Text(LF("handoff.shared_title", fromName))
                    .font(.bridgeSerifHeadline(19))
            }

            VStack(spacing: 10) {
                ForEach(cards) { play in
                    Text(cardDisplayText(play))
                        .font(.subheadline.weight(.medium))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .frame(maxWidth: .infinity)
                        .background(fromColor.color.opacity(0.16), in: RoundedRectangle(cornerRadius: 12))
                }
            }

            PrimaryButton(titleKey: "handoff.read_it", color: fromColor.color, action: onRead)
        }
        .padding(24)
        .frame(maxWidth: 340)
        .background(.ultraThinMaterial)
        .background(Color.white.opacity(0.35))
        .clipShape(RoundedRectangle(cornerRadius: 26, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .stroke(Color.white.opacity(0.6), lineWidth: 1)
        )
        .shadow(color: .black.opacity(0.3), radius: 30, y: 14)
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
