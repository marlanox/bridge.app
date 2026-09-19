import SwiftUI

/// Shared layout for the two plain-text "how it works" pages (spec section 3, items 2-3).
struct OnboardingTextPage: View {
    let titleKey: String
    let bodyKey: String
    let buttonKey: String
    let pageIndex: Int
    let pageCount: Int
    let onNext: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HStack(spacing: 6) {
                ForEach(0..<pageCount, id: \.self) { i in
                    Capsule()
                        .fill(i == pageIndex ? Color.primary : Color.primary.opacity(0.2))
                        .frame(width: i == pageIndex ? 22 : 8, height: 6)
                }
            }
            Spacer()
            Text(L(titleKey))
                .font(.bridgeSerifTitle(26))
            Text(L(bodyKey))
                .font(.body)
                .foregroundStyle(.secondary)
            Spacer()
            PrimaryButton(titleKey: buttonKey, testID: "uitest.onboarding.next", action: onNext)
        }
        .padding(28)
        .background(Color.bridgeIvory)
    }
}

