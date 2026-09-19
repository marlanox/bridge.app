import SwiftUI

/// Backgrounds are photorealistic villa photos (spec section 2, amended), so anything
/// sitting on top of them — this card included — uses a frosted-glass panel (blur +
/// a soft white/beige tint) rather than a solid flat color block, so the UI doesn't
/// fight the photograph underneath.
struct CardView: View {
    let card: Card
    let color: PartnerColor
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(L(card.textKey))
                .font(.system(size: 14.5, weight: .medium))
                .multilineTextAlignment(.center)
                .lineLimit(4)
                .minimumScaleFactor(0.85)
                .padding(10)
                .frame(maxWidth: .infinity, minHeight: 60)
                .foregroundStyle(card.isWriteYourOwn ? Color.secondary : Color.primary)
        }
        .background(.ultraThinMaterial)
        .background(card.isWriteYourOwn ? Color.white.opacity(0.10) : color.color.opacity(0.22))
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .stroke(card.isWriteYourOwn ? Color.white.opacity(0.5) : color.color.opacity(0.65), lineWidth: 1.25)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .buttonStyle(.plain)
        .accessibilityIdentifier("uitest.card.\(card.id)")
    }
}
