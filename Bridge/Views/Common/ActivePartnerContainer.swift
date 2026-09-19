import SwiftUI

/// Implements the physical turn-based interaction model: the two partners sit facing
/// each other with the phone between them, so the room's interior and controls rotate
/// 180° to face whoever is currently answering. The waiting partner sees a small,
/// correctly-oriented status badge in their own corner.
///
/// Critically, this rotation only ever happens when it becomes someone's turn to
/// *answer* — never while they're only reading. `RoomView` holds the reveal-card overlay
/// (`RevealCardOverlay`) that appears on top of this, still-unrotated, content when a
/// partner has just answered; only after the reader dismisses that card does
/// `activePartner` change and this view rotates.
struct ActivePartnerContainer<Content: View>: View {
    let activePartner: PartnerRole
    let partnerName: (PartnerRole) -> String
    let partnerColor: (PartnerRole) -> PartnerColor
    @ViewBuilder let content: Content

    var body: some View {
        ZStack(alignment: .topTrailing) {
            content
                .rotationEffect(.degrees(activePartner.seatRotationDegrees))

            WaitingIndicator(
                name: partnerName(activePartner.other),
                color: partnerColor(activePartner.other)
            )
            .rotationEffect(.degrees(activePartner.other.seatRotationDegrees))
            .padding(14)
        }
        .animation(.spring(response: 0.6, dampingFraction: 0.82), value: activePartner)
    }
}

private struct WaitingIndicator: View {
    let name: String
    let color: PartnerColor

    var body: some View {
        HStack(spacing: 6) {
            Circle().fill(color.color).frame(width: 8, height: 8)
            Text(name)
                .font(.caption2.weight(.semibold))
            Text(L("nav.listening"))
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial, in: Capsule())
    }
}
