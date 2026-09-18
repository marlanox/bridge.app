import SwiftUI

/// Basement — Fears (spec section 6, room 6): a strict question/answer protocol rather
/// than the usual card grid. The asker picks a fear card; the screen flips to the
/// answerer, who responds with one of four fixed replies and may briefly explain.
struct BasementView: View {
    @ObservedObject var vm: SessionViewModel

    private let fearsDeck = DeckData.fears

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "basement")
            Color.black.opacity(0.3).ignoresSafeArea()

            ActivePartnerContainer(
                activePartner: vm.activePartner,
                partnerName: { vm.session.name(for: $0) },
                partnerColor: { vm.session.color(for: $0) }
            ) {
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
            Text(L("basement.pick_a_fear_card"))
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .padding(.top, 8)
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
                color: vm.session.color(for: vm.activePartner),
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
                .font(.title2.weight(.medium))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)

            Text(L("basement.instruction"))
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 30)

            VStack(spacing: 10) {
                responseButton(.yes, color: vm.session.color(for: answerer))
                responseButton(.no, color: vm.session.color(for: answerer))
                responseButton(.partially, color: vm.session.color(for: answerer))
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
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(L("room.basement.name"))
                .font(.bridgeSerifTitle(32, weight: .bold))
            Text(L("room.basement.question"))
                .font(.title3)
                .foregroundStyle(.secondary)
            Text(L("room.basement.forbidden"))
                .font(.caption)
                .foregroundStyle(.red.opacity(0.85))
            Text(String(format: L("basement.questions_remaining"), max(15 - (vm.basementQuestionsAsked[vm.basementCurrentAsker] ?? 0), 0)))
                .font(.caption.weight(.semibold))
        }
        .padding(16)
        .background(.ultraThinMaterial)
    }

    private func fearText(for id: String) -> String {
        if let card = fearsDeck.cards.first(where: { $0.id == id }) {
            return L(card.textKey)
        }
        return ""
    }
}
