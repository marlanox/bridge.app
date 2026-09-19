import SwiftUI

/// Milky ivory, a black keyline, and a fine gold inner border — the app's one button style,
/// deliberately restrained (no filled color blocks) for a quieter, more expensive feel.
/// `color` no longer fills the button; it tints the loading spinner only, so a per-partner
/// call site (e.g. the reveal card) still reads as "theirs" without breaking the palette.
struct PrimaryButton: View {
    let titleKey: String
    /// Overrides `titleKey` with a literal string when set — for text that already
    /// contains dynamic, non-localizable content (e.g. a live StoreKit price).
    var customTitle: String? = nil
    var color: Color = .bridgeInk
    var isEnabled: Bool = true
    var isLoading: Bool = false
    /// `false` for a compact, content-sized button — used where the button must read as
    /// secondary to something above it (e.g. the reveal card's shared text) rather than the
    /// most visually dominant element on screen.
    var fullWidth: Bool = true
    /// Set only by call sites the screenshot-walkthrough UI tests need to find reliably
    /// (see `BridgeUITests`) — has no effect on layout, appearance, or VoiceOver.
    var testID: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Group {
                if isLoading {
                    ProgressView().tint(color)
                } else {
                    Text(customTitle ?? L(titleKey))
                        .font(.bridgeButton)
                        .textCase(.uppercase)
                        .tracking(1.4)
                }
            }
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .padding(.horizontal, fullWidth ? 0 : 28)
            .padding(.vertical, fullWidth ? 15 : 11)
        }
        .foregroundStyle(Color.bridgeInk.opacity(isEnabled ? 1 : 0.35))
        .background(Color.bridgeIvory)
        .overlay(
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .strokeBorder(Color.bridgeInk.opacity(isEnabled ? 1 : 0.25), lineWidth: 1.3)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 11, style: .continuous)
                .strokeBorder(Color.bridgeGold.opacity(isEnabled ? 0.85 : 0), lineWidth: 1)
                .padding(3)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .disabled(!isEnabled || isLoading)
        .accessibilityIdentifier(testID ?? "")
    }
}

struct SecondaryButton: View {
    let titleKey: String
    var color: Color = .bridgeInk.opacity(0.62)
    /// See `PrimaryButton.testID`.
    var testID: String? = nil
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(L(titleKey))
                .font(.system(size: 13, weight: .semibold))
                .textCase(.uppercase)
                .tracking(1.1)
                .foregroundStyle(color)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .overlay(alignment: .bottom) {
                    Rectangle().fill(Color.bridgeGold.opacity(0.5)).frame(height: 1)
                }
        }
        .accessibilityIdentifier(testID ?? "")
    }
}
