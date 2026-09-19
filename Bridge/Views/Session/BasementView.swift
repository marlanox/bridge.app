import SwiftUI

/// Basement — Fears (spec section 6, room 6): a strict question/answer protocol rather
/// than the usual card grid. The asker picks a fear card; the screen flips to the
/// answerer, who responds with one of four fixed replies and may briefly explain.
struct BasementView: View {
    @ObservedObject var vm: SessionViewModel

    private let fearsDeck = DeckData.fears

    var body: some View {
        // The photo rotates together with the header/cards/buttons as one unit — see
        // RoomView's equivalent fix: a couple sitting across from each other must see a
        // single consistent room, not a right-side-up photo under upside-down text.
        ActivePartnerContainer(
            activePartner: vm.activePartner,
            partnerName: { vm.session.name(for: $0) },
            partnerColor: { vm.session.color(for: $0) }
        ) {
            ZStack {
                RoomBackgroundImage(imageName: "basement")
                Color.black.opacity(0.3).ignoresSafeArea()

                if let pending = vm.pendingBasementFearCardID {
                    answeringContent(fearCardID: pending)
                } else {
                    askingContent
                }
            }
        }
    }

    private var askingContent: some View {
        VStack(spacing: 0) {
            header
            askingInstructions
            TimerBanner(
                secondsRemaining: vm.roomTimeRemainingSeconds,
                timeUpBannerShown: vm.timeUpBannerShown,
                onMoreTime: { vm.addMoreTime() },
                onDone: { vm.markBasementDone(vm.activePartner) }
            )
            .padding(.horizontal, 16)
            .padding(.vertical, 8)

            CardGridView(
                decks: [fearsDeck],
                onSelect: { _, card in
                    guard vm.canCurrentAskerAsk, !card.isWriteYourOwn else { return }
                    vm.askBasementQuestion(fearCardID: card.id)
                },
                onCustom: { _, text in
                    // A custom fear gets its own one-off id; the actual words are carried
                    // separately since they don't live in the deck's localized text table.
                    let id = "fears_custom_\(UUID().uuidString.prefix(8))"
                    vm.askBasementQuestion(fearCardID: id, customText: text)
                }
            )

            HStack {
                Button { vm.markBasementDone(vm.activePartner) } label: {
                    Text(L("room.done"))
                        .font(.headline)
                        .padding(.horizontal, 24)
                        .padding(.vertical, 12)
                }
                .background(vm.session.color(for: vm.activePartner).color, in: Capsule())
                .foregroundStyle(.white)
                .buttonStyle(PressableButtonStyle())
            }
            .padding(16)
        }
    }

    @ViewBuilder
    private func answeringContent(fearCardID: String) -> some View {
        let answerer = vm.activePartner
        VStack(spacing: 20) {
            header
            Spacer()
            Text(vm.pendingBasementCustomText ?? fearText(for: fearCardID))
                .font(.bridgeSerifHeadline())
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)

            Text(L("basement.answer_instruction"))
                .font(.bridgeCaption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 30)

            VStack(spacing: 10) {
                responseButton(.yes, color: vm.session.color(for: answerer))
                responseButton(.no, color: vm.session.color(for: answerer))
                responseButton(.understand, color: vm.session.color(for: answerer))
            }
            .padding(.horizontal, 20)

            Spacer()
        }
    }

    @ViewBuilder
    private func responseButton(_ response: BasementResponse, color: PartnerColor) -> some View {
        Button {
            vm.submitBasementResponse(response, explanation: nil)
        } label: {
            Text(L("basement.response.\(response.rawValue)"))
                .font(.subheadline.weight(.medium))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .background(.ultraThinMaterial)
        .background(color.color.opacity(0.2))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .buttonStyle(PressableButtonStyle())
    }

    /// Kept compact — every line here costs a slice of the room's own interior, which
    /// should still read as a place, not just a form.
    private var header: some View {
        VStack(alignment: .leading, spacing: 5) {
            Text(L("room.basement.name"))
                .font(.bridgeSerifTitle(24, weight: .bold))
            Text(L("room.basement.question"))
                .font(.bridgeSerifHeadline(16))
                .foregroundStyle(.secondary)
            Text(L("basement.why_it_helps"))
                .font(.bridgeCaption.italic())
                .foregroundStyle(Color.bridgeGold)
                .fixedSize(horizontal: false, vertical: true)
            Text(L("room.basement.forbidden"))
                .font(.bridgeCaption)
                .foregroundStyle(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .frame(maxWidth: .infinity, alignment: .leading)
                .fixedSize(horizontal: false, vertical: true)
                .background(Color.bridgeInk, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
        }
        .padding(12)
        .background(.ultraThinMaterial)
    }

    /// Only relevant while picking a fear to ask — the answerer sees the fear itself and
    /// `basement.answer_instruction` instead, in `answeringContent`.
    private var askingInstructions: some View {
        Text(L("basement.instruction"))
            .font(.bridgeCaption)
            .foregroundStyle(.primary.opacity(0.9))
            .fixedSize(horizontal: false, vertical: true)
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(.ultraThinMaterial)
    }

    private func fearText(for id: String) -> String {
        if let card = fearsDeck.cards.first(where: { $0.id == id }) {
            return L(card.textKey)
        }
        return ""
    }
}
