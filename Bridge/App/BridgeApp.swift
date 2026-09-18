import SwiftUI

@main
struct BridgeApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var loc = LocalizationManager.shared

    var body: some Scene {
        WindowGroup {
            AppRootContainer()
                .environmentObject(appState)
                .environmentObject(loc)
                .preferredColorScheme(.light)
        }
    }
}

/// Gates the whole app behind a language choice first (spec: RU/EN picker at launch,
/// independent of the device's system language). `.id(loc.language)` forces a full
/// rebuild of the tree the moment the language changes, so every screen's text
/// refreshes immediately — no restart needed.
struct AppRootContainer: View {
    @EnvironmentObject var loc: LocalizationManager

    var body: some View {
        Group {
            if loc.language == nil {
                LanguageSelectionView(loc: loc)
            } else {
                RootFlowView()
            }
        }
        .id(loc.language)
    }
}
