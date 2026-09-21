import SwiftUI

/// A plain list to read from out loud, not a UI choice — there is nothing to tap or
/// select here (both partners choose out loud, together, which phrase fits, or say
/// both); the one and only control on this screen is the continue button below.
struct RitualView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var isHolding = false

    private var lineKeys: [String] { ["ritual.line_1", "ritual.line_2"] }

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text(L("ritual.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("ritual.instruction"))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            VStack(spacing: 12) {
                ForEach(Array(lineKeys.enumerated()), id: \.offset) { index, key in
                    HStack {
                        Text(L(key))
                            .font(.bridgeSerifHeadline(18))
                            .fontWeight(.bold)
                            .multilineTextAlignment(.leading)
                            .fixedSize(horizontal: false, vertical: true)
                        Spacer()
                    }
                    .foregroundStyle(Color.bridgeInk)
                    .padding(16)
                    .frame(maxWidth: .infinity)
                    .background(Color.bridgeIvory)
                    .overlay(
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .strokeBorder(Color.bridgeInk.opacity(0.15), lineWidth: 1.3)
                    )
                    .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                }
            }
            .padding(.horizontal, 20)

            Spacer()

            Button {
                withAnimation { isHolding = true }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                    vm.completeRitual()
                    onContinue()
                }
            } label: {
                Text(L("ritual.continue"))
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
            }
            .background(isHolding ? Color.bridgeGold : Color.bridgeInk)
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .accessibilityIdentifier("uitest.ritual.continue")
        }
        .padding(28)
        .background(Color.bridgeIvory)
    }
}
