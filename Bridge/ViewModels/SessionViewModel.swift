import Foundation
import Combine

/// Everything needed to resume a walk exactly where a couple left it — saved to disk
/// whenever meaningful state changes so backgrounding, force-quitting, or just closing the
/// app for the evening never loses progress. Deliberately excludes transient in-flight UI
/// state (`pendingReveal`, an in-progress Basement question, the exact seconds left on the
/// room timer) — those are safe to drop on resume; the room's own timer restarts fresh and,
/// worst case, a partner taps "Done" one more time.
struct SessionSnapshot: Codable {
    var flow: AppFlowStep
    var session: GameSession
    var comprehensionConfirmed: [PartnerRole: Bool]
    var couplesAgreement: [String]
    var roomDoneFlags: [PartnerRole: Bool]
    var activePartner: PartnerRole
    var placedCardsThisTurn: [CardPlay]
    var basementQuestionsAsked: [PartnerRole: Int]
    var basementCurrentAsker: PartnerRole
    var voiceNoteSkipped: [PartnerRole: Bool]
}

/// Drives one full walk through the house: flow position, whose turn is active,
/// the room timer, cards played, the Basement Q&A protocol, and the Bridge finale.
final class SessionViewModel: ObservableObject {
    @Published var flow: AppFlowStep = .welcome
    @Published var session: GameSession
    @Published var activePartner: PartnerRole = .partnerA

    // Onboarding gates
    @Published var comprehensionConfirmed: [PartnerRole: Bool] = [.partnerA: false, .partnerB: false]
    @Published var couplesAgreement: [String]

    // Room runtime state
    @Published var roomTimeRemainingSeconds: Int = 0
    @Published var roomDoneFlags: [PartnerRole: Bool] = [.partnerA: false, .partnerB: false]
    @Published var timerFired: Bool = false
    @Published var timeUpBannerShown: Bool = false
    @Published var placedCardsThisTurn: [CardPlay] = []

    /// Set the instant a partner finishes answering in a sequential room. The room itself
    /// keeps facing `from` — it does NOT rotate yet — while a reveal card, rotated to
    /// face `to`, shows exactly what `from` shared. Only once `to` taps "I've read it"
    /// (`confirmReveal()`) does the room actually flip (or, if both partners have now
    /// answered, the room ends and the walk advances). This fires after *every* answer,
    /// first and second alike — see `confirmReveal()` for how it tells the two apart.
    @Published var pendingReveal: (from: PartnerRole, to: PartnerRole, cards: [CardPlay])?

    // Basement runtime state
    @Published var basementQuestionsAsked: [PartnerRole: Int] = [.partnerA: 0, .partnerB: 0]
    @Published var basementCurrentAsker: PartnerRole = .partnerA
    @Published var pendingBasementFearCardID: String?
    @Published var pendingBasementCustomText: String?

    // Voice snapshot
    @Published var voiceNoteSkipped: [PartnerRole: Bool] = [.partnerA: false, .partnerB: false]

    private let ticker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    let originalProfile: RelationshipProfile

    /// A snapshot of everything worth resuming, taken as-is right now (see `SessionSnapshot`).
    func makeSnapshot() -> SessionSnapshot {
        SessionSnapshot(
            flow: flow,
            session: session,
            comprehensionConfirmed: comprehensionConfirmed,
            couplesAgreement: couplesAgreement,
            roomDoneFlags: roomDoneFlags,
            activePartner: activePartner,
            placedCardsThisTurn: placedCardsThisTurn,
            basementQuestionsAsked: basementQuestionsAsked,
            basementCurrentAsker: basementCurrentAsker,
            voiceNoteSkipped: voiceNoteSkipped
        )
    }

    /// Restores a previously-saved walk. Only ever called right after `init`, before any UI
    /// has observed this view model, so directly overwriting the fresh defaults is safe.
    func restore(from snapshot: SessionSnapshot) {
        flow = snapshot.flow
        session = snapshot.session
        comprehensionConfirmed = snapshot.comprehensionConfirmed
        couplesAgreement = snapshot.couplesAgreement
        roomDoneFlags = snapshot.roomDoneFlags
        activePartner = snapshot.activePartner
        placedCardsThisTurn = snapshot.placedCardsThisTurn
        basementQuestionsAsked = snapshot.basementQuestionsAsked
        basementCurrentAsker = snapshot.basementCurrentAsker
        voiceNoteSkipped = snapshot.voiceNoteSkipped
        roomTimeRemainingSeconds = (currentRoomConfig()?.timeMinutes ?? 7) * 60
    }

