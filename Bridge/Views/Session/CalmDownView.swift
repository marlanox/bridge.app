import SwiftUI

struct CalmDownView: View {
    let onDone: () -> Void

    @State private var breathing = false
    @State private var scale: CGFloat = 0.6

    var body: some View {
        VStack(spacing: 28) {
            Spacer()
            Text(L("calm_down.title"))
                .font(.bridgeSerifTitle(26))
            Text(L("calm_down.body"))
                .font(.body)
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .padding(.horizontal, 20)

            Circle()
                .fill(Color(red: 0.55, green: 0.66, blue: 0.7).opacity(0.35))
                .frame(width: 160, height: 160)
                .scaleEffect(scale)
                .animation(breathing ? .easeInOut(duration: 4).repeatForever(autoreverses: true) : .default, value: scale)

            Spacer()

            if breathing {
                PrimaryButton(titleKey: "onboarding.got_it", testID: "uitest.calmdown.done", action: onDone)
            } else {
                PrimaryButton(titleKey: "calm_down.start_breathing", testID: "uitest.calmdown.start") {
                    breathing = true
                    scale = 1.0
                }
                SecondaryButton(titleKey: "calm_down.skip", testID: "uitest.calmdown.skip", action: onDone)
            }
        }
        .padding(28)
        .background(Color.bridgeIvory)
    }
}
