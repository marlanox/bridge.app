import SwiftUI

/// The "safety exit" the App Store checklist calls for (B.1) — reachable from the
/// disclaimer screen and from Settings, not just buried in legal text.
struct CrisisResourcesView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    Text(LocalizedStringKey("crisis.body"))
                        .font(.body)
                    Text(LocalizedStringKey("crisis.us_line"))
                        .font(.subheadline.weight(.medium))
                    Text(LocalizedStringKey("crisis.international_line"))
                        .font(.subheadline.weight(.medium))
                }
                .padding(24)
            }
            .navigationTitle(Text(LocalizedStringKey("crisis.title")))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button(LocalizedStringKey("crisis.close")) { dismiss() }
                }
            }
        }
    }
}