    init(profile: RelationshipProfile) {
        self.originalProfile = profile
        self.couplesAgreement = profile.couplesAgreement
        self.session = GameSession(
            partnerA: PartnerInfo(name: profile.partnerAName, color: .purple),
            partnerB: PartnerInfo(name: profile.partnerBName, color: .green)
        )
    }

    // MARK: - Onboarding

    func setNames(partnerA: String, partnerB: String) {
        session.partnerA.name = partnerA
        session.partnerB.name = partnerB
    }

    func confirmComprehension(_ role: PartnerRole) {
        comprehensionConfirmed[role] = true
    }

    var bothConfirmedComprehension: Bool {
        comprehensionConfirmed[.partnerA] == true && comprehensionConfirmed[.partnerB] == true
    }

    func addAgreementRule(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        couplesAgreement.append(trimmed)
    }

    func removeAgreementRule(at offsets: IndexSet) {
        couplesAgreement.remove(atOffsets: offsets)
    }

    // MARK: - Dice / intensity / calm-down / oath / ritual

    @discardableResult
    func rollDice() -> PartnerRole {
        let result: PartnerRole = Bool.random() ? .partnerA : .partnerB
        session.firstToSpeak = result
        return result
    }

    func setIntensity(_ value: Int, for role: PartnerRole) {
        if role == .partnerA { session.intensityA = value } else { session.intensityB = value }
    }

    /// A partner can hold more than one of the seven feelings at once — toggling one on/off
    /// leaves the rest of their selection untouched.
    func toggleState(_ state: EmotionalState, for role: PartnerRole) {
        if role == .partnerA {
            if session.stateA.states.contains(state) { session.stateA.states.remove(state) }
            else { session.stateA.states.insert(state) }
        } else {
            if session.stateB.states.contains(state) { session.stateB.states.remove(state) }
            else { session.stateB.states.insert(state) }
        }
    }

    func setCustomStateText(_ text: String, for role: PartnerRole) {
        if role == .partnerA { session.stateA.customText = text } else { session.stateB.customText = text }
    }

    /// A high intensity from either partner triggers the calm-down suggestion by default
    /// (spec section 5); 7/10 is this build's threshold for "high."
    var needsCalmDown: Bool { session.highestIntensity >= 7 }

    func completeOath() {
        TokenManager.awardOath(session: &session)
    }

    func completeRitual() {
        TokenManager.awardRitual(session: &session)
    }

    // MARK: - Flow advancement

    func advance() {
        switch flow {
        case .welcome:
            // Spec section 3: onboarding is "mandatory, first launch only." Returning
            // couples already have names and a couple's agreement on file, so repeat
            // sessions skip straight past the explanatory pages to the dice roll.
            flow = originalProfile.hasCompletedFirstSession ? .dice : .howItWorksWhatIsBridge
        case .howItWorksWhatIsBridge:
            flow = .howItWorksApology
        case .howItWorksApology:
            flow = .disclaimer
        case .disclaimer:
            flow = .houseMap
        case .houseMap:
            flow = .names
        case .names:
            flow = .comprehensionAgreement
        case .comprehensionAgreement:
            flow = .couplesAgreementSetup
        case .couplesAgreementSetup:
            flow = .dice
        case .dice:
            flow = .intensityState
        case .intensityState:
            flow = needsCalmDown ? .calmDown : .oath
        case .calmDown:
            flow = .oath
        case .oath:
            flow = .ritual
        case .ritual:
            flow = .room(.hall)
            startRoom(.hall)
        case .room(let kind):
            if kind == .kitchen {
                flow = .basement
                startBasement()
            } else if let next = kind.next {
                flow = .room(next)
                startRoom(next)
            }
        case .basement:
            // No separate Needs Room or Garden — straight to the Bridge finale, where
            // Needs & Connection, Step Toward and Gift cards are all chosen together.
            flow = .bridgeFinale
        case .bridgeFinale:
            TokenManager.awardBridgeFinale(session: &session)
            flow = .voiceSnapshot
        case .voiceSnapshot:
            flow = .closing
        case .closing:
            break
        }
    }

    // MARK: - Universal room

    private func currentRoomConfig() -> RoomConfig? {
        RoomConfig.all[session.currentRoom]
    }

    /// Hall, Living Room, Study and Kids' Room are "one speaks, one listens": each
    /// partner gets their own timed turn as speaker before the room can advance.
    private var isSequentialSpeakingRoom: Bool {
        currentRoomConfig()?.modes.contains(.speaks) ?? false
    }

