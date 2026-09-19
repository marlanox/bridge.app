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
        ZStack {
            // Reuses the Bridge finale's night photo rather than a generic living-room
            // shot — arriving here means the couple already crossed the bridge, so the
            // same image reads as "you made it," not as an unrelated stock interior.
            RoomBackgroundImage(imageName: "bridge")
            Color.black.opacity(0.4).ignoresSafeArea()

            VStack(spacing: 24) {
                Spacer()
                markCard
                Text(L("closing.save_prompt"))
                    .font(.footnote)
                    .foregroundStyle(.white.opacity(0.85))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
                Spacer()
                PrimaryButton(titleKey: "closing.save_to_gallery", isEnabled: !didSave, testID: "uitest.closing.save", action: saveToGallery)
                SecondaryButton(titleKey: "closing.close", color: .white.opacity(0.85), action: onClose)
            }
            .padding(28)
        }
    }

    private var markCard: some View {
        VStack(spacing: 20) {
            Image(systemName: "rosette")
                .font(.system(size: 34))
                .foregroundStyle(Color.bridgeGold)
            Text(L("closing.title"))
                .font(.bridgeSerifTitle(30))
            Text(dateString)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            VStack(spacing: 10) {
                Text(L("closing.line_1"))
                    .font(.title3)
                Text(L(encouragingLineIsCourage ? "closing.line_2b" : "closing.line_2a"))
                    .font(.title3.weight(.medium))
            }
            .multilineTextAlignment(.center)
        }
        .padding(32)
        .background(Color.white, in: RoundedRectangle(cornerRadius: 20, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 20, style: .continuous)
                .strokeBorder(Color.bridgeGold, lineWidth: 1.5)
        )
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
