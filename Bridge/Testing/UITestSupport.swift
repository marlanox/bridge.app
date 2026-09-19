import Foundation

/// Test-only launch hooks, entirely gated behind a launch argument/environment variables a
/// real user's launch never sets — zero effect on production behavior. Exists solely so an
/// XCUITest run (see `BridgeUITests`) can drive the real, compiled app straight to a specific
/// screen or state for an automated screenshot walkthrough, without scripting every
/// intermediate tap for screens that don't need to demonstrate a live interaction.
enum UITestSupport {
    /// Master switch. Must be present for any of the other hooks below to do anything.
    static var isUITesting: Bool {
        ProcessInfo.processInfo.arguments.contains("-uiTesting")
    }

    /// When set, `SessionViewModel` seeds a realistic session and jumps `flow` straight to
    /// this `AppFlowStep.room`/other case, keyed by a short string (see
    /// `SessionViewModel.applyUITestJump(flowKey:withReveal:)`).
    static var jumpFlowKey: String? {
        ProcessInfo.processInfo.environment["UITEST_JUMP_FLOW"]
    }

    /// When set alongside `jumpFlowKey` for a sequential room, also seeds a placed card and
    /// raises `pendingReveal` so the reveal-card-overlay / pre-rotation state can be
    /// screenshotted directly.
    static var jumpReveal: Bool {
        ProcessInfo.processInfo.environment["UITEST_JUMP_REVEAL"] == "1"
    }

    /// When set, the seeded profile starts already having used its one free session, so
    /// tapping "Begin" on Welcome shows the real Paywall instead of starting a session.
    static var forcePaywall: Bool {
        ProcessInfo.processInfo.environment["UITEST_FORCE_PAYWALL"] == "1"
    }
}