    func startRoom(_ kind: RoomKind) {
        FeedbackSounds.roomTransition()
        session.currentRoom = kind
        let config = RoomConfig.all[kind]
        roomDoneFlags = [.partnerA: false, .partnerB: false]
        placedCardsThisTurn = []
        pendingReveal = nil
        timerFired = false
        timeUpBannerShown = false

        if config?.modes.contains(.speaks) == true {
            let first = session.firstToSpeak ?? .partnerA
            activePartner = (kind.rawValue % 2 == 1) ? first : first.other
        } else {
            activePartner = session.firstToSpeak ?? .partnerA
        }
        roomTimeRemainingSeconds = (config?.timeMinutes ?? 7) * 60
    }

    func playCard(_ card: Card, deckID: String, customText: String? = nil) {
        let play = CardPlay(
            room: session.currentRoom,
            deckID: deckID,
            cardID: card.id,
            customText: customText,
            playedBy: activePartner
        )
        session.cardsPlayed.append(play)
        placedCardsThisTurn.append(play)
        FeedbackSounds.cardPlaced()
    }

    /// Called when `role` taps "Done" in the current room. In a sequential room this
    /// never flips the room directly — it always raises the reveal card first (for both
    /// the first and the second answer alike); `confirmReveal()` decides what happens next.
    func markRoomDone(_ role: PartnerRole) {
        if isSequentialSpeakingRoom {
            guard role == activePartner else { return }
            roomDoneFlags[role] = true
            pendingReveal = (from: role, to: role.other, cards: placedCardsThisTurn)
        } else {
            roomDoneFlags[role] = true
            if roomDoneFlags[.partnerA] == true && roomDoneFlags[.partnerB] == true {
                TokenManager.awardRoomCompleted(session: &session)
                advance()
            }
        }
    }

    /// The reader taps "I've read it" after reading the reveal card. If the other
    /// partner (the one who just shared) had *already* answered before this exchange —
    /// i.e. both partners' done-flags are now set — the room is finished and the walk
    /// advances. Otherwise it's now the reader's turn: the room flips to face them.
    func confirmReveal() {
        guard let reveal = pendingReveal else { return }
        pendingReveal = nil
        if roomDoneFlags[reveal.from] == true && roomDoneFlags[reveal.to] == true {
            TokenManager.awardRoomCompleted(session: &session)
            advance()
        } else {
            activePartner = reveal.to
            placedCardsThisTurn = []
            roomTimeRemainingSeconds = (currentRoomConfig()?.timeMinutes ?? 7) * 60
            timerFired = false
            timeUpBannerShown = false
        }
    }

    func addMoreTime() {
        roomTimeRemainingSeconds += 120
        timeUpBannerShown = false
    }

    func flagAgreementBroken() {
        TokenManager.flagAgreementBroken(session: &session)
    }

    // MARK: - Basement

    func startBasement() {
        FeedbackSounds.roomTransition()
        session.currentRoom = .basement
        roomDoneFlags = [.partnerA: false, .partnerB: false]
        basementQuestionsAsked = [.partnerA: 0, .partnerB: 0]
        basementCurrentAsker = session.firstToSpeak ?? .partnerA
        activePartner = basementCurrentAsker
        pendingBasementFearCardID = nil
        timerFired = false
        timeUpBannerShown = false
        roomTimeRemainingSeconds = 10 * 60
    }

    var canCurrentAskerAsk: Bool {
        (basementQuestionsAsked[basementCurrentAsker] ?? 0) < 15 && pendingBasementFearCardID == nil
    }

    func askBasementQuestion(fearCardID: String, customText: String? = nil) {
        guard canCurrentAskerAsk else { return }
        pendingBasementFearCardID = fearCardID
        pendingBasementCustomText = customText
        activePartner = basementCurrentAsker.other
    }

    func submitBasementResponse(_ response: BasementResponse, explanation: String?) {
        guard let fearCardID = pendingBasementFearCardID else { return }
        basementQuestionsAsked[basementCurrentAsker, default: 0] += 1
        session.basementExchanges.append(
            BasementExchange(
                askedBy: basementCurrentAsker,
                fearCardID: fearCardID,
                customFearText: pendingBasementCustomText,
                response: response,
                explanation: explanation
            )
        )
        pendingBasementFearCardID = nil
        pendingBasementCustomText = nil
        basementCurrentAsker = basementCurrentAsker.other
        activePartner = basementCurrentAsker
    }

