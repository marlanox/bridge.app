import SwiftUI

enum HouseMapContext: Equatable {
    case onboarding
    case settings
}

/// The house map overview: shown once as the last onboarding step (after "How Bridge
/// works," before Names entry) and reachable anytime from Settings as "View the path."
/// The photo itself already shows the numbered 1-7 path with each room labeled, including
/// the bridge at the bottom — so the text card sits mid-screen, over the least busy part
/// of the photo, and can be tucked away entirely once read to let the whole house show.
struct HouseMapView: View {
    let context: HouseMapContext
    var onContinue: (() -> Void)? = nil

    @Environment(\.dismiss) private var dismiss
    @State private var textExpanded = true

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "house-map")
            LinearGradient(colors: [.clear, .clear, .black.opacity(0.55)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            VStack {
                Spacer()
                if textExpanded {
                    card.transition(.opacity.combined(with: .scale(scale: 0.96)))
                } else {
                    collapsedPill.transition(.opacity)
                }
                Spacer()
                PrimaryButton(titleKey: buttonKey, testID: "uitest.housemap.continue", action: finish)
                    .padding(.horizontal, 24)
                    .padding(.bottom, 28)
            }
        }
        .animation(.spring(response: 0.4, dampingFraction: 0.85), value: textExpanded)
    }

    private var buttonKey: String {
        context == .onboarding ? "housemap.button_first" : "housemap.button_reopen"
    }

    private func finish() {
        if let onContinue {
            onContinue()
        } else {
            dismiss()
        }
    }

    private var card: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(L("housemap.title"))
                .font(.bridgeSerifTitle(24))
                .foregroundStyle(.white)
            Text(L("housemap.body"))
                .font(.bridgeBody)
                .foregroundStyle(.white.opacity(0.92))

            Button { textExpanded = false } label: {
                HStack(spacing: 5) {
                    Text(L("housemap.got_it"))
                    Image(systemName: "chevron.down")
                }
                .font(.bridgeCaption.weight(.bold))
                .foregroundStyle(Color.bridgeGold)
            }
            .accessibilityIdentifier("uitest.housemap.gotit")
            .padding(.top, 2)
        }
        .padding(18)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .padding(.horizontal, 24)
    }

    private var collapsedPill: some View {
        Button { textExpanded = true } label: {
            HStack(spacing: 8) {
                Image(systemName: "chevron.up")
                Text(L("housemap.title"))
            }
            .font(.bridgeCaption.weight(.bold))
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(.ultraThinMaterial, in: Capsule())
        }
        .accessibilityIdentifier("uitest.housemap.expand")
    }
}
