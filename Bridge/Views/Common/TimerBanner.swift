import SwiftUI

/// Soft timer, never a hard cutoff (spec section 6). Shows a quiet countdown, then a
/// banner offering more time or "done" — the room only advances once both partners
/// have tapped done.
struct TimerBanner: View {
    let secondsRemaining: Int
    let timeUpBannerShown: Bool
    let onMoreTime: () -> Void
    let onDone: () -> Void

    var body: some View {
        VStack(spacing: 10) {
            if timeUpBannerShown {
                Text(L("room.time_up_banner"))
                    .font(.subheadline.weight(.semibold))
                HStack(spacing: 12) {
                    SecondaryButton(titleKey: "room.a_bit_more_time", action: onMoreTime)
                    Button(action: onDone) {
                        Text(L("room.done"))
                            .font(.subheadline.weight(.semibold))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                    }
                    .background(Color.bridgeInk)
                    .foregroundStyle(.white)
                    .clipShape(Capsule())
                }
            } else {
                Text(timeString)
                    .font(.subheadline.monospacedDigit())
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
    }

    private var timeString: String {
        let m = max(secondsRemaining, 0) / 60
        let s = max(secondsRemaining, 0) % 60
        return String(format: "%d:%02d", m, s)
    }
}
