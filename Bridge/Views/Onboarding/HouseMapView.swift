import SwiftUI

enum HouseMapContext: Equatable {
    case onboarding
    case settings
}

/// The house map overview: shown once as the last onboarding step (after "How Bridge
/// works," before Names entry) and reachable anytime from Settings as "View the path."
/// Always shows the numbered 1-7 path to the bridge — the background photo is
/// atmosphere, not the map itself, so the list never depends on which photo is set.
struct HouseMapView: View {
    let context: HouseMapContext
    var onContinue: (() -> Void)? = nil

    @Environment(\.dismiss) private var dismiss

    private let stopKeys = [
        "room.hall.name", "room.living_room.name", "room.study.name",
        "room.kids_room.name", "room.kitchen.name", "room.basement.name", "bridge.title"
    ]

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "house-map")
            LinearGradient(colors: [.black.opacity(0.05), .black.opacity(0.55)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            VStack {
                Spacer()
                card
                Spacer()
                PrimaryButton(titleKey: buttonKey, testID: "uitest.housemap.continue", action: finish)
                    .padding(.horizontal, 24)
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
        VStack(alignment: .leading, spacing: 16) {
            Text(L("housemap.title"))
                .font(.bridgeSerifTitle(28))
                .foregroundStyle(.white)
            Text(L("housemap.body"))
                .font(.body)
                .foregroundStyle(.white.opacity(0.92))

            numberedList
        }
        .padding(22)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
        .padding(.horizontal, 24)
    }

    private var numberedList: some View {
        VStack(alignment: .leading, spacing: 10) {
            ForEach(Array(stopKeys.enumerated()), id: \.offset) { index, key in
                HStack(spacing: 10) {
                    Text("\(index + 1)")
                        .font(.bridgeBody.weight(.bold))
                        .foregroundStyle(Color.bridgeInk)
                        .frame(width: 24, height: 24)
                        .background(Color.bridgeGold, in: Circle())
                    Text(L(key))
                        .font(.bridgeBody.weight(.medium))
                        .foregroundStyle(.white)
                }
            }
        }
        .padding(.top, 8)
    }
}
