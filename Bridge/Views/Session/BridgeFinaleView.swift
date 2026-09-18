import SwiftUI

/// Garden → Bridge finale (spec section 6, room 8). Each partner picks a Step Toward
/// card, a Need card and a gift, then completes the one fixed mandatory card aloud.
struct BridgeFinaleView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @State private var activeTab: PartnerRole = .partnerA
    @State private var category: SessionViewModel.BridgeCardKind = .stepToward

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "bridge")
            Color.black.opacity(0.3).ignoresSafeArea()

            VStack(spacing: 0) {
                header

                Picker("", selection: $activeTab) {
                    Text(vm.session.partnerA.name).tag(PartnerRole.partnerA)
                    Text(vm.session.partnerB.name).tag(PartnerRole.partnerB)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 16)
                .padding(.top, 8)

                Picker("", selection: $category) {
                    Text(LocalizedStringKey("bridge.choose_step_toward")).tag(SessionViewModel.BridgeCardKind.stepToward)
                    Text(LocalizedStringKey("bridge.choose_need")).tag(SessionViewModel.BridgeCardKind.need)
                    Text(LocalizedStringKey("bridge.choose_gift")).tag(SessionViewModel.BridgeCardKind.gift)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 16)
                .padding(.top, 6)

                categoryGrid
                    .frame(maxHeight: 260)

                mandatorySection
                togetherSection
            }
        }
    }

    private var mandatoryCardTextKey: String {
        DeckData.stepToward.cards.first(where: { $0.id == DeckData.mandatoryStepTowardCardID })?.textKey ?? ""
    }

    private var currentDeck: Deck {
        switch category {
        case .stepToward: return DeckData.stepToward
        case .need: return DeckData.needsConnection
        case .gift: return DeckData.gifts
        }
    }

    private func selectedCardID(role: PartnerRole) -> String? {
        let selection = vm.session.bridgeFinal[role]
        switch category {
        case .stepToward: return selection?.stepTowardCardID
        case .need: return selection?.needCardID
        case .gift: return selection?.giftCardID
        }
    }

    private var categoryGrid: some View {
        ScrollView {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 140), spacing: 10)], spacing: 10) {
                ForEach(currentDeck.cards.filter { $0.id != DeckData.mandatoryStepTowardCardID || category != .stepToward }) { card in
                    let isSelected = selectedCardID(role: activeTab) == card.id
                    Button {
                        vm.selectBridgeCard(card.id, kind: category, for: activeTab)
                    } label: {
                        HStack(spacing: 6) {
                            if isSelected {
                                Image(systemName: "checkmark.circle.fill")
                            }
                            Text(LocalizedStringKey(card.textKey))
                                .font(.system(size: 14, weight: .medium))
                                .multilineTextAlignment(.leading)
                        }
                        .padding(10)
                        .frame(maxWidth: .infinity, minHeight: 52, alignment: .leading)
                    }
                    .background(.ultraThinMaterial)
                    .background(vm.session.color(for: activeTab).color.opacity(isSelected ? 0.4 : 0.18))
                    .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                    .buttonStyle(.plain)
                }
            }
            .padding(16)
        }
    }

    private var mandatorySection: some View {
        VStack(spacing: 10) {
            Text(LocalizedStringKey("bridge.mandatory_card_prompt"))
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(LocalizedStringKey(mandatoryCardTextKey))
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
            Text(LocalizedStringKey("bridge.together_line"))
                .font(.title3.weight(.medium))
                .multilineTextAlignment(.center)
                .foregroundStyle(.white)
            PrimaryButton(titleKey: "bridge.same_side_button", isEnabled: vm.bridgeFinaleComplete, action: onContinue)
        }
        .padding(16)
    }

    private var header: some View {
        VStack(spacing: 4) {
            Text(LocalizedStringKey("bridge.title"))
                .font(.largeTitle.weight(.bold))
                .foregroundStyle(.white)
            Text(LocalizedStringKey("bridge.question"))
                .font(.subheadline)
                .foregroundStyle(.white.opacity(0.85))
            Text(LocalizedStringKey("bridge.instruction"))
                .font(.caption)
                .foregroundStyle(.white.opacity(0.75))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
        }
        .padding(.top, 16)
    }
}
