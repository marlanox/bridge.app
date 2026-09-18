import SwiftUI

struct WelcomeView: View {
    let onBegin: () -> Void

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "house-exterior")
            LinearGradient(
                colors: [.black.opacity(0.05), .black.opacity(0.55)],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack {
                Spacer()
                Text(LocalizedStringKey("app.name"))
                    .font(.system(size: 40, weight: .semibold, design: .serif))
                    .foregroundStyle(.white)
                Text(LocalizedStringKey("app.tagline"))
                    .font(.body)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.white.opacity(0.9))
                    .padding(.horizontal, 32)
                    .padding(.top, 8)
                Spacer()
                Button(action: onBegin) {
                    Text(LocalizedStringKey("welcome.begin"))
                        .font(.headline)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                }
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                .foregroundStyle(.white)
                .padding(.horizontal, 32)
                .padding(.bottom, 48)
            }
        }
    }
}
