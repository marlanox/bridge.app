import SwiftUI

struct OathView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Text(L("oath.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("oath.text"))
                .font(.title3)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 12)
                .italic()
            Spacer()
            PrimaryButton(titleKey: "oath.ready", testID: "uitest.oath.ready") {
                vm.completeOath()
                onContinue()
            }
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }
}
