import SwiftUI

/// A small, consistent type system: serif for headings (the "expensive" feel), bold
/// upright tracked text for buttons (always legible, never italic).
///
/// A fixed scale on purpose — pick from these five sizes rather than a one-off `.system(size:)`,
/// so a screen never ends up with more distinct font sizes than it needs:
/// `bridgeSerifTitle` (28, a screen's own heading) → `bridgeSerifHeadline` (20, a room's
/// question or a card section's name) → `bridgeBody` (16, the main instructional/question
/// text) → `bridgeCaption` (13, secondary/supporting text) → `bridgeLabel` (11, a small
/// badge or timestamp).
extension Font {
    static func bridgeSerifTitle(_ size: CGFloat = 28, weight: Font.Weight = .semibold) -> Font {
        .system(size: size, weight: weight, design: .serif)
    }

    static func bridgeSerifHeadline(_ size: CGFloat = 20) -> Font {
        .system(size: size, weight: .semibold, design: .serif)
    }

    /// The main instructional or question text on a screen — one consistent size instead of
    /// each screen picking its own `.body`/`.subheadline`/`.title3`.
    static var bridgeBody: Font {
        .system(size: 16, weight: .regular)
    }

    /// Secondary/supporting text — instructions, examples, room rules.
    static var bridgeCaption: Font {
        .system(size: 13, weight: .medium)
    }

    /// The smallest text in the app — a badge, a counter, a timestamp.
    static var bridgeLabel: Font {
        .system(size: 11, weight: .semibold)
    }

    /// Straight (never italic), bold, large, readable — for every button in the app. A plain
    /// (non-rounded) grotesk at wide tracking reads as quieter and more expensive than the
    /// friendly rounded face this used to be.
    static var bridgeButton: Font {
        .system(size: 15, weight: .semibold, design: .default)
    }
}
