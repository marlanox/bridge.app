import SwiftUI
import UIKit

/// Basement — Fears (spec section 6, room 6): a strict question/answer protocol rather
/// than the usual card grid. The asker picks a fear card; the screen flips to the
/// answerer, who responds with one of four fixed replies and may briefly explain.
struct BasementView: View {
    @ObservedObject var vm: SessionViewModel

    // Collapsed by default on short screens (SE-class phones) so the fully-expanded
    // instruction/why-it-helps/forbidden text doesn't push the Done button below the
    // fold before a first-time user realizes they can collapse it themselves.
    @State private var instructionsExpanded: Bool

    private let fearsDeck = DeckData.fears

    init(vm: SessionViewModel) {
        self.vm = vm
        _instructionsExpanded = State(initialValue: UIScreen.main.bounds.height >= 700)
    }

    var body: some View {
        GeometryReader { geo in
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

                    Group {
                        if let pending = vm.pendingBasementFearCardID {
                            answeringContent(fearCardID: pending)
                        } else {
                            askingContent
                        }
                    }
                    // Same fix as RoomView's turnContent: a 180° rotation swaps which
                    // physical edge is "top", so the safe area has to be applied manually,
                    // swapped, rather than left to the system's un-rotated default — and
                    // the edge that ends up physically on top needs extra clearance for
                    // the global nav bar, not just the notch (see roomChromeTopExtra).
                    .padding(.top, isRotated ? geo.safeAreaInsets.bottom : geo.safeAreaInsets.top)
                    .padding(.bottom, isRotated ? geo.safeAreaInsets.top + roomChromeTopExtra : geo.safeAreaInsets.bottom)
                    .padding(.leading, isRotated ? geo.safeAreaInsets.trailing : geo.safeAreaInsets.leading)
                    .padding(.trailing, isRotated ? geo.safeAreaInsets.leading : geo.safeAreaInsets.trailing)
                    .ignoresSafeArea()
                }
            }
        }
    }

    private var isRotated: Bool { vm.activePartner.seatRotationDegrees != 0 }

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

            // Done only ever finishes the room once BOTH partners have tapped it during
            // their own asking turn — turns only change hands after a full ask+answer
            // round, so without this note, a partner can tap Done, watch nothing
            // happen, and not understand why. Naming whose turn is pending instead of
            // just disabling the button keeps `room.done` an ordinary always-tappable
            // action rather than a new disabled/enabled state to explain.
            if let hint = turnHint {
                Text(hint)
                    .font(.bridgeCaption)
                    .foregroundStyle(.secondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }

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

    private var turnHint: String? {
        let me = vm.activePartner
        let other = me.other
        if vm.roomDoneFlags[me] == true {
            return LF("basement.you_marked_done", vm.session.name(for: other))
        }
        if vm.roomDoneFlags[other] == true {
            return LF("basement.partner_ready_to_finish", vm.session.name(for: other))
        }
        return nil
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
    /// should still read as a place, not just a form. Collapsed state is a single slim
    /// "Expand" bar (nothing else) and expanded state ends in an explicit "I've read it"
    /// button — no chevron toggle — so the control is always in the same place with an
    /// unambiguous label, matching RoomView's header.
    @ViewBuilder
    private var header: some View {
        if !instructionsExpanded {
            Button {
                withAnimation(.easeInOut(duration: 0.2)) { instructionsExpanded = true }
            } label: {
                HStack(spacing: 6) {
                    Image(systemName: "chevron.down")
                    Text(L("room.expand"))
                }
                .font(.subheadline.weight(.semibold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
            }
            .buttonStyle(PressableButtonStyle())
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .padding(.horizontal, 10)
            .padding(.top, 10)
            .accessibilityIdentifier("uitest.room.header.toggle")
        } else {
            VStack(alignment: .leading, spacing: 5) {
                Text(L("room.basement.name"))
                    .font(.bridgeSerifTitle(24, weight: .bold))
                Text(L("room.basement.question"))
                    .font(.bridgeSerifHeadline(16))
                    .foregroundStyle(.secondary)

                Text(L("basement.why_it_helps"))
                    .font(.bridgeCaption.weight(.semibold).italic())
                    .foregroundStyle(Color.bridgeGold)
                    .lineSpacing(3)
                    .fixedSize(horizontal: false, vertical: true)
                    .padding(.horizontal, 9)
                    .padding(.vertical, 6)
                    .background(Color.bridgeInk, in: RoundedRectangle(cornerRadius: 8, style: .continuous))

                Text(L("room.basement.forbidden"))
                    .font(.bridgeCaption)
                    .foregroundStyle(.white)
                    .lineSpacing(3)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .fixedSize(horizontal: false, vertical: true)
                    .background(Color.bridgeInk, in: RoundedRectangle(cornerRadius: 10, style: .continuous))

                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { instructionsExpanded = false }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "checkmark")
                        Text(L("room.read_it"))
                    }
                    .font(.subheadline.weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                }
                .buttonStyle(PressableButtonStyle())
                .background(Color.bridgeGold.opacity(0.2), in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                .accessibilityIdentifier("uitest.room.header.toggle")
            }
            .padding(12)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .padding(.horizontal, 10)
            .padding(.top, 10)
        }
    }

    /// Only relevant while picking a fear to ask — the answerer sees the fear itself and
    /// `basement.answer_instruction` instead, in `answeringContent`. Folds under the same
    /// header toggle since it's the second slab of text crowding out the room's interior.
    @ViewBuilder
    private var askingInstructions: some View {
        if instructionsExpanded {
            Text(L("basement.instruction"))
                .font(.bridgeCaption)
                .foregroundStyle(.primary.opacity(0.9))
                .lineSpacing(3)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(.ultraThinMaterial)
        }
    }

    private func fearText(for id: String) -> String {
        if let card = fearsDeck.cards.first(where: { $0.id == id }) {
            return L(card.textKey)
        }
        return ""
    }
}
