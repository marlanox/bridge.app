import SwiftUI

/// Implements the core interaction model (spec section 2): only the active partner's
/// screen is large and upright; the waiting partner sees a small status indicator in
/// their own corner, right-side-up from *their* seat. When the turn passes, the whole
/// screen flips 180° so whoever is now active never has to move the phone.
///
/// Geometry: the main content always renders upright for the active partner, so it
/// carries `activeRotation` (0° for partner A, 180° for partner B — the two partners
/// sit facing each other across the phone). The waiting-partner indicator sits outside
/// that rotation and is rotated by `activeRotation + 180°`, which keeps it upright from
/// the *other* seat regardless of which partner is currently active.
struct ActivePartnerContainer<Content: View>: View {
    let activePartner: PartnerRole
    let partnerName: (PartnerRole) -> String
    let partnerColor: (PartnerRole) -> PartnerColor
    @ViewBuilder let content: Content

    private var activeRotation: Double { activePartner == .partnerB ? 180 : 0 }

    var body: some View {
        ZStack(alignment: .topTrailing) {
            content
                .rotationEffect(.degrees(activeRotation))

            WaitingIndicator(
                name: partnerName(activePartner.other),
                color: partnerColor(activePartner.other)
            )
            .rotationEffect(.degrees(activeRotation + 180))
            .padding(14)
        }
        .animation(.easeInOut(duration: 0.5), value: activePartner)
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
            Text(LocalizedStringKey("nav.listening"))
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial, in: Capsule())
    }
}