    func markBasementDone(_ role: PartnerRole) {
        roomDoneFlags[role] = true
        if roomDoneFlags[.partnerA] == true && roomDoneFlags[.partnerB] == true {
            TokenManager.awardBasementProtocolFollowed(session: &session)
            advance()
        }
    }

    // MARK: - Bridge finale

    enum BridgeCardKind: Hashable {
        case stepToward, need, gift
    }

    func selectBridgeCard(_ cardID: String, kind: BridgeCardKind, for role: PartnerRole) {
        var selection = session.bridgeFinal[role] ?? BridgeFinalSelection()
        switch kind {
        case .stepToward: selection.stepTowardCardID = cardID
        case .need: selection.needCardID = cardID
        case .gift: selection.giftCardID = cardID
        }
        session.bridgeFinal[role] = selection
    }

    func completeMandatoryCard(for role: PartnerRole) {
        var selection = session.bridgeFinal[role] ?? BridgeFinalSelection()
        selection.completedMandatoryCard = true
        session.bridgeFinal[role] = selection
    }

    var bridgeFinaleComplete: Bool {
        (session.bridgeFinal[.partnerA]?.isComplete ?? false) && (session.bridgeFinal[.partnerB]?.isComplete ?? false)
    }

    // MARK: - Voice snapshot

    func markVoiceNoteRecorded(_ role: PartnerRole) {
        session.voiceNoteRecorded[role] = true
    }

    func skipVoiceNote(_ role: PartnerRole) {
        voiceNoteSkipped[role] = true
    }

    // MARK: - Ticking (call from the root view's .onReceive)

    func tick() {
        guard roomTimeRemainingSeconds > 0 else { return }
        roomTimeRemainingSeconds -= 1
        if roomTimeRemainingSeconds == 60 {
            timerFired = true
            FeedbackSounds.timerWarning()
        }
        if roomTimeRemainingSeconds == 0 {
            timeUpBannerShown = true
        }
    }

    var tickerPublisher: AnyPublisher<Date, Never> {
        ticker.eraseToAnyPublisher()
    }

    func finish() {
        session.completedAt = Date()
    }

    // MARK: - UI Testing hooks (screenshot walkthrough only — see `UITestSupport`)

    private func seedForUITestScreenshot() {
        setNames(partnerA: "Alex", partnerB: "Jordan")
        confirmComprehension(.partnerA)
        confirmComprehension(.partnerB)
        couplesAgreement = ["No name-calling", "No leaving mid-conversation"]
        session.firstToSpeak = .partnerA
        setIntensity(4, for: .partnerA)
        setIntensity(3, for: .partnerB)
        toggleState(.hurt, for: .partnerA)
        toggleState(.confused, for: .partnerB)
    }

    /// Dispatches a short string key (from `UITEST_JUMP_FLOW`) to the matching jump. Unknown
    /// keys are a no-op, leaving the app at its normal starting screen.
    func applyUITestJump(flowKey: String, withReveal: Bool) {
        switch flowKey {
        case "livingRoom": jumpToRoom(.livingRoom, withReveal: withReveal)
        case "study": jumpToRoom(.study, withReveal: withReveal)
        case "kidsRoom": jumpToRoom(.kidsRoom, withReveal: withReveal)
        case "kitchen": jumpToRoom(.kitchen, withReveal: withReveal)
        case "basement": jumpToBasement()
        case "bridgeFinale": jumpToBridgeFinale()
        case "voiceSnapshot": jumpToVoiceSnapshot()
        case "closing": jumpToClosing()
        default: break
        }
    }

    private func jumpToRoom(_ kind: RoomKind, withReveal: Bool) {
        seedForUITestScreenshot()
        flow = .room(kind)
        startRoom(kind)
        guard withReveal, RoomConfig.all[kind]?.modes.contains(.speaks) == true else { return }
        let deckID = RoomConfig.all[kind]?.deckIDs.first ?? "events"
        if let card = DeckData.deck(deckID).cards.first {
            playCard(card, deckID: deckID)
        }
        markRoomDone(activePartner)
    }

    private func jumpToBasement() {
        seedForUITestScreenshot()
        flow = .basement
        startBasement()
    }

    private func jumpToBridgeFinale() {
        seedForUITestScreenshot()
        flow = .bridgeFinale
    }

    private func jumpToVoiceSnapshot() {
        seedForUITestScreenshot()
        flow = .voiceSnapshot
    }

    private func jumpToClosing() {
        seedForUITestScreenshot()
        flow = .closing
    }
}
