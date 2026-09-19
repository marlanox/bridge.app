import SwiftUI

struct RitualView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var chosenLine: Int? = nil
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
                    Button {
                        chosenLine = index
                    } label: {
                        HStack {
                            Text(L(key))
                                .font(.title3.weight(.medium))
                                .italic()
                                .multilineTextAlignment(.leading)
                                .fixedSize(horizontal: false, vertical: true)
                            Spacer()
                            if chosenLine == index {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(Color.bridgeGold)
                            }
                        }
                        .padding(16)
                        .frame(maxWidth: .infinity)
                        .background(chosenLine == index ? Color.bridgeGold.opacity(0.15) : Color.primary.opacity(0.05))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .strokeBorder(chosenLine == index ? Color.bridgeGold : .clear, lineWidth: 1.5)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                    }
                    .buttonStyle(PressableButtonStyle())
                    .foregroundStyle(.primary)
                    .accessibilityIdentifier("uitest.ritual.line.\(index)")
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
            .opacity(chosenLine == nil ? 0.4 : 1)
            .disabled(chosenLine == nil)
            .accessibilityIdentifier("uitest.ritual.continue")
        }
        .padding(28)
        .background(Color.bridgeIvory)
    }
}
