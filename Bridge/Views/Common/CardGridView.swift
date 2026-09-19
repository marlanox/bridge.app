import SwiftUI

/// A partner's full deck for the room, shown as a real dropdown menu — one button per
/// deck that opens a scrollable list sheet — rather than a wall of buttons on the
/// photo. Every list groups cards under their category and ends with "Write your own"
/// (spec section 8).
struct CardGridView: View {
    let decks: [Deck]
    var onSelect: (Deck, Card) -> Void
    var onCustom: (Deck, String) -> Void

    @State private var openDeckID: String?
    @State private var customText: String = ""

    var body: some View {
        VStack(spacing: 10) {
            ForEach(decks) { deck in
                dropdownButton(for: deck)
            }
        }
        .padding(16)
        .sheet(item: openDeckBinding) { deck in
            cardListSheet(deck)
        }
    }

    private var openDeckBinding: Binding<Deck?> {
        Binding(
            get: { decks.first(where: { $0.id == openDeckID }) },
            set: { openDeckID = $0?.id }
        )
    }

    @ViewBuilder
    private func dropdownButton(for deck: Deck) -> some View {
        Button {
            customText = ""
            openDeckID = deck.id
        } label: {
            HStack {
                Text(L(deck.nameKey))
                    .font(.bridgeBody.weight(.semibold))
                Spacer()
                Image(systemName: "chevron.down")
                    .font(.caption.weight(.bold))
            }
            .foregroundStyle(.white)
            .padding(.horizontal, 16)
            .padding(.vertical, 14)
            .frame(maxWidth: .infinity)
            .background(.ultraThinMaterial)
            .background(Color.black.opacity(0.3))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(Color.bridgeGold.opacity(0.6), lineWidth: 1)
            )
        }
        .buttonStyle(PressableButtonStyle())
        .accessibilityIdentifier("uitest.deck.\(deck.id)")
    }

    @ViewBuilder
    private func cardListSheet(_ deck: Deck) -> some View {
        NavigationStack {
            List {
                ForEach(Array(deck.sections.enumerated()), id: \.offset) { _, section in
                    Section {
                        ForEach(section.cards) { card in
                            Button {
                                onSelect(deck, card)
                                openDeckID = nil
                            } label: {
                                Text(L(card.textKey))
                                    .font(.bridgeBody)
                                    .foregroundStyle(.primary)
                                    .multilineTextAlignment(.leading)
                            }
                            .accessibilityIdentifier("uitest.card.\(card.id)")
                        }
                    } header: {
                        if let category = section.category {
                            Text(L("category.\(category)"))
                        }
                    }
                }
                Section {
                    TextField(L("room.write_your_own_placeholder"), text: $customText, axis: .vertical)
                        .lineLimit(2...5)
                    Button(L("room.done")) {
                        let trimmed = customText.trimmingCharacters(in: .whitespaces)
                        guard !trimmed.isEmpty else { return }
                        onCustom(deck, trimmed)
                        customText = ""
                        openDeckID = nil
                    }
                    .disabled(customText.trimmingCharacters(in: .whitespaces).isEmpty)
                } header: {
                    Text(L("card.write_your_own"))
                }
            }
            .navigationTitle(Text(L(deck.nameKey)))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button(L("room.done")) { openDeckID = nil }
                }
            }
        }
        // A single fixed detent — two detents make SwiftUI treat a drag at the top of the
        // List as "resize the sheet" instead of "scroll the list", which reads as the
        // sheet randomly collapsing while scrolling through cards.
        .presentationDetents([.large])
    }
}
