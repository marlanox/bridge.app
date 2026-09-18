import SwiftUI

struct PrimaryButton: View {
    let titleKey: String
    var color: Color = Color(red: 0.36, green: 0.31, blue: 0.27)
    var isEnabled: Bool = true
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(LocalizedStringKey(titleKey))
                .font(.headline)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
        }
        .background(isEnabled ? color : color.opacity(0.35))
        .foregroundStyle(.white)
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .disabled(!isEnabled)
    }
}

struct SecondaryButton: View {
    let titleKey: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(LocalizedStringKey(titleKey))
                .font(.subheadline.weight(.medium))
                .foregroundStyle(.secondary)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
        }
    }
}
