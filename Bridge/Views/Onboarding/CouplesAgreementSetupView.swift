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
            Text(L("couples_agreement.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("couples_agreement.subtitle"))
                .font(.subheadline)
                .foregroundStyle(.secondary)

            ScrollView {
                VStack(alignment: .leading, spacing: 10) {
                    if !vm.couplesAgreement.isEmpty {
                        Text(L("couples_agreement.your_rules_header"))
                            .font(.bridgeCaption.weight(.bold))
                            .foregroundStyle(.secondary)
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
                    }

                    // Every suggestion not already added stays available — picking one never
                    // hides the rest, so a couple can add as many (or as few) as they like.
                    let remainingExamples = exampleKeys.filter { !vm.couplesAgreement.contains(L($0)) }
                    if !remainingExamples.isEmpty {
                        Text(L("couples_agreement.suggestions_header"))
                            .font(.bridgeCaption.weight(.bold))
                            .foregroundStyle(.secondary)
                            .padding(.top, vm.couplesAgreement.isEmpty ? 0 : 8)
                        ForEach(remainingExamples, id: \.self) { key in
                            Button {
                                vm.addAgreementRule(L(key))
                            } label: {
                                HStack {
                                    Image(systemName: "plus.circle")
                                    Text(L(key)).font(.bridgeCaption)
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
                TextField(L("couples_agreement.placeholder"), text: $newRule)
                    .textFieldStyle(.roundedBorder)
                Button(L("couples_agreement.add_rule")) {
                    vm.addAgreementRule(newRule)
                    newRule = ""
                }
                .disabled(newRule.trimmingCharacters(in: .whitespaces).isEmpty)
            }

            HStack(spacing: 12) {
                SecondaryButton(titleKey: "couples_agreement.skip_for_now", testID: "uitest.agreement.skip", action: onContinue)
                PrimaryButton(titleKey: "couples_agreement.save", action: onContinue)
            }
        }
        .padding(24)
        .background(Color.bridgeIvory)
    }
}
