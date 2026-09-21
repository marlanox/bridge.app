import SwiftUI
import UIKit

/// The reusable room screen (spec section 6 / section 11 item 8) — one component,
/// reused for Hall, Living Room, Study, Kids' Room, Kitchen and Needs Room, parameterized
/// by RoomConfig. "One speaks, one listens" rooms use the full-screen turn flip;
/// "discussion allowed" rooms show both partners' controls side by side instead.
struct RoomView: View {
    @ObservedObject var vm: SessionViewModel
    let config: RoomConfig

    // Collapsed by default on short screens (SE-class phones) so the fully-expanded
    // instruction/why-it-helps/forbidden text doesn't push the Done button below the
    // fold before a first-time user realizes they can collapse it themselves.
    @State private var instructionsExpanded: Bool

    init(vm: SessionViewModel, config: RoomConfig) {
        self.vm = vm
        self.config = config
        _instructionsExpanded = State(initialValue: UIScreen.main.bounds.height >= 700)
    }

    private var isSequential: Bool { config.modes.contains(.speaks) }
    private var decks: [Deck] { config.deckIDs.map { DeckData.deck($0) } }

    var body: some View {
        GeometryReader { geo in
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
                            turnContent(for: vm.activePartner, safeArea: geo.safeAreaInsets)
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
        }
        .animation(.spring(response: 0.45, dampingFraction: 0.8), value: vm.pendingReveal == nil)
        // A new person taking their turn must see the full instructions, not whatever
        // collapsed state the previous partner happened to leave it in.
        .onChange(of: vm.activePartner) { _, _ in instructionsExpanded = true }
    }

    // MARK: - Sequential (one speaks, one listens)

    /// A 180° rotation swaps which physical edge is "top" — laying this out with the
    /// system's normal (top=notch, bottom=home-indicator) safe area, then rotating the
    /// whole thing, would land the Done row under the notch and the header over the home
    /// indicator instead. Ignoring the safe area here and swapping the padding manually
    /// for the rotated partner keeps the bigger notch-side clearance physically at the top.
    @ViewBuilder
    private func turnContent(for role: PartnerRole, safeArea: EdgeInsets) -> some View {
        let rotated = role.seatRotationDegrees != 0
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
                onCustom: { deck, text in vm.playCard(.writeYourOwn(), deckID: deck.id, customText: text) },
                activePartnerRotation: role.seatRotationDegrees
            )

            doneRow(role: role)
        }
        .padding(.top, rotated ? safeArea.bottom : safeArea.top)
        .padding(.bottom, rotated ? safeArea.top + roomChromeTopExtra : safeArea.bottom)
        .padding(.leading, rotated ? safeArea.trailing : safeArea.leading)
        .padding(.trailing, rotated ? safeArea.leading : safeArea.trailing)
        .ignoresSafeArea()
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

    // Kept compact — every line here costs a slice of the room's own interior, which
    // should still read as a place, not just a form. Collapsed state is a single slim
    // "Expand" bar (nothing else) and expanded state ends in an explicit "I've read it"
    // button — no chevron toggle — so the control is always in the same place with an
    // unambiguous label, per explicit request.
    @ViewBuilder
    private func header(activeRole: PartnerRole?) -> some View {
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
                // Bounded and independently scrollable — on a short phone, the full
                // instruction/why-it-helps/forbidden text can otherwise exceed the whole
                // screen's height with no ScrollView anywhere above it, pushing the Done
                // button (and everything else below the header) permanently off-screen
                // with no way to reach it at all.
                ScrollView {
                    VStack(alignment: .leading, spacing: 5) {
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
                            .font(.bridgeSerifTitle(21, weight: .bold))
                        Text(L(config.questionKey))
                            .font(.bridgeSerifHeadline(14))
                            .foregroundStyle(.secondary)

                        Label {
                            Text(L(modeCaptionKey))
                                .font(.bridgeCaption.weight(.bold))
                        } icon: {
                            Image(systemName: config.modes.contains(.discussion) ? "bubble.left.and.bubble.right.fill" : "mic.fill")
                        }
                        .foregroundStyle(Color.bridgeInk)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color.bridgeGold, in: RoundedRectangle(cornerRadius: 8, style: .continuous))

                        Text(L(config.instructionKey))
                            .font(.bridgeCaption)
                            .foregroundStyle(.primary.opacity(0.9))
                            .lineSpacing(2)
                            .fixedSize(horizontal: false, vertical: true)

                        Text(L(config.whyItHelpsKey))
                            .font(.bridgeCaption.weight(.semibold).italic())
                            .foregroundStyle(Color.bridgeInk)
                            .lineSpacing(2)
                            .fixedSize(horizontal: false, vertical: true)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 5)
                            .background(Color.bridgeGold, in: RoundedRectangle(cornerRadius: 8, style: .continuous))

                        if let forbiddenKey = config.forbiddenKey {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(L("room.forbidden_prefix"))
                                    .font(.bridgeCaption.weight(.bold))
                                Text(L(forbiddenKey))
                                    .font(.bridgeCaption)
                                    .lineSpacing(2)
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                            .foregroundStyle(Color.bridgeInk)
                            .padding(.horizontal, 9)
                            .padding(.vertical, 5)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .background(Color.bridgeGold, in: RoundedRectangle(cornerRadius: 10, style: .continuous))
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
                    .foregroundStyle(Color.bridgeInk)
                    .font(.subheadline.weight(.bold))
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

    @ViewBuilder
    private func doneRow(role: PartnerRole) -> some View {
        HStack {
            Button { vm.flagAgreementBroken() } label: {
                HStack(spacing: 6) {
                    Image(systemName: "flag.fill")
                    Text(L("room.flag_broken"))
                        .font(.caption.weight(.semibold))
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 10)
                .background(.ultraThinMaterial, in: Capsule())
            }
            .buttonStyle(PressableButtonStyle())
            Spacer()
            Button { vm.markRoomDone(role) } label: {
                Text(L("room.done"))
                    .font(.headline)
                    .padding(.horizontal, 24)
                    .padding(.vertical, 12)
            }
            .background(vm.placedCardsThisTurn.isEmpty ? AnyShapeStyle(Color.gray.opacity(0.55)) : AnyShapeStyle(vm.session.color(for: role).color), in: Capsule())
            .foregroundStyle(.white)
            .buttonStyle(PressableButtonStyle())
            .disabled(vm.placedCardsThisTurn.isEmpty)
            .accessibilityIdentifier("uitest.room.done")
        }
        .padding(16)
    }
}
