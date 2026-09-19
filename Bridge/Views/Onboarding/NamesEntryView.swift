import SwiftUI

struct NamesEntryView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var nameA: String = ""
    @State private var nameB: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Spacer()
            Text(L("names.title"))
                .font(.bridgeSerifTitle(26))

            VStack(spacing: 14) {
                HStack {
                    Circle().fill(PartnerColor.purple.color).frame(width: 10, height: 10)
                    TextField(L("names.partner_a_placeholder"), text: $nameA)
                        .textFieldStyle(.roundedBorder)
                        .accessibilityIdentifier("uitest.names.partnerA")
                }
                HStack {
                    Circle().fill(PartnerColor.green.color).frame(width: 10, height: 10)
                    TextField(L("names.partner_b_placeholder"), text: $nameB)
                        .textFieldStyle(.roundedBorder)
                        .accessibilityIdentifier("uitest.names.partnerB")
                }
            }
            Spacer()
            PrimaryButton(
                titleKey: "names.continue",
                isEnabled: !nameA.trimmingCharacters(in: .whitespaces).isEmpty && !nameB.trimmingCharacters(in: .whitespaces).isEmpty,
                testID: "uitest.names.continue"
            ) {
                vm.setNames(partnerA: nameA.trimmingCharacters(in: .whitespaces), partnerB: nameB.trimmingCharacters(in: .whitespaces))
                onContinue()
            }
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
        .onAppear {
            nameA = vm.session.partnerA.name
            nameB = vm.session.partnerB.name
        }
    }
}
