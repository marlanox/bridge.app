import SwiftUI

/// A small, consistent type system: serif for headings (the "expensive" feel), bold
/// upright tracked text for buttons (always legible, never italic).
extension Font {
    static func bridgeSerifTitle(_ size: CGFloat, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    static func bridgeSerifHeadline(_ size: CGFloat = 22) -> Font {
        .system(size: size, weight: .semibold, design: .serif)
    }

    /// Straight (never italic), bold, large, readable — for every button in the app.
    static var bridgeButton: Font {
        .system(size: 17, weight: .bold, design: .rounded)
    }
}
