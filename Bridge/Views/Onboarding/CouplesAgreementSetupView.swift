import SwiftUI

/// Spec section 3 item 7 / section 9: forbidden actions the couple agrees on up front.
/// Can be skipped and filled in later — nothing here blocks starting a session.
struct CouplesAgreementSetupView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var newRule: String = ""

    private let exampleKeys = (1...7).map { String(format: "couples_agreement.example.%02d", $0) }

    var body: some View {
        VStack(alignment: .leading, spacing: 18) {
            Text(LocalizedStringKey("couples_agreement.title"))
                .font(.title.weight(.semibold))
            Text(LocalizedStringKey("couples_agreement.subtitle"))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ScrollView {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(Array(vm.couplesAgreement.enumerated()), id: \.offset) { index, rule in
                        HStack {
                            Text(rule).font(.subheadline)
                            Spacer()
                            Button {
                                vm.removeAgreementRule(at: IndexSet(integer: index))
                            } label: {
                                Image(systemName: "xmark.circle.fill").foregroundStyle(.secondary)
                            }
                        }
                        .padding(12)
                        .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 12))
                    }

                    if vm.couplesAgreement.isEmpty {
                        Text(LocalizedStringKey("couples_agreement.subtitle"))
                            .font(.caption)
                            .foregroundStyle(.secondary)
                        ForEach(exampleKeys, id: \.self) { key in
                            Button {
                                vm.addAgreementRule(NSLocalizedString(key, comment: ""))
                            } label: {
                                HStack {
                                    Image(systemName: "plus.circle")
                                    Text(LocalizedStringKey(key)).font(.caption)
                                    Spacer()
                                }
                            }
                            .buttonStyle(.plain)
                            .foregroundStyle(.secondary)
                        }
                    }
                }
            }

            HStack {
                TextField(NSLocalizedString("couples_agreement.placeholder", comment: ""), text: $newRule)
                    .textFieldStyle(.roundedBorder)
                Button(LocalizedStringKey("couples_agreement.add_rule")) {
                    vm.addAgreementRule(newRule)
                    newRule = ""
                }
                .disabled(newRule.trimmingCharacters(in: .whitespaces).isEmpty)
            }

            HStack(spacing: 12) {
                SecondaryButton(titleKey: "couples_agreement.skip_for_now", action: onContinue)
                PrimaryButton(titleKey: "couples_agreement.save", action: onContinue)
            }
        }
        .padding(24)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }
}
