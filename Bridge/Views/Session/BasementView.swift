import SwiftUI
import UIKit

/// Basement — Fears (spec section 6, room 6), two stages, neither of which loops back
/// into the other: (1) both partners voice whichever fears they choose from the list,
/// each tapping their own Done when finished; (2) a free, untimed-per-question window
/// for up to 15 verbal yes/no questions, ended the same way. The screen never physically
/// rotates here — both partners read and use it together, side by side.
struct BasementView: View {
    @ObservedObject var vm: SessionViewModel

    // Collapsed by default on short screens (SE-class phones) so the fully-expanded
    // instruction/why-it-helps/forbidden text doesn't push the Done row below the fold
    // before a first-time user realizes they can collapse it themselves.
    @State private var instructionsExpanded: Bool

    private let fearsDeck = DeckData.fears

    init(vm: SessionViewModel) {
        self.vm = vm
        _instructionsExpanded = State(initialValue: UIScreen.main.bounds.height >= 700)
    }

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "basement")
            Color.black.opacity(0.18).ignoresSafeArea()

            VStack(spacing: 0) {
                ReadTogetherCaption()
                header
                Spacer(minLength: 8)
                if vm.basementStage == .fears {
                    PlacedCardsOverlay(plays: vm.placedCardsThisTurn)
                        .padding(.horizontal, 16)
                    activePartnerSwitcher
                    CardGridView(
                        decks: [fearsDeck],
                        onSelect: { deck, card in
                            guard !card.isWriteYourOwn else { return }
                            vm.playCard(card, deckID: deck.id)
                        },
                        onCustom: { deck, text in
                            vm.playCard(.writeYourOwn(), deckID: deck.id, customText: text)
                        }
                    )
                } else {
                    Spacer(minLength: 12)
                    TimerBanner(
                        secondsRemaining: vm.roomTimeRemainingSeconds,
                        timeUpBannerShown: vm.timeUpBannerShown,
                        onMoreTime: { vm.addMoreTime() },
                        onDone: {}
                    )
                    .padding(.horizontal, 16)
                    Spacer(minLength: 12)
                }

                doneRow
            }
        }
    }

    /// Which of the two is currently "picking" a fear to voice — tapping a name switches
    /// whose turn it is before the next card gets tagged with `playCard`'s `playedBy`.
    private var activePartnerSwitcher: some View {
        HStack(spacing: 8) {
            ForEach([PartnerRole.partnerA, .partnerB], id: \.self) { role in
                Button {
                    vm.activePartner = role
                } label: {
                    HStack(spacing: 6) {
                        Circle().fill(vm.session.color(for: role).color).frame(width: 8, height: 8)
                        Text(vm.session.name(for: role)).font(.caption.weight(.semibold))
                        if vm.activePartner == role {
                            Image(systemName: "hand.point.up.left.fill").font(.caption2)
                        }
                    }
                    .foregroundStyle(Color.bridgeInk)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                }
                .background(vm.activePartner == role ? Color.bridgeGold : Color.bridgeIvory, in: Capsule())
                .overlay(Capsule().strokeBorder(Color.bridgeInk.opacity(0.2), lineWidth: 1))
                .buttonStyle(PressableButtonStyle())
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 6)
    }

    private var doneRow: some View {
        HStack(spacing: 12) {
            doneButton(role: .partnerA, color: .purple)
            doneButton(role: .partnerB, color: .green)
        }
        .padding(16)
    }

    @ViewBuilder
    private func doneButton(role: PartnerRole, color: PartnerColor) -> some View {
        let done = vm.roomDoneFlags[role] == true
        Button {
            if vm.basementStage == .fears {
                vm.markBasementFearsDone(role)
            } else {
                vm.markBasementQuestionsDone(role)
            }
        } label: {
            HStack {
                Circle().fill(vm.session.color(for: role).color).frame(width: 8, height: 8)
                Text(vm.session.name(for: role)).font(.caption.weight(.semibold))
                Spacer()
                Text(L("room.done"))
                    .font(.subheadline.weight(.bold))
            }
            .foregroundStyle(done ? AnyShapeStyle(.secondary) : AnyShapeStyle(Color.bridgeInk))
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
            .frame(maxWidth: .infinity)
        }
        .background(done ? Color.white.opacity(0.5) : Color.bridgeGold, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .strokeBorder(Color.bridgeInk.opacity(done ? 0.15 : 0.35), lineWidth: 1)
        )
        .disabled(done)
        .buttonStyle(PressableButtonStyle())
        .accessibilityIdentifier("uitest.basement.done.\(role.rawValue)")
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
                .font(.subheadline.weight(.bold))
                .foregroundStyle(Color.bridgeInk)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
            }
            .buttonStyle(PressableButtonStyle())
            .background(Color.bridgeGold)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .strokeBorder(Color.bridgeInk.opacity(0.3), lineWidth: 1)
            )
            .padding(.horizontal, 10)
            .padding(.top, 10)
            .accessibilityIdentifier("uitest.room.header.toggle")
        } else {
            VStack(alignment: .leading, spacing: 5) {
                // Bounded and independently scrollable — see the matching comment in
                // RoomView.header: without this, a short phone has no ScrollView anywhere
                // above it, so long instruction text can push the Done row off-screen with
                // no way to reach it at all.
                ScrollView {
                    VStack(alignment: .leading, spacing: 5) {
                        Text(L("room.basement.name"))
                            .font(.bridgeSerifTitle(21, weight: .bold))
                            .foregroundStyle(Color.bridgeInk)
                        Text(L("room.basement.question"))
                            .font(.bridgeSerifHeadline(14))
                            .foregroundStyle(Color.bridgeInk.opacity(0.7))

                        Text(vm.basementStage == .fears ? L("basement.instruction") : L("basement.questions_instruction"))
                            .font(.bridgeCaption.weight(.semibold))
                            .foregroundStyle(Color.bridgeInk)
                            .lineSpacing(2)
                            .fixedSize(horizontal: false, vertical: true)

                        if vm.basementStage == .fears {
                            Text(L("basement.why_it_helps"))
                                .font(.bridgeCaption.weight(.semibold).italic())
                                .foregroundStyle(Color.bridgeInk)
                                .lineSpacing(2)
                                .fixedSize(horizontal: false, vertical: true)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 5)
                                .background(Color.bridgeGold.opacity(0.35), in: RoundedRectangle(cornerRadius: 8, style: .continuous))

                            Text(L("room.basement.forbidden"))
                                .font(.bridgeCaption)
                                .foregroundStyle(Color.bridgeInk)
                                .lineSpacing(2)
                                .padding(.horizontal, 9)
                                .padding(.vertical, 5)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .fixedSize(horizontal: false, vertical: true)
                                .background(Color.bridgeGold.opacity(0.35), in: RoundedRectangle(cornerRadius: 10, style: .continuous))
                        }
                    }
                }
                .frame(maxHeight: UIScreen.main.bounds.height * 0.4)

                Button {
                    withAnimation(.easeInOut(duration: 0.2)) { instructionsExpanded = false }
                } label: {
                    HStack(spacing: 6) {
                        Image(systemName: "checkmark")
                        Text(L("room.read_it"))
                    }
                    .font(.subheadline.weight(.bold))
                    .foregroundStyle(Color.bridgeInk)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                }
                .buttonStyle(PressableButtonStyle())
                .background(Color.bridgeGold, in: RoundedRectangle(cornerRadius: 12, style: .continuous))
                .accessibilityIdentifier("uitest.room.header.toggle")
            }
            .padding(12)
            .background(Color.bridgeIvory)
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .strokeBorder(Color.bridgeGold.opacity(0.5), lineWidth: 1)
            )
            .padding(.horizontal, 10)
            .padding(.top, 10)
        }
    }
}
