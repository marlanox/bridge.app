import SwiftUI

/// Combined "Intensity & State" check-in (spec section 4 / data model), moved to
/// immediately after the dice roll — see AppFlowStep's reconciliation note: the
/// calm-down step (section 5) needs an intensity reading before the oath, so this
/// screen has to happen before, not after, the ritual.
struct IntensityStateView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var intensityA: Double = 0
    @State private var intensityB: Double = 0
    @State private var stateA: EmotionalState?
    @State private var stateB: EmotionalState?

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                Text(LocalizedStringKey("intensity.title"))
                    .font(.title.weight(.semibold))

                partnerSection(role: .partnerA, color: .purple, intensity: $intensityA, state: $stateA)
                partnerSection(role: .partnerB, color: .green, intensity: $intensityB, state: $stateB)

                PrimaryButton(
                    titleKey: "intensity.continue",
                    isEnabled: stateA != nil && stateB != nil
                ) {
                    vm.setIntensity(Int(intensityA), for: .partnerA)
                    vm.setIntensity(Int(intensityB), for: .partnerB)
                    if let stateA { vm.setState(stateA, for: .partnerA) }
                    if let stateB { vm.setState(stateB, for: .partnerB) }
                    onContinue()
                }
            }
            .padding(24)
        }
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }

    @ViewBuilder
    private func partnerSection(role: PartnerRole, color: PartnerColor, intensity: Binding<Double>, state: Binding<EmotionalState?>) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Circle().fill(color.color).frame(width: 10, height: 10)
                Text(vm.session.name(for: role)).font(.headline)
            }

            Text(LocalizedStringKey("intensity.slider_label"))
                .font(.subheadline)
                .foregroundStyle(.secondary)
            HStack {
                Slider(value: intensity, in: 0...10, step: 1)
                    .tint(color.color)
                Text("\(Int(intensity.wrappedValue))")
                    .font(.subheadline.monospacedDigit())
                    .frame(width: 24)
            }

            Text(LocalizedStringKey("intensity.state_label"))
                .font(.subheadline)
                .foregroundStyle(.secondary)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 8)], spacing: 8) {
                ForEach(EmotionalState.allCases) { option in
                    Button {
                        state.wrappedValue = option
                    } label: {
                        Text(LocalizedStringKey(option.textKey))
                            .font(.caption.weight(.medium))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 8)
                            .frame(maxWidth: .infinity)
                            .background(state.wrappedValue == option ? color.color.opacity(0.3) : Color.primary.opacity(0.05))
                            .clipShape(Capsule())
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .padding(16)
        .background(color.color.opacity(0.06), in: RoundedRectangle(cornerRadius: 16))
    }
}
