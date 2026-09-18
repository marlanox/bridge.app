import SwiftUI

/// The very first screen the app can show, before any language has been chosen — so
/// its own text can't go through `L()` yet. Deliberately bilingual and neutral.
struct LanguageSelectionView: View {
    @ObservedObject var loc: LocalizationManager

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "house-exterior")
            LinearGradient(colors: [.black.opacity(0.1), .black.opacity(0.6)], startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()

            VStack(spacing: 32) {
                Spacer()
                Text("Bridge")
                    .font(.bridgeSerifTitle(40))
                    .foregroundStyle(.white)

                VStack(spacing: 14) {
                    Text("Choose your language")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.white.opacity(0.9))
                    Text("Выберите язык")
                        .font(.subheadline.weight(.medium))
                        .foregroundStyle(.white.opacity(0.9))
                }

                VStack(spacing: 14) {
                    languageButton(.en, title: "English")
                    languageButton(.ru, title: "Русский")
                }
                .padding(.horizontal, 32)

                Spacer()
            }
        }
    }

    @ViewBuilder
    private func languageButton(_ language: AppLanguage, title: String) -> some View {
        Button {
            loc.setLanguage(language)
        } label: {
            Text(title)
                .font(.bridgeButton)
                .textCase(.uppercase)
                .tracking(1.2)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 16)
        }
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
        .foregroundStyle(.white)
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Color.white.opacity(0.5), lineWidth: 1)
        )
    }
}
