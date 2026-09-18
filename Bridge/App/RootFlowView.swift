import SwiftUI

/// The single root of the view hierarchy. Keying on the session's id makes SwiftUI
/// tear down and rebuild the whole subtree whenever a session resets (finished, or a
/// different profile was selected), so no screen's local @State leaks into the next walk.
struct RootFlowView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        SessionFlowView(vm: appState.session)
            .id(appState.session.session.id)
    }
}
