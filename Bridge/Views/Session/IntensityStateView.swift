import SwiftUI

/// Combined "Intensity & State" check-in (spec section 4 / data model), moved to
/// immediately after the dice roll — see AppFlowStep's reconciliation note: the
/// calm-down step (section 5) needs an intensity reading before the oath, so this
/// screen has to happen before, not after, the ritual.
///
/// Partner B's whole section is rotated 180° to face them, the same seat-facing rule as
/// every room in the house — the phone lies flat on the table between two people sitting
/// across from each other, so their half of the screen reads right-side-up only from their
/// side. Continuing only unlocks once *both* have picked at least one feeling or written
/// their own.
struct IntensityStateView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var intensityA: Double = 0
    @State private var intensityB: Double = 0
    @State private var selectedA: Set<EmotionalState> = []
    @State private var selectedB: Set<EmotionalState> = []
    @State private var customA: String = ""
    @State private var customB: String = ""
    @State private var openPickerRole: PartnerRole?

    private var isReadyToContinue: Bool {
        filled(selectedA, customA) && filled(selectedB, customB)
    }

    private func filled(_ selected: Set<EmotionalState>, _ custom: String) -> Bool {
        !selected.isEmpty || !custom.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 28) {
                Text(L("intensity.title"))
                    .font(.bridgeSerifTitle())

                partnerSection(role: .partnerB, color: .green, intensity: $intensityB, selected: $selectedB, customText: $customB)
                    .rotationEffect(.degrees(180))

                partnerSection(role: .partnerA, color: .purple, intensity: $intensityA, selected: $selectedA, customText: $customA)

                PrimaryButton(
                    titleKey: "intensity.continue",
                    isEnabled: isReadyToContinue,
                    testID: "uitest.intensity.continue"
                ) {
                    vm.setIntensity(Int(intensityA), for: .partnerA)
                    vm.setIntensity(Int(intensityB), for: .partnerB)
                    for state in selectedA { vm.toggleState(state, for: .partnerA) }
                    for state in selectedB { vm.toggleState(state, for: .partnerB) }
                    vm.setCustomStateText(customA.trimmingCharacters(in: .whitespacesAndNewlines), for: .partnerA)
                    vm.setCustomStateText(customB.trimmingCharacters(in: .whitespacesAndNewlines), for: .partnerB)
                    onContinue()
                }
            }
            .padding(24)
        }
        .background(Color.bridgeIvory)
    }

    /// Calm gold at low intensity, escalating to a vivid, unmistakably "overwhelmed" red at
    /// the top of the scale — the color itself should read as urgency, not just the number.
    private func intensityColor(_ value: Double) -> Color {
        let t = value / 10
        return Color(red: 0.55 + 0.40 * t, green: 0.45 - 0.35 * t, blue: 0.20 - 0.15 * t)
    }

    @ViewBuilder
    private func partnerSection(
        role: PartnerRole,
        color: PartnerColor,
        intensity: Binding<Double>,
        selected: Binding<Set<EmotionalState>>,
        customText: Binding<String>
    ) -> some View {
        let vivid = intensityColor(intensity.wrappedValue)
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Circle().fill(color.color).frame(width: 10, height: 10)
                Text(vm.session.name(for: role)).font(.bridgeSerifHeadline(17))
            }

            Text(L("intensity.slider_label"))
                .font(.bridgeCaption)
                .foregroundStyle(.secondary)
            HStack {
                Slider(value: intensity, in: 0...10, step: 1)
                    .tint(vivid)
                    .accessibilityIdentifier("uitest.intensity.slider.\(role.rawValue)")
                Text("\(Int(intensity.wrappedValue))")
                    .font(.bridgeBody.monospacedDigit().weight(.bold))
                    .foregroundStyle(vivid)
                    .frame(width: 28)
            }
            if intensity.wrappedValue >= 7 {
                Text(L("intensity.overwhelmed_flag"))
                    .font(.bridgeLabel)
                    .foregroundStyle(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(vivid, in: Capsule())
            }

            Text(L("intensity.state_label"))
                .font(.bridgeCaption)
                .foregroundStyle(.secondary)

            Button {
                openPickerRole = role
            } label: {
                HStack {
                    if selected.wrappedValue.isEmpty {
                        Text(L("intensity.state_placeholder"))
                            .foregroundStyle(.secondary)
                    } else {
                        Text(selected.wrappedValue.map { L($0.textKey) }.sorted().joined(separator: ", "))
                            .foregroundStyle(.primary)
                            .lineLimit(2)
                    }
                    Spacer()
                    Image(systemName: "chevron.down").font(.caption.weight(.bold))
                }
                .font(.bridgeBody)
                .padding(.horizontal, 14)
                .padding(.vertical, 12)
                .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 12))
            }
            .buttonStyle(PressableButtonStyle())
            .accessibilityIdentifier("uitest.state.picker.\(role.rawValue)")
            .sheet(isPresented: Binding(
                get: { openPickerRole == role },
                set: { if !$0 { openPickerRole = nil } }
            )) {
                emotionPickerSheet(role: role, color: color, selected: selected)
            }

            TextField(L("intensity.custom_placeholder"), text: customText)
                .textFieldStyle(.roundedBorder)
                .accessibilityIdentifier("uitest.intensity.custom.\(role.rawValue)")
        }
        .padding(16)
        .background(color.color.opacity(0.06), in: RoundedRectangle(cornerRadius: 16))
    }

    /// A scrollable, multi-select list — a couple can pick as many feelings as apply,
    /// there is no cap — rather than a wall of toggle buttons on the page itself.
    @ViewBuilder
    private func emotionPickerSheet(role: PartnerRole, color: PartnerColor, selected: Binding<Set<EmotionalState>>) -> some View {
        NavigationStack {
            List(EmotionalState.allCases) { option in
                Button {
                    if selected.wrappedValue.contains(option) {
                        selected.wrappedValue.remove(option)
                    } else {
                        selected.wrappedValue.insert(option)
                    }
                } label: {
                    HStack {
                        Text(L(option.textKey)).foregroundStyle(.primary)
                        Spacer()
                        if selected.wrappedValue.contains(option) {
                            Image(systemName: "checkmark").foregroundStyle(color.color)
                        }
                    }
                }
                .accessibilityIdentifier("uitest.state.\(role.rawValue).\(option.rawValue)")
            }
            .navigationTitle(Text(L("intensity.state_label")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(L("room.done")) { openPickerRole = nil }
                        .accessibilityIdentifier("uitest.state.picker.done")
                }
            }
        }
        // A single fixed detent — two detents ([.medium, .large]) make SwiftUI treat a
        // drag at the top of the List as "resize the sheet" instead of "scroll the list",
        // which reads as the sheet randomly collapsing while scrolling through options.
        .presentationDetents([.large])
    }
}
