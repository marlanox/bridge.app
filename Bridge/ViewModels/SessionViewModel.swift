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
    /// The steps visited before the current one, most-recent-last — lets a resumed walk
    /// still offer "Back" instead of stranding a couple who reopens the app mid-session.
    var history: [AppFlowStep]
    var session: GameSession
    var couplesAgreement: [String]
    var roomDoneFlags: [PartnerRole: Bool]
    var activePartner: PartnerRole
    var placedCardsThisTurn: [CardPlay]
    var basementStage: SessionViewModel.BasementStage
    var voiceNoteSkipped: [PartnerRole: Bool]
}

/// Drives one full walk through the house: flow position, whose turn is active,
/// the room timer, cards played, the Basement Q&A protocol, and the Bridge finale.
final class SessionViewModel: ObservableObject {
    @Published private(set) var flow: AppFlowStep = .welcome
    /// Steps visited before the current one, most-recent-last. Populated automatically by
    /// `setFlow(_:)` (used by every forward move `advance()` makes) and consumed by
    /// `goBack()`. UI-test jump helpers bypass this on purpose — see their doc comment.
    @Published private(set) var history: [AppFlowStep] = []
    @Published var session: GameSession
    @Published var activePartner: PartnerRole = .partnerA

    // Onboarding
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

    // Basement runtime state — two stages, never looping: everyone voices whichever
    // fears they choose from the list (discussion-mode, same as any non-sequential
    // room), then a free, untimed-per-question window for up to 15 verbal yes/no
    // questions with nothing for the UI to track per question.
    enum BasementStage: String, Codable { case fears, questions }
    @Published var basementStage: BasementStage = .fears

    // Voice snapshot
    @Published var voiceNoteSkipped: [PartnerRole: Bool] = [.partnerA: false, .partnerB: false]

    private let ticker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    let originalProfile: RelationshipProfile

    /// A snapshot of everything worth resuming, taken as-is right now (see `SessionSnapshot`).
    func makeSnapshot() -> SessionSnapshot {
        SessionSnapshot(
            flow: flow,
            history: history,
            session: session,
            couplesAgreement: couplesAgreement,
            roomDoneFlags: roomDoneFlags,
            activePartner: activePartner,
            placedCardsThisTurn: placedCardsThisTurn,
            basementStage: basementStage,
            voiceNoteSkipped: voiceNoteSkipped
        )
    }

