import SwiftUI

/// Spec section 3, item 6: "a short summary is shown; each partner in turn taps 'I
/// understand and agree.' The game cannot start until both have confirmed."
struct ComprehensionAgreementView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Spacer()
            Text(LocalizedStringKey("agree.title"))
                .font(.title.weight(.semibold))
            Text(LocalizedStringKey("agree.summary"))
                .font(.body)
                .foregroundStyle(.secondary)
            Spacer()

            confirmRow(role: .partnerA, color: .purple)
            confirmRow(role: .partnerB, color: .green)

            PrimaryButton(titleKey: "names.continue", isEnabled: vm.bothConfirmedComprehension, action: onContinue)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }

    @ViewBuilder
    private func confirmRow(role: PartnerRole, color: PartnerColor) -> some View {
        let confirmed = vm.comprehensionConfirmed[role] == true
        Button {
            vm.confirmComprehension(role)
        } label: {
            HStack {
                Circle().fill(color.color).frame(width: 10, height: 10)
                Text(vm.session.name(for: role))
                    .font(.subheadline.weight(.medium))
                Spacer()
                if confirmed {
                    Image(systemName: "checkmark.circle.fill").foregroundStyle(color.color)
                } else {
                    Text(LocalizedStringKey("agree.button"))
                        .font(.caption.weight(.semibold))
                }
            }
            .padding(14)
            .background(color.color.opacity(confirmed ? 0.25 : 0.08), in: RoundedRectangle(cornerRadius: 14))
        }
        .buttonStyle(.plain)
        .disabled(confirmed)
    }
}
