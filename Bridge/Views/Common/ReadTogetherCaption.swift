import SwiftUI

/// A small standing reminder at the top of every screen that does NOT physically rotate
/// for turn-taking — couples otherwise assume a single phone screen must belong to
/// whoever's holding it, and miss that these screens are meant to be read together.
/// Room/basement turn screens rotate 180° instead, which already signals "this is
/// someone's own moment" without needing this caption.
struct ReadTogetherCaption: View {
    var body: some View {
        Text(L("nav.read_together"))
            .font(.caption2.weight(.bold))
            .textCase(.uppercase)
            .tracking(0.6)
            .foregroundStyle(Color.bridgeInk)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Color.bridgeGold, in: Capsule())
            .padding(.top, 6)
    }
}
