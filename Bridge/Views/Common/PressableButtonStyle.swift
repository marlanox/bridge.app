import SwiftUI

/// Every button in the app should visibly acknowledge a tap the instant it happens —
/// without this, a fully custom-styled `Button` (background/border applied outside the
/// label, no `buttonStyle`) shows no press feedback at all on iOS. A quick scale-down +
/// fade gives that immediate "yes, that registered" cue before the action's own result
/// (a screen change, a card appearing) shows up.
struct PressableButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.96 : 1)
            .opacity(configuration.isPressed ? 0.75 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}

extension View {
    /// Shorthand for `.buttonStyle(PressableButtonStyle())`.
    func pressable() -> some View {
        buttonStyle(PressableButtonStyle())
    }
}
