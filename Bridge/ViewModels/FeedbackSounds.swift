import AudioToolbox
import UIKit

/// Built-in iOS system sounds + haptics only — no custom audio files for v1 (App Store
/// checklist B.8: free, already optimized for the platform, no licensing to track down).
///
/// Deliberately silent for the oath and ritual moments (holding hands, the final Bridge
/// phrase) — those stay quiet by design, so nothing here is wired into
/// `SessionViewModel.completeOath()` / `completeRitual()`.
enum FeedbackSounds {
    /// A soft, non-alarming tone — the standard "Tink" system sound.
    private static let timerWarningSoundID: SystemSoundID = 1103
    /// A light, subtle tap — the standard "Tock" system sound.
    private static let cardPlacedSoundID: SystemSoundID = 1104
    /// A soft whoosh-like system sound used for screen/section transitions.
    private static let roomTransitionSoundID: SystemSoundID = 1114

    static func timerWarning() {
        AudioServicesPlaySystemSound(timerWarningSoundID)
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
    }

    static func cardPlaced() {
        AudioServicesPlaySystemSound(cardPlacedSoundID)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    static func roomTransition() {
        AudioServicesPlaySystemSound(roomTransitionSoundID)
        UIImpactFeedbackGenerator(style: .soft).impactOccurred()
    }
}
