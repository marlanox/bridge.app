import SwiftUI

struct NamesEntryView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var nameA: String = ""
    @State private var nameB: String = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Spacer()
            Text(LocalizedStringKey("names.title"))
                .font(.title.weight(.semibold))

            VStack(spacing: 14) {
                HStack {
                    Circle().fill(PartnerColor.purple.color).frame(width: 10, height: 10)
                    TextField(NSLocalizedString("names.partner_a_placeholder", comment: ""), text: $nameA)
                        .textFieldStyle(.roundedBorder)
                }
                HStack {
                    Circle().fill(PartnerColor.green.color).frame(width: 10, height: 10)
                    TextField(NSLocalizedString("names.partner_b_placeholder", comment: ""), text: $nameB)
                        .textFieldStyle(.roundedBorder)
                }
            }
            Spacer()
            PrimaryButton(
                titleKey: "names.continue",
                isEnabled: !nameA.trimmingCharacters(in: .whitespaces).isEmpty && !nameB.trimmingCharacters(in: .whitespaces).isEmpty
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
