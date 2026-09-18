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
            PrimaryButton(titleKey: buttonKey, action: onNext)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }
}

/// The modes explanation page (spec section 3, item 4) — shows the four mode icons with
/// a one-line explanation each, visible on screen (not hidden behind a tooltip).
struct OnboardingModesPage: View {
    let onNext: () -> Void

    private let modes: [(icon: String, labelKey: String)] = [
        (RoomMode.speaks.iconSystemName, "onboarding.modes.speaks"),
        (RoomMode.listensOnly.iconSystemName, "onboarding.modes.listens_only"),
        (RoomMode.discussion.iconSystemName, "onboarding.modes.discussion"),
        (RoomMode.silentProtocol.iconSystemName, "onboarding.modes.silence")
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            HStack(spacing: 6) {
                ForEach(0..<3, id: \.self) { i in
                    Capsule()
                        .fill(i == 2 ? Color.primary : Color.primary.opacity(0.2))
                        .frame(width: i == 2 ? 22 : 8, height: 6)
                }
            }
            Spacer()
            Text(L("onboarding.modes.title"))
                .font(.bridgeSerifTitle(26))

            VStack(spacing: 14) {
                ForEach(modes, id: \.labelKey) { mode in
                    HStack(spacing: 14) {
                        Image(systemName: mode.icon)
                            .font(.title3)
                            .frame(width: 32)
                        Text(L(mode.labelKey))
                            .font(.body)
                        Spacer()
                    }
                    .padding(12)
                    .background(Color.primary.opacity(0.05), in: RoundedRectangle(cornerRadius: 12))
                }
            }
            Text(L("onboarding.modes.body"))
                .font(.footnote)
                .foregroundStyle(.secondary)
            Spacer()
            PrimaryButton(titleKey: "onboarding.got_it", action: onNext)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }
}
