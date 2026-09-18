import SwiftUI

@main
struct BridgeApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            RootFlowView()
                .environmentObject(appState)
                .preferredColorScheme(.light)
        }
    }
}
