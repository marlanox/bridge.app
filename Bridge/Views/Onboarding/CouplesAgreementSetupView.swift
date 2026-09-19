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
                            Button {
                                vm.removeAgreementRule(at: IndexSet(integer: index))
                            } label: {
                                HStack {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundStyle(Color.bridgeGold)
                                    Text(rule).font(.bridgeBody).foregroundStyle(.primary)
                                    Spacer()
                                    Text(L("couples_agreement.tap_to_remove"))
                                        .font(.bridgeLabel)
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .buttonStyle(PressableButtonStyle())
                            .padding(12)
                            .background(Color.bridgeGold.opacity(0.12), in: RoundedRectangle(cornerRadius: 12))
                        }
                    }

                    // Every suggestion not already added stays available — picking one never
                    // hides the rest, so a couple can add as many (or as few) as they like.
                    // Nothing here is active until tapped: an empty circle means "not part
                    // of your agreement yet," matching the checkmark once it's added above.
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
                                    Image(systemName: "circle")
                                    Text(L(key)).font(.bridgeBody)
                                    Spacer()
                                }
                            }
                            .buttonStyle(PressableButtonStyle())
                            .foregroundStyle(.primary)
                            .padding(12)
                            .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 12))
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
