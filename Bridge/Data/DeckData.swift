import Foundation

/// Full card text transcribed verbatim from BRIDGE_MASTER_SPEC.md section 8.
/// Card IDs are stable strings (deck_index) used by CardPlay records.
/// Display text lives in Localizable.strings under each card's textKey — nothing here
/// is user-facing English, so the deck stays i18n-ready per spec section 2.
enum DeckData {

    private static func makeCards(deckID: String, category: String?, texts: [String]) -> [Card] {
        texts.enumerated().map { index, _ in
            let n = String(format: "%02d", index + 1)
            let key = category != nil ? "card.\(deckID).\(category!).\(n)" : "card.\(deckID).\(n)"
            return Card(id: "\(deckID)_\(category ?? "x")_\(n)", textKey: key, category: category)
        }
    }

    // MARK: Deck 1 — Events

    static let events = Deck(
        id: "events",
        nameKey: "deck.events.name",
        cards: makeCards(deckID: "events", category: nil, texts: eventsTexts)
    )
    static let eventsTexts = [
        "I was yelled at", "I was interrupted", "I was ignored",
        "They walked out of the conversation", "I was lied to", "Voices were raised",
        "I wasn't answered", "I was dismissed", "Plans were cancelled",
        "They turned away from me", "I wasn't warned", "I wasn't called back",
        "They spoke to me sarcastically", "I was cut off in front of others",
        "I asked for help and didn't get it", "I was compared to someone else",
        "A promise wasn't kept", "I found out something I wasn't told"
    ]

    // MARK: Deck 2 — Emotions

    static let emotionsPain = ["It hurts", "I feel sad", "I feel a sense of loss", "I feel alone", "I'm disappointed", "I feel empty", "I feel unseen", "I feel forgotten", "I feel small", "I feel hollow"]
    static let emotionsFear = ["I'm scared right now", "I'm panicking", "I froze", "I feel anxious right now", "My chest feels tight", "I feel unsafe"]
    static let emotionsShame = ["I feel ashamed", "I feel like a bad partner", "I'm ashamed of what I said", "I can't look you in the eye", "I feel like I ruined everything", "I feel exposed", "I feel like I'm not enough"]
    static let emotionsGuilt = ["I feel guilty", "I let you down", "I hurt you", "I'm sorry", "I want to fix this", "I wish I'd done it differently", "I feel responsible"]
    static let emotionsAnger = ["I'm angry", "I feel this is unfair", "I feel irritated", "I feel unheard", "I feel powerless", "I feel dismissed", "I feel disrespected", "I feel provoked"]
    static let emotionsAnxiety = ["I'm confused", "I don't understand what's happening", "I'm scared to talk", "I'm afraid of another fight", "I feel on edge", "I feel like I'm walking on eggshells", "I can't settle down"]

    static let emotions = Deck(
        id: "emotions",
        nameKey: "deck.emotions.name",
        cards: makeCards(deckID: "emotions", category: "pain", texts: emotionsPain)
            + makeCards(deckID: "emotions", category: "fear", texts: emotionsFear)
            + makeCards(deckID: "emotions", category: "shame", texts: emotionsShame)
            + makeCards(deckID: "emotions", category: "guilt", texts: emotionsGuilt)
            + makeCards(deckID: "emotions", category: "anger", texts: emotionsAnger)
            + makeCards(deckID: "emotions", category: "anxiety", texts: emotionsAnxiety)
    )

    // MARK: Deck 3 — What I thought (interpretations)

    static let interpretationsTexts = [
        "It felt like you don't love me anymore", "It felt like you don't respect me",
        "It felt like I stopped mattering", "It felt like you don't care",
        "It felt like you don't trust me", "It felt like you're judging me",
        "It felt like you think I'm a bad person", "It felt like you want to change me",
        "It felt like you think my feelings don't matter", "It felt like you're rejecting me",
        "It felt like you want to win, not understand", "It felt like you're manipulating me",
        "It felt like you're deliberately hurting me", "It felt like you're controlling me",
        "It felt like you're testing me", "It felt like you're using me",
        "It felt like you're lying to me", "It felt like you're hiding the truth",
        "It felt like you betrayed me", "It felt like you're not choosing me"
    ]
    static let interpretations = Deck(
        id: "interpretations",
        nameKey: "deck.interpretations.name",
        cards: makeCards(deckID: "interpretations", category: nil, texts: interpretationsTexts)
    )

    // MARK: Deck 4 — Body sensations

    static let bodySensationsTexts = [
        "A lump in my throat", "Heaviness", "Trembling", "Emptiness", "Tears",
        "Heat", "Cold", "Numbness", "Racing heart", "A knot in my stomach", "Tension in my shoulders"
    ]
    static let bodySensations = Deck(
        id: "body_sensations",
        nameKey: "deck.body_sensations.name",
        cards: makeCards(deckID: "body_sensations", category: nil, texts: bodySensationsTexts)
    )

    // MARK: Deck 5 — Childhood experiences

    static let childhoodTexts = [
        "I'm not chosen", "I'm not loved", "I'll be abandoned", "I'm not heard",
        "I'm not protected", "I'm being criticized", "I'll be replaced", "I'm not good enough",
        "Love has to be earned", "I'm being ignored", "I was punished for my feelings",
        "I wasn't allowed to be angry", "I had to be easy/convenient", "I was compared to others"
    ]
    static let childhood = Deck(
        id: "childhood",
        nameKey: "deck.childhood.name",
        cards: makeCards(deckID: "childhood", category: nil, texts: childhoodTexts)
    )

