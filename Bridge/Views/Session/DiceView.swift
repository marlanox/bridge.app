import SwiftUI
import Foundation

struct DiceView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var rolled = false
    @State private var rotation: Double = 0
    @State private var winner: PartnerRole?
    @State private var currentFace = 1
    @State private var faceTimer: Timer?

    private static let faceSymbols = [
        "die.face.1.fill", "die.face.2.fill", "die.face.3.fill",
        "die.face.4.fill", "die.face.5.fill", "die.face.6.fill",
    ]

    var body: some View {
        VStack(spacing: 28) {
            Spacer()
            Text(L("dice.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("dice.subtitle"))
                .foregroundStyle(.secondary)

            Image(systemName: Self.faceSymbols[currentFace - 1])
                .font(.system(size: 96))
                .rotationEffect(.degrees(rotation))
                .foregroundStyle(Color.bridgeInk)

            if let winner {
                Text(String(format: L("dice.result"), vm.session.name(for: winner)))
                    .font(.headline)
                    .foregroundStyle(vm.session.color(for: winner).color)
            }

            Spacer()

            if rolled {
                PrimaryButton(titleKey: "oath.ready", testID: "uitest.dice.continue", action: onContinue)
            } else {
                PrimaryButton(titleKey: "dice.roll", testID: "uitest.dice.roll") {
                    withAnimation(.easeOut(duration: 0.6)) {
                        rotation += 720
                    }
                    // Actually cycle through different faces while it "rolls" — a single
                    // static face just spinning in place reads as broken/unresponsive,
                    // not as a die being rolled.
                    faceTimer?.invalidate()
                    faceTimer = Timer.scheduledTimer(withTimeInterval: 0.06, repeats: true) { _ in
                        currentFace = Int.random(in: 1...6)
                    }
                    let result = vm.rollDice()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                        faceTimer?.invalidate()
                        faceTimer = nil
                        currentFace = Int.random(in: 1...6)
                        winner = result
                        rolled = true
                    }
                }
            }
        }
        .padding(28)
        .background(Color.bridgeIvory)
        .onDisappear { faceTimer?.invalidate() }
    }
}
