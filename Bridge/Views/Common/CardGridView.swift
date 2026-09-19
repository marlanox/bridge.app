import SwiftUI

/// A partner's full deck for the room, shown all at once as a categorized grid —
/// never a swipeable one-at-a-time stack (spec section 2). Every deck ends with a
/// "Write your own" tile that opens a free-text field (spec section 8).
struct CardGridView: View {
    let decks: [Deck]
    let color: PartnerColor
    var onSelect: (Deck, Card) -> Void
    var onCustom: (Deck, String) -> Void

    @State private var writingForDeckID: String?
    @State private var customText: String = ""

    private let columns = [GridItem(.adaptive(minimum: 140), spacing: 10)]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 22) {
                ForEach(decks) { deck in
                    VStack(alignment: .leading, spacing: 14) {
                        if decks.count > 1 {
                            Text(L(deck.nameKey))
                                .font(.bridgeSerifHeadline(17))
                                .foregroundStyle(.white)
                                .padding(.horizontal, 10)
                                .padding(.vertical, 5)
                                .background(.ultraThinMaterial, in: Capsule())
                                .background(Color.black.opacity(0.25), in: Capsule())
                        }
                        ForEach(Array(deck.sections.enumerated()), id: \.offset) { _, section in
                            VStack(alignment: .leading, spacing: 8) {
                                if let category = section.category {
                                    Text(L("category.\(category)"))
                                        .font(.bridgeLabel)
                                        .foregroundStyle(.white)
                                        .textCase(.uppercase)
                                        .padding(.horizontal, 9)
                                        .padding(.vertical, 4)
                                        .background(.ultraThinMaterial, in: Capsule())
                                        .background(Color.black.opacity(0.25), in: Capsule())
                                }
                                LazyVGrid(columns: columns, spacing: 10) {
                                    ForEach(section.cards) { card in
                                        CardView(card: card, color: color) {
                                            onSelect(deck, card)
                                        }
                                    }
                                }
                            }
                        }
                        LazyVGrid(columns: columns, spacing: 10) {
                            CardView(card: .writeYourOwn(), color: color) {
                                customText = ""
                                writingForDeckID = deck.id
                            }
                        }
                    }
                }
            }
            .padding(16)
        }
        .sheet(isPresented: writeYourOwnBinding) {
            writeYourOwnSheet
        }
    }

    private var writeYourOwnBinding: Binding<Bool> {
        Binding(get: { writingForDeckID != nil }, set: { if !$0 { writingForDeckID = nil } })
    }

    @ViewBuilder
    private var writeYourOwnSheet: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text(L("room.write_your_own_placeholder"))
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                TextField(L("room.write_your_own_placeholder"), text: $customText, axis: .vertical)
                    .lineLimit(3...6)
                    .textFieldStyle(.roundedBorder)
                Spacer()
                PrimaryButton(titleKey: "room.done", isEnabled: !customText.trimmingCharacters(in: .whitespaces).isEmpty) {
                    if let deck = decks.first(where: { $0.id == writingForDeckID }) {
                        onCustom(deck, customText.trimmingCharacters(in: .whitespaces))
                    }
                    writingForDeckID = nil
                }
            }
            .padding()
            .navigationTitle(Text(L("card.write_your_own")))
            .navigationBarTitleDisplayMode(.inline)
        }
        .presentationDetents([.medium])
    }
}
