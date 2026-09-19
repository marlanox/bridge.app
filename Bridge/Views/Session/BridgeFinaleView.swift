import SwiftUI

/// Bridge finale (spec section 6, room 8 — Garden and Bridge are one screen, no
/// separate Needs Room). Each partner picks a Step Toward card, a Need card and a
/// gift, then completes the one fixed mandatory card aloud.
///
/// The three decks show one at a time, in order — never all three stacked at once —
/// so it's unambiguous that all three are required. Advancing to the next deck is
/// automatic the moment the active partner picks a card for the current one, derived
/// straight from which fields are still empty rather than tracked as separate state,
/// so switching tabs back and forth always resumes each partner at their own next step.
struct BridgeFinaleView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var activeTab: PartnerRole = .partnerA

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "bridge")
            Color.black.opacity(0.32).ignoresSafeArea()

            VStack(spacing: 0) {
                header

                Picker("", selection: $activeTab) {
                    Text(vm.session.partnerA.name).tag(PartnerRole.partnerA)
                    Text(vm.session.partnerB.name).tag(PartnerRole.partnerB)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 16)
                .padding(.top, 8)

                Group {
                    if let kind = currentKind(for: activeTab) {
                        VStack(alignment: .leading, spacing: 12) {
                            stepProgress(kind)
                            deckSection(kind: kind, deck: deck(for: kind), promptKey: promptKey(for: kind))
                        }
                        .padding(16)
                    } else {
                        allChosenNotice
                    }
                }
                .frame(maxHeight: 380)

                mandatorySection
                togetherSection
            }
        }
    }

    private var mandatoryCardTextKey: String {
        DeckData.stepToward.cards.first(where: { $0.id == DeckData.mandatoryStepTowardCardID })?.textKey ?? ""
    }

    private func selectedCardID(kind: SessionViewModel.BridgeCardKind, role: PartnerRole) -> String? {
        let selection = vm.session.bridgeFinal[role]
        switch kind {
        case .stepToward: return selection?.stepTowardCardID
        case .need: return selection?.needCardID
        case .gift: return selection?.giftCardID
        }
    }

    /// The next deck this partner still needs to choose from, in fixed order — `nil`
    /// once all three are picked.
    private func currentKind(for role: PartnerRole) -> SessionViewModel.BridgeCardKind? {
        if selectedCardID(kind: .stepToward, role: role) == nil { return .stepToward }
        if selectedCardID(kind: .need, role: role) == nil { return .need }
        if selectedCardID(kind: .gift, role: role) == nil { return .gift }
        return nil
    }

    private func stepIndex(_ kind: SessionViewModel.BridgeCardKind) -> Int {
        switch kind {
        case .stepToward: return 1
        case .need: return 2
        case .gift: return 3
        }
    }

    private func deck(for kind: SessionViewModel.BridgeCardKind) -> Deck {
        switch kind {
        case .stepToward: return DeckData.stepToward
        case .need: return DeckData.needsConnection
        case .gift: return DeckData.gifts
        }
    }

    private func promptKey(for kind: SessionViewModel.BridgeCardKind) -> String {
        switch kind {
        case .stepToward: return "bridge.choose_step_toward"
        case .need: return "bridge.choose_need"
        case .gift: return "bridge.choose_gift"
        }
    }

    @ViewBuilder
    private func stepProgress(_ kind: SessionViewModel.BridgeCardKind) -> some View {
        let index = stepIndex(kind)
        HStack(spacing: 8) {
            HStack(spacing: 6) {
                ForEach(1...3, id: \.self) { i in
                    Capsule()
                        .fill(i <= index ? Color.bridgeGold : Color.white.opacity(0.25))
                        .frame(width: i == index ? 22 : 8, height: 6)
                }
            }
            Spacer()
            Text(LF("bridge.step_progress", index, 3))
                .font(.bridgeLabel)
                .foregroundStyle(.white.opacity(0.85))
        }
        .accessibilityIdentifier("uitest.bridge.step.\(index)")
    }

    private var allChosenNotice: some View {
        VStack(spacing: 10) {
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 30))
                .foregroundStyle(Color.bridgeGold)
            Text(LF("bridge.partner_cards_done", vm.session.name(for: activeTab)))
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.white)
                .multilineTextAlignment(.center)
        }
        .padding(24)
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private func deckSection(kind: SessionViewModel.BridgeCardKind, deck: Deck, promptKey: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(L(promptKey))
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)

            LazyVGrid(columns: [GridItem(.adaptive(minimum: 130), spacing: 8)], spacing: 8) {
                ForEach(deck.cards.filter { $0.id != DeckData.mandatoryStepTowardCardID || kind != .stepToward }) { card in
                    let isSelected = selectedCardID(kind: kind, role: activeTab) == card.id
                    Button {
                        vm.selectBridgeCard(card.id, kind: kind, for: activeTab)
                    } label: {
                        HStack(spacing: 6) {
                            if isSelected {
                                Image(systemName: "checkmark.circle.fill")
                            }
                            Text(L(card.textKey))
                                .font(.system(size: 13, weight: .medium))
                                .multilineTextAlignment(.leading)
                        }
                        .padding(9)
                        .frame(maxWidth: .infinity, minHeight: 46, alignment: .leading)
                    }
                    .background(.ultraThinMaterial)
                    .background(vm.session.color(for: activeTab).color.opacity(isSelected ? 0.45 : 0.18))
                    .clipShape(RoundedRectangle(cornerRadius: 11, style: .continuous))
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var mandatorySection: some View {
        VStack(spacing: 10) {
            Text(L("bridge.mandatory_card_prompt"))
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(L(mandatoryCardTextKey))
                .font(.subheadline.weight(.semibold))
                .multilineTextAlignment(.center)
            HStack(spacing: 12) {
                mandatoryCheckButton(role: .partnerA, color: .purple)
                mandatoryCheckButton(role: .partnerB, color: .green)
            }
        }
        .padding(12)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 14))
        .padding(.horizontal, 16)
        .padding(.top, 10)
    }

    @ViewBuilder
    private func mandatoryCheckButton(role: PartnerRole, color: PartnerColor) -> some View {
        let done = vm.session.bridgeFinal[role]?.completedMandatoryCard == true
        Button {
            vm.completeMandatoryCard(for: role)
        } label: {
            HStack {
                Image(systemName: done ? "checkmark.circle.fill" : "circle")
                Text(vm.session.name(for: role)).font(.caption.weight(.semibold))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
        }
        .background(color.color.opacity(done ? 0.35 : 0.15), in: Capsule())
        .buttonStyle(.plain)
        .disabled(done)
    }

    private var togetherSection: some View {
        VStack(spacing: 12) {
            Text(L("bridge.together_line"))
                .font(.title3.weight(.medium))
                .multilineTextAlignment(.center)
                .foregroundStyle(.white)
            PrimaryButton(titleKey: "bridge.same_side_button", isEnabled: vm.bridgeFinaleComplete, action: onContinue)
        }
        .padding(16)
    }

    private var header: some View {
        VStack(spacing: 4) {
            Text(L("bridge.title"))
                .font(.bridgeSerifTitle(34, weight: .bold))
                .foregroundStyle(.white)
            Text(L("bridge.question"))
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.85))
            Text(L("bridge.choose_all_prompt"))
                .font(.caption.weight(.semibold))
                .foregroundStyle(.white.opacity(0.9))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
                .padding(.top, 2)
        }
        .padding(.top, 16)
    }
}