    /// Restores a previously-saved walk. Only ever called right after `init`, before any UI
    /// has observed this view model, so directly overwriting the fresh defaults is safe.
    func restore(from snapshot: SessionSnapshot) {
        flow = snapshot.flow
        history = snapshot.history
        session = snapshot.session
        couplesAgreement = snapshot.couplesAgreement
        roomDoneFlags = snapshot.roomDoneFlags
        activePartner = snapshot.activePartner
        placedCardsThisTurn = snapshot.placedCardsThisTurn
        basementStage = snapshot.basementStage
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

    func addAgreementRule(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        couplesAgreement.append(trimmed)
    }

    func removeAgreementRule(at offsets: IndexSet) {
        couplesAgreement.remove(atOffsets: offsets)
    }

    // MARK: - Dice / intensity / calm-down / oath / ritual

    enum DiceStage { case partnerA, partnerB, done }

    /// Both partners roll their own die — one number picked for you by a tap isn't a
    /// fair contest, and reads as broken/rigged ("I tapped once and immediately won").
    /// Higher number starts every room; a tie rerolls both automatically.
    @Published private(set) var diceStage: DiceStage = .partnerA
    @Published private(set) var diceValueA: Int?
    @Published private(set) var diceValueB: Int?
    @Published private(set) var diceJustTied = false

    @discardableResult
    func rollDiceStep() -> Int {
        let value = Int.random(in: 1...6)
        switch diceStage {
        case .partnerA:
            diceJustTied = false
            diceValueA = value
            diceStage = .partnerB
        case .partnerB:
            diceValueB = value
            if diceValueA == value {
                diceJustTied = true
                diceValueA = nil
                diceValueB = nil
                diceStage = .partnerA
            } else {
                diceJustTied = false
                session.firstToSpeak = value > (diceValueA ?? 0) ? .partnerB : .partnerA
                diceStage = .done
            }
        case .done:
            break
        }
        return value
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

    /// Every forward move goes through here so `history` always reflects exactly the
    /// steps a couple actually walked through, in order — the single source `goBack()`
    /// unwinds from.
    private func setFlow(_ newValue: AppFlowStep) {
        history.append(flow)
        flow = newValue
    }

    func advance() {
        switch flow {
        case .welcome:
            // Spec section 3: onboarding is "mandatory, first launch only." Returning
            // couples already have names on file, so repeat sessions skip straight past
            // the explanatory pages, house map and names to the apology ritual itself —
            // that part happens fresh every session, not just at onboarding. They still
            // revisit the Couple's Agreement at the end of every session, after the
            // Bridge finale.
            setFlow(originalProfile.hasCompletedFirstSession ? .ritual : .howItWorksWhatIsBridge)
        case .howItWorksWhatIsBridge:
            setFlow(.disclaimer)
        case .disclaimer:
            setFlow(.howItWorksApology)
        case .howItWorksApology:
            setFlow(.ritual)
        case .ritual:
            setFlow(.oath)
        case .oath:
            // A returning couple already has the house map and names on file — the oath
            // is the last thing they repeat every session before going straight to dice.
            setFlow(originalProfile.hasCompletedFirstSession ? .dice : .houseMap)
        case .houseMap:
            setFlow(.names)
        case .names:
            setFlow(.dice)
        case .couplesAgreementSetup:
            setFlow(.voiceSnapshot)
        case .dice:
            setFlow(.intensityState)
        case .intensityState:
            if needsCalmDown {
                setFlow(.calmDown)
            } else {
                setFlow(.room(.hall))
                startRoom(.hall)
            }
        case .calmDown:
            setFlow(.room(.hall))
            startRoom(.hall)
        case .room(let kind):
            if kind == .kitchen {
                setFlow(.basement)
                startBasement()
            } else if let next = kind.next {
                setFlow(.room(next))
                startRoom(next)
            }
        case .basement:
            // No separate Needs Room or Garden — straight to the Bridge finale, where
            // Needs & Connection, Step Toward and Gift cards are all chosen together.
            setFlow(.bridgeFinale)
        case .bridgeFinale:
            TokenManager.awardBridgeFinale(session: &session)
            setFlow(.couplesAgreementSetup)
        case .voiceSnapshot:
            setFlow(.closing)
        case .closing:
            break
        }
    }

    var canGoBack: Bool { !history.isEmpty }

    /// Steps back to whatever screen preceded the current one. Answers already recorded
    /// for earlier steps (names, intensity, cards played in an earlier room, etc.) are
    /// untouched — only the step being re-entered has its own in-flight runtime state
    /// (room timer, reveal card, basement turn) reset, the same way arriving at it
    /// forward always does.
    func goBack() {
        guard let previous = history.popLast() else { return }
        flow = previous
        reenterCurrentStep()
    }

    /// The "Start Over" escape hatch, reachable from Settings on every screen: throws
    /// away the walk in progress and returns to Welcome. Tokens and history from any
    /// previously *completed* session are untouched — this only abandons the current one.
    func restartWalk() {
        history = []
        flow = .welcome
    }

    /// The "redo this page" escape hatch: clears whatever runtime state belongs only to
    /// the current step and re-enters it fresh, without moving forward or backward in the
    /// walk. `history` is untouched, so "Back" afterward still lands on whatever came
    /// before this step.
    func redoCurrentPage() {
        reenterCurrentStep()
    }

    private func reenterCurrentStep() {
        switch flow {
        case .room(let kind):
            startRoom(kind)
        case .basement:
            startBasement()
        case .dice:
            diceStage = .partnerA
            diceValueA = nil
            diceValueB = nil
            diceJustTied = false
        default:
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

        // Whoever the dice named to go first opens every sequential room, not just the
        // first one — alternating by room used to mean a couple would see "start with
        // Alex, then Jordan, then Alex again" with no visible reason why, which read as
        // broken rather than intentional.
        activePartner = session.firstToSpeak ?? .partnerA
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
        placedCardsThisTurn = []
        basementStage = .fears
        activePartner = session.firstToSpeak ?? .partnerA
        timerFired = false
        timeUpBannerShown = false
        roomTimeRemainingSeconds = 10 * 60
    }

    /// Either partner can voice any number of fears — nothing here forces alternation,
    /// so there's no asker/answerer ping-pong left to get stuck in. Once both have
    /// tapped Done, stage two starts; the fears chosen stay visible as a reminder.
    func markBasementFearsDone(_ role: PartnerRole) {
        roomDoneFlags[role] = true
        if roomDoneFlags[.partnerA] == true && roomDoneFlags[.partnerB] == true {
            basementStage = .questions
            roomDoneFlags = [.partnerA: false, .partnerB: false]
        }
    }

    /// Up to 15 yes/no questions asked and answered out loud — nothing for the UI to
    /// track per question, just a shared window of time that ends when both partners
    /// say they're done.
    func markBasementQuestionsDone(_ role: PartnerRole) {
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
        case "couplesAgreementSetup": jumpToCouplesAgreementSetup()
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

    private func jumpToCouplesAgreementSetup() {
        seedForUITestScreenshot()
        flow = .couplesAgreementSetup
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
