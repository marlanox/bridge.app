import SwiftUI

struct DiceView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var rolled = false
    @State private var rotation: Double = 0
    @State private var winner: PartnerRole?

    var body: some View {
        VStack(spacing: 28) {
            Spacer()
            Text(L("dice.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("dice.subtitle"))
                .foregroundStyle(.secondary)

            Image(systemName: "die.face.5.fill")
                .font(.system(size: 96))
                .rotationEffect(.degrees(rotation))
                .foregroundStyle(Color(red: 0.36, green: 0.31, blue: 0.27))

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
                    let result = vm.rollDice()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
                        winner = result
                        rolled = true
                    }
                }
            }
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }
}
