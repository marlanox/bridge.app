import SwiftUI
import UIKit

/// "Today's Mark" (spec section 6) — deliberately neutral, no stats, no score, no gift recap.
struct ClosingScreenView: View {
    let onClose: () -> Void

    @State private var encouragingLineIsCourage = Bool.random()
    @State private var didSave = false

    private var dateString: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .long
        return formatter.string(from: Date())
    }

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            markCard
            Text(LocalizedStringKey("closing.save_prompt"))
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
            Spacer()
            PrimaryButton(titleKey: "closing.save_to_gallery", isEnabled: !didSave, action: saveToGallery)
            SecondaryButton(titleKey: "closing.close", action: onClose)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }

    private var markCard: some View {
        VStack(spacing: 24) {
            Text(LocalizedStringKey("closing.title"))
                .font(.largeTitle.weight(.semibold))
            Text(dateString)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            VStack(spacing: 10) {
                Text(LocalizedStringKey("closing.line_1"))
                    .font(.title3)
                Text(LocalizedStringKey(encouragingLineIsCourage ? "closing.line_2b" : "closing.line_2a"))
                    .font(.title3.weight(.medium))
            }
            .multilineTextAlignment(.center)
        }
        .padding(32)
        .background(Color.white, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .shadow(color: .black.opacity(0.08), radius: 12, y: 6)
    }

    @MainActor
    private func saveToGallery() {
        let renderer = ImageRenderer(content: markCard.frame(width: 320))
        renderer.scale = UIScreen.main.scale
        guard let image = renderer.uiImage else { return }
        UIImageWriteToSavedPhotosAlbum(image, nil, nil, nil)
        didSave = true
    }
}
