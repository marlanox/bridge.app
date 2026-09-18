import SwiftUI

struct RitualView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var chosenLine = 0
    @State private var isHolding = false

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text(LocalizedStringKey("ritual.title"))
                .font(.title.weight(.semibold))
            Text(LocalizedStringKey("ritual.instruction"))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            Picker("", selection: $chosenLine) {
                Text(LocalizedStringKey("ritual.line_1")).tag(0)
                Text(LocalizedStringKey("ritual.line_2")).tag(1)
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, 20)

            Text(LocalizedStringKey(chosenLine == 0 ? "ritual.line_1" : "ritual.line_2"))
                .font(.title2.weight(.medium))
                .italic()
                .padding(.top, 8)

            Spacer()

            Button {
                withAnimation { isHolding = true }
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.4) {
                    vm.completeRitual()
                    onContinue()
                }
            } label: {
                Text(LocalizedStringKey("ritual.continue"))
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
            }
            .background(isHolding ? Color(red: 0.55, green: 0.47, blue: 0.86) : Color(red: 0.36, green: 0.31, blue: 0.27))
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }
}
