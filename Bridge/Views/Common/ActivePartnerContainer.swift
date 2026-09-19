import SwiftUI

/// Implements the physical turn-based interaction model: the two partners sit facing
/// each other with the phone between them, so the room's interior and controls rotate
/// 180° to face whoever is currently answering. The small "so-and-so is listening"
/// status badge names the *waiting* partner but is oriented to be readable by whoever
/// is actually holding/facing the phone right now — the active partner — not by the
/// waiting partner it names; it's a reassurance for the one currently sharing, not a
/// note to the one currently listening.
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
            .rotationEffect(.degrees(activePartner.seatRotationDegrees))
            .padding(14)
            // Purely informational — never intercept a tap meant for a real control that
            // ends up sharing this corner once the content underneath rotates 180°.
            .allowsHitTesting(false)
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
