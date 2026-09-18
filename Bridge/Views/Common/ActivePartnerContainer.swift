import SwiftUI

/// Implements the turn-based interaction model (spec section 2): only the active
/// partner's screen is large; the waiting partner sees a small, upright status badge
/// in the corner. Content always renders right-side up for whoever is reading it —
/// there is no 180° phone-flip. When a turn passes between partners, `RoomView` shows
/// a brief upright "handoff" screen (see `HandoffView`) instead of rotating anything,
/// so no one ever has to read anything upside down.
struct ActivePartnerContainer<Content: View>: View {
    let activePartner: PartnerRole
    let partnerName: (PartnerRole) -> String
    let partnerColor: (PartnerRole) -> PartnerColor
    @ViewBuilder let content: Content

    var body: some View {
        ZStack(alignment: .topTrailing) {
            content

            WaitingIndicator(
                name: partnerName(activePartner.other),
                color: partnerColor(activePartner.other)
            )
            .padding(14)
        }
        .transition(.opacity)
        .animation(.easeInOut(duration: 0.35), value: activePartner)
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
