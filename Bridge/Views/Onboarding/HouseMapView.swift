import SwiftUI

enum HouseMapContext: Equatable {
    case onboarding
    case settings
}

/// The house map overview: shown once as the last onboarding step (after "How Bridge
/// works," before Names entry) and reachable anytime from Settings as "View the path."
/// The photo itself already shows the numbered 1-7 path with each room labeled, so the
/// text card stays short and sits low on the screen — repeating the room names in text,
/// or centering a tall card over the image, would just cover the map it's describing.
struct HouseMapView: View {
    let context: HouseMapContext
    var onContinue: (() -> Void)? = nil

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "house-map")
            LinearGradient(colors: [.clear, .clear, .black.opacity(0.75)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            VStack {
                Spacer()
                card
                PrimaryButton(titleKey: buttonKey, testID: "uitest.housemap.continue", action: finish)
                    .padding(.horizontal, 24)
                    .padding(.top, 14)
                    .padding(.bottom, 28)
            }
        }
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
        VStack(alignment: .leading, spacing: 8) {
            Text(L("housemap.title"))
                .font(.bridgeSerifTitle(24))
                .foregroundStyle(.white)
            Text(L("housemap.body"))
                .font(.bridgeCaption)
                .foregroundStyle(.white.opacity(0.92))
        }
        .padding(18)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .padding(.horizontal, 24)
    }
}
