import SwiftUI

/// The reusable room screen (spec section 6 / section 11 item 8) — one component,
/// reused for Hall, Living Room, Study, Kids' Room, Kitchen and Needs Room, parameterized
/// by RoomConfig. "One speaks, one listens" rooms use the full-screen turn flip;
/// "discussion allowed" rooms show both partners' controls side by side instead.
struct RoomView: View {
    @ObservedObject var vm: SessionViewModel
    let config: RoomConfig

    private var isSequential: Bool { config.modes.contains(.speaks) }
    private var decks: [Deck] { config.deckIDs.map { DeckData.deck($0) } }

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: config.backgroundImageName)
            Color.black.opacity(0.18).ignoresSafeArea()

            if isSequential, let handoff = vm.pendingHandoff {
                HandoffView(
                    fromName: vm.session.name(for: handoff.from),
                    fromColor: vm.session.color(for: handoff.from),
                    toName: vm.session.name(for: handoff.to),
                    cards: handoff.cards,
                    onContinue: { vm.confirmHandoff() }
                )
            } else if isSequential {
                ActivePartnerContainer(
                    activePartner: vm.activePartner,
                    partnerName: { vm.session.name(for: $0) },
                    partnerColor: { vm.session.color(for: $0) }
                ) {
                    turnContent(for: vm.activePartner)
                }
            } else {
                discussionContent
            }
        }
    }

    // MARK: - Sequential (one speaks, one listens)

    @ViewBuilder
    private func turnContent(for role: PartnerRole) -> some View {
        VStack(spacing: 0) {
            header(activeRole: role)
            Spacer(minLength: 8)
            PlacedCardsOverlay(plays: vm.placedCardsThisTurn)
                .padding(.horizontal, 16)
            TimerBanner(
                secondsRemaining: vm.roomTimeRemainingSeconds,
                timeUpBannerShown: vm.timeUpBannerShown,
                onMoreTime: { vm.addMoreTime() },
                onDone: { vm.markRoomDone(role) }
            )
            .padding(.horizontal, 16)
            .padding(.top, 8)

            CardGridView(
                decks: decks,
                color: vm.session.color(for: role),
                onSelect: { deck, card in vm.playCard(card, deckID: deck.id) },
                onCustom: { deck, text in vm.playCard(.writeYourOwn(), deckID: deck.id, customText: text) }
            )
            .frame(maxHeight: 340)

            doneRow(role: role)
        }
    }

    // MARK: - Discussion (both partners visible at once)

    private var discussionContent: some View {
        VStack(spacing: 0) {
            header(activeRole: nil)
            Spacer(minLength: 8)
            PlacedCardsOverlay(plays: vm.placedCardsThisTurn)
                .padding(.horizontal, 16)
            TimerBanner(
                secondsRemaining: vm.roomTimeRemainingSeconds,
                timeUpBannerShown: vm.timeUpBannerShown,
                onMoreTime: { vm.addMoreTime() },
                onDone: { vm.markRoomDone(vm.activePartner) }
            )
            .padding(.horizontal, 16)
            .padding(.top, 8)

            CardGridView(
                decks: decks,
                color: vm.session.color(for: vm.activePartner),
                onSelect: { deck, card in vm.playCard(card, deckID: deck.id) },
                onCustom: { deck, text in vm.playCard(.writeYourOwn(), deckID: deck.id, customText: text) }
            )
            .frame(maxHeight: 300)

            HStack(spacing: 12) {
                discussionDoneButton(role: .partnerA, color: .purple)
                discussionDoneButton(role: .partnerB, color: .green)
            }
            .padding(16)
        }
    }

    @ViewBuilder
    private func discussionDoneButton(role: PartnerRole, color: PartnerColor) -> some View {
        let done = vm.roomDoneFlags[role] == true
        Button {
            vm.activePartner = role
        } label: {
            HStack {
                Circle().fill(color.color).frame(width: 8, height: 8)
                Text(vm.session.name(for: role)).font(.caption.weight(.semibold))
                if vm.activePartner == role {
                    Image(systemName: "hand.point.up.left.fill").font(.caption2)
                }
            }
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())

        Button {
            vm.markRoomDone(role)
        } label: {
            Text(L("room.done"))
                .font(.caption.weight(.semibold))
                .foregroundStyle(done ? .secondary : .white)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
        }
        .background(done ? Color.white.opacity(0.3) : color.color, in: Capsule())
        .disabled(done)
    }

    // MARK: - Shared header

    @ViewBuilder
    private func header(activeRole: PartnerRole?) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                if let activeRole {
                    Text(vm.session.name(for: activeRole))
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(vm.session.color(for: activeRole).color)
                }
                Spacer()
                ForEach(config.modes, id: \.self) { mode in
                    Image(systemName: mode.iconSystemName)
                        .font(.caption)
                }
            }
            Text(L(config.nameKey))
                .font(.bridgeSerifTitle(32, weight: .bold))
            Text(L(config.questionKey))
                .font(.title3)
                .foregroundStyle(.secondary)
            if let forbiddenKey = config.forbiddenKey {
                HStack(alignment: .top, spacing: 4) {
                    Text(L("room.forbidden_prefix")).font(.caption.weight(.bold))
                    Text(L(forbiddenKey)).font(.caption)
                }
                .foregroundStyle(.red.opacity(0.85))
            }
        }
        .padding(16)
        .background(.ultraThinMaterial)
    }

    @ViewBuilder
    private func doneRow(role: PartnerRole) -> some View {
        HStack {
            Button { vm.flagAgreementBroken() } label: {
                Image(systemName: "flag")
                    .padding(10)
                    .background(.ultraThinMaterial, in: Circle())
            }
            Spacer()
            Button { vm.markRoomDone(role) } label: {
                Text(L("room.done"))
                    .font(.headline)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
            }
            .background(vm.session.color(for: role).color, in: Capsule())
            .foregroundStyle(.white)
        }
        .padding(16)
    }
}
