import SwiftUI
import Foundation

/// Each partner rolls their own die in turn — a single tap picking a random winner read
/// as broken/rigged ("I tapped once and immediately won"). Higher number starts every
/// room; SessionViewModel.rollDiceStep() rerolls both automatically on a tie.
struct DiceView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var rotation: Double = 0
    @State private var currentFace = 1
    @State private var faceTimer: Timer?

    private static let faceSymbols = [
        "die.face.1.fill", "die.face.2.fill", "die.face.3.fill",
        "die.face.4.fill", "die.face.5.fill", "die.face.6.fill",
    ]

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text(L("dice.title"))
                .font(.bridgeSerifTitle(26))
            Text(subtitle)
                .foregroundStyle(vm.diceJustTied ? Color.red : Color.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)

            Image(systemName: Self.faceSymbols[currentFace - 1])
                .font(.system(size: 96))
                .rotationEffect(.degrees(rotation))
                .foregroundStyle(Color.bridgeInk)

            VStack(spacing: 6) {
                if let a = vm.diceValueA, vm.diceStage != .partnerA {
                    Text(String(format: L("dice.value"), vm.session.name(for: .partnerA), a))
                        .font(.subheadline.weight(.medium))
                }
                if let b = vm.diceValueB, vm.diceStage == .done {
                    Text(String(format: L("dice.value"), vm.session.name(for: .partnerB), b))
                        .font(.subheadline.weight(.medium))
                }
            }

            if vm.diceStage == .done, let winner = vm.session.firstToSpeak {
                Text(String(format: L("dice.result"), vm.session.name(for: winner)))
                    .font(.headline)
                    .foregroundStyle(vm.session.color(for: winner).color)
            }

            Spacer()

            if vm.diceStage == .done {
                PrimaryButton(titleKey: "oath.ready", testID: "uitest.dice.continue", action: onContinue)
            } else {
                PrimaryButton(titleKey: "dice.roll", testID: "uitest.dice.roll", action: roll)
            }
        }
        .padding(28)
        .background(Color.bridgeIvory)
        .onDisappear { faceTimer?.invalidate() }
    }

    private var subtitle: String {
        if vm.diceJustTied {
            return L("dice.tie")
        }
        switch vm.diceStage {
        case .partnerA:
            return String(format: L("dice.subtitle_for"), vm.session.name(for: .partnerA))
        case .partnerB:
            return String(format: L("dice.subtitle_for"), vm.session.name(for: .partnerB))
        case .done:
            return L("dice.subtitle")
        }
    }

    private func roll() {
        withAnimation(.easeOut(duration: 0.6)) {
            rotation += 720
        }
        // Actually cycle through different faces while it "rolls" — a single static face
        // just spinning in place reads as broken/unresponsive, not as a die being rolled.
        faceTimer?.invalidate()
        faceTimer = Timer.scheduledTimer(withTimeInterval: 0.06, repeats: true) { _ in
            currentFace = Int.random(in: 1...6)
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            faceTimer?.invalidate()
            faceTimer = nil
            let value = vm.rollDiceStep()
            currentFace = value
        }
    }
}
