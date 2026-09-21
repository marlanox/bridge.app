import SwiftUI

/// The app's shared luxury palette — milky ivory, near-black ink, and a warm metallic gold —
/// used everywhere a screen needs a plain (non-photo) background, a border, or an accent,
/// instead of scattering the same literal color values across every view file.
extension Color {
    /// Milky-white surface — replaces the old warm beige card/screen background app-wide.
    static let bridgeIvory = Color(red: 0.984, green: 0.976, blue: 0.961)
    /// Near-black ink for text, borders, and the "expensive" dark surfaces (Bridge finale
    /// header, buttons' outline).
    static let bridgeInk = Color(red: 0.09, green: 0.09, blue: 0.10)
    /// Warm metallic gold accent — used sparingly, for a rule, an icon, or a button's edge.
    /// Lightened per explicit request from an earlier, darker/heavier gold.
    static let bridgeGold = Color(red: 0.80, green: 0.67, blue: 0.40)
    /// A softer gold for tints/fills where the full metallic gold would be too strong.
    static let bridgeGoldSoft = bridgeGold.opacity(0.18)
}