    // MARK: Deck 6 — Fears (single unified deck; two exact duplicates in the source text collapsed)

    static let fearsTexts = [
        "I'm afraid of losing you", "I'm afraid of losing this relationship", "I'm afraid you'll leave",
        "I'm afraid of being rejected", "I'm afraid of being unneeded", "I'm afraid I'm no longer loved",
        "I'm afraid you'll choose someone else", "I'm afraid I can no longer be trusted",
        "I'm afraid of reliving old pain", "I'm afraid of being punished", "I'm afraid of being blamed",
        "I'm afraid of disappointing you", "I'm afraid of making a mistake", "I'm afraid to open up",
        "I'm afraid of being rejected again", "I'm afraid of being alone", "I'm afraid I won't be forgiven",
        "I'm afraid this will happen again", "I'm afraid of being misunderstood", "I'm afraid to tell the truth",
        "I'm afraid I'm not chosen", "I'm losing my sense of safety", "I'm afraid I'll be replaced",
        "I'm afraid I'm not loved like before", "I feel accused unfairly", "I feel manipulated",
        "I can't trust my partner right now", "I feel guilt is being forced on me", "I feel unheard",
        "I feel my words are used against me", "I'm afraid we can't fix this", "I feel like I'm alone in this",
        "I'm afraid to show how much this actually hurts", "I feel controlled", "I feel unaccepted",
        "I feel too much is being asked of me", "I feel anything I say will be used against me",
        "I want to shut down", "I want to leave", "I want to be quiet", "I want to be alone right now",
        "I'm afraid of making another mistake", "I'm afraid of seeming like a bad person",
        "I'm afraid this broke trust for good"
    ]
    static let fears = Deck(
        id: "fears",
        nameKey: "deck.fears.name",
        cards: makeCards(deckID: "fears", category: nil, texts: fearsTexts)
    )

    // MARK: Deck 7 — Needs & Connection (merged, two sections)

    static let needsPresenceTexts = [
        "A hug", "Tea", "To sit together", "To be silent together", "To be alone for a bit",
        "For you to stay near me without talking", "A shared day off", "A walk", "Sex", "A kiss",
        "Holding hands", "A movie together", "Help", "Sleep", "Safety"
    ]
    static let needsWordsTexts = [
        "Look me in the eyes", "Take my hand", "Hold me", "Tell me you love me",
        "Tell me we'll get through this", "Sit with me in silence", "Listen to me fully",
        "Don't interrupt me", "Ask me again", "Smile at me", "Kiss me", "Tell me I matter",
        "Don't leave right now", "Let's start over", "Hear my apology", "Tell me I'm still safe with you"
    ]
    static let needsConnection = Deck(
        id: "needs_connection",
        nameKey: "deck.needs_connection.name",
        cards: makeCards(deckID: "needs_connection", category: "presence", texts: needsPresenceTexts)
            + makeCards(deckID: "needs_connection", category: "words", texts: needsWordsTexts)
    )

    // MARK: Deck 8 — Step toward (includes the mandatory final Bridge card)

    static let stepTowardTexts = [
        "I'm willing to listen more carefully", "I'm willing to speak more honestly",
        "I'm willing to ask more often what you feel", "I'm willing to stop running from the conversation",
        "I'm willing to calm down before speaking", "I'm willing to remember you're not my enemy",
        "I'm willing to be softer", "I'm willing to trust you", "I'm willing to start over",
        "I choose our relationship", "I choose to stay", "I choose to fight the problem, not you"
    ]
    /// The mandatory card every partner must complete aloud at the Bridge finale.
    static let mandatoryStepTowardCardID = "step_toward_x_12"

    static let stepToward = Deck(
        id: "step_toward",
        nameKey: "deck.step_toward.name",
        cards: makeCards(deckID: "step_toward", category: nil, texts: stepTowardTexts)
    )

    // MARK: Deck 9 — Gifts

    static let giftsMaterialTexts = ["flowers", "a ring", "a watch", "a bag", "a trip", "a car", "a favorite book", "jewelry"]
    static let giftsNonMaterialTexts = ["a massage", "a date", "breakfast", "a letter", "a day together", "an evening without phones", "cooking dinner", "a hug", "a dance", "a favorite song", "a trip together"]
    static let gifts = Deck(
        id: "gifts",
        nameKey: "deck.gifts.name",
        cards: makeCards(deckID: "gifts", category: "material", texts: giftsMaterialTexts)
            + makeCards(deckID: "gifts", category: "nonmaterial", texts: giftsNonMaterialTexts)
    )

    // MARK: Lookup

    static let all: [String: Deck] = [
        events.id: events,
        emotions.id: emotions,
        interpretations.id: interpretations,
        bodySensations.id: bodySensations,
        childhood.id: childhood,
        fears.id: fears,
        needsConnection.id: needsConnection,
        stepToward.id: stepToward,
        gifts.id: gifts
    ]

    static func deck(_ id: String) -> Deck {
        guard let d = all[id] else {
            assertionFailure("Unknown deck id \(id)")
            return Deck(id: id, nameKey: "deck.unknown.name", cards: [])
        }
        return d
    }
}
