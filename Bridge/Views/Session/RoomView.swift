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
            // The room interior always renders for the current `activePartner` and never
            // rotates while someone is only reading — see RevealCardOverlay's doc comment.
            // The photo rotates together with the header/cards/buttons as one unit — a
            // couple sitting across from each other must see a single consistent room,
            // not a right-side-up photo under upside-down text.
            if isSequential {
                ActivePartnerContainer(
                    activePartner: vm.activePartner,
                    partnerName: { vm.session.name(for: $0) },
                    partnerColor: { vm.session.color(for: $0) }
                ) {
                    ZStack {
                        RoomBackgroundImage(imageName: config.backgroundImageName)
                        Color.black.opacity(0.18).ignoresSafeArea()
                        turnContent(for: vm.activePartner)
                    }
                }
            } else {
                ZStack {
                    RoomBackgroundImage(imageName: config.backgroundImageName)
                    Color.black.opacity(0.18).ignoresSafeArea()
                    discussionContent
                }
            }

            if let reveal = vm.pendingReveal {
                RevealCardOverlay(
                    fromName: vm.session.name(for: reveal.from),
                    fromColor: vm.session.color(for: reveal.from),
                    toRole: reveal.to,
                    cards: reveal.cards,
                    onRead: { vm.confirmReveal() }
                )
            }
        }
        .animation(.spring(response: 0.45, dampingFraction: 0.8), value: vm.pendingReveal == nil)
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
                onSelect: { deck, card in vm.playCard(card, deckID: deck.id) },
                onCustom: { deck, text in vm.playCard(.writeYourOwn(), deckID: deck.id, customText: text) }
            )

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

            if !decks.isEmpty {
                CardGridView(
                    decks: decks,
                    onSelect: { deck, card in vm.playCard(card, deckID: deck.id) },
                    onCustom: { deck, text in vm.playCard(.writeYourOwn(), deckID: deck.id, customText: text) }
                )
            } else {
                Spacer(minLength: 24)
            }

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
        .buttonStyle(PressableButtonStyle())
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial, in: Capsule())

        Button {
            vm.markRoomDone(role)
        } label: {
            Text(L("room.done"))
                .font(.caption.weight(.semibold))
                .foregroundStyle(done ? AnyShapeStyle(.secondary) : AnyShapeStyle(Color.white))
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
        }
        .background(done ? Color.white.opacity(0.3) : color.color, in: Capsule())
        .disabled(done)
        .buttonStyle(PressableButtonStyle())
        .accessibilityIdentifier("uitest.room.done.\(role.rawValue)")
    }

    // MARK: - Shared header

    /// One unambiguous line naming who may speak — the mode icons alone (mic + ear both
    /// showing on a "one speaks, one listens" room) read as a contradiction on their own.
    private var modeCaptionKey: String {
        config.modes.contains(.discussion) ? "room.mode_caption.discussion" : "room.mode_caption.sequential"
    }

    @ViewBuilder
    private func header(activeRole: PartnerRole?) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                if let activeRole {
                    Text(vm.session.name(for: activeRole))
                        .font(.bridgeCaption)
                        .foregroundStyle(vm.session.color(for: activeRole).color)
                }
                Spacer()
                ForEach(config.modes, id: \.self) { mode in
                    Image(systemName: mode.iconSystemName)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            Text(L(config.nameKey))
                .font(.bridgeSerifTitle(30, weight: .bold))
            Text(L(config.questionKey))
                .font(.bridgeSerifHeadline(19))
                .foregroundStyle(.secondary)

            Label {
                Text(L(modeCaptionKey))
                    .font(.bridgeBody.weight(.bold))
            } icon: {
                Image(systemName: config.modes.contains(.discussion) ? "bubble.left.and.bubble.right.fill" : "mic.fill")
            }
            .foregroundStyle(Color.bridgeGold)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color.bridgeInk, in: RoundedRectangle(cornerRadius: 8, style: .continuous))

            Text(L(config.instructionKey))
                .font(.bridgeBody)
                .foregroundStyle(.primary.opacity(0.9))
                .fixedSize(horizontal: false, vertical: true)

            if let forbiddenKey = config.forbiddenKey {
                VStack(alignment: .leading, spacing: 2) {
                    Text(L("room.forbidden_prefix"))
                        .font(.bridgeCaption.weight(.bold))
                    Text(L(forbiddenKey))
                        .font(.bridgeCaption)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .foregroundStyle(.white)
                .padding(.horizontal, 10)
                .padding(.vertical, 8)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.bridgeInk, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
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
            .buttonStyle(PressableButtonStyle())
            Spacer()
            Button { vm.markRoomDone(role) } label: {
                Text(L("room.done"))
                    .font(.headline)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
            }
            .background(vm.session.color(for: role).color, in: Capsule())
            .foregroundStyle(.white)
            .buttonStyle(PressableButtonStyle())
            .accessibilityIdentifier("uitest.room.done")
        }
        .padding(16)
    }
}
