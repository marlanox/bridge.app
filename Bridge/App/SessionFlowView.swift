import SwiftUI

/// Dispatches on `vm.flow` to render every screen in the walk (spec section 4 / 11),
/// and drives the per-second timer tick shared by all room-style screens.
struct SessionFlowView: View {
    @EnvironmentObject var appState: AppState
    @ObservedObject var vm: SessionViewModel

    @State private var showingPaywall = false
    @State private var showingSettings = false

    var body: some View {
        ZStack(alignment: .top) {
            content

            // Global Back / Settings, on every screen, no exceptions — a stuck screen
            // should never be a dead end, so this never depends on the current screen
            // having its own way out. Settings itself is the "redo this page" /
            // "start over" escape hatch for anything Back can't fix.
            globalNavBar
        }
        .onReceive(vm.tickerPublisher) { _ in vm.tick() }
        .sheet(isPresented: $showingPaywall) { PaywallView() }
        .sheet(isPresented: $showingSettings) { SettingsView() }
        .animation(.easeInOut(duration: 0.3), value: vm.flow)
    }

    @ViewBuilder
    private var content: some View {
        switch vm.flow {
        case .welcome:
            WelcomeView(onBegin: attemptBegin)

        case .howItWorksWhatIsBridge:
            OnboardingTextPage(
                titleKey: "onboarding.what_is_bridge.title",
                bodyKey: "onboarding.what_is_bridge.body",
                buttonKey: "onboarding.next",
                pageIndex: 0, pageCount: 2
            ) { vm.advance() }

        case .howItWorksApology:
            OnboardingTextPage(
                titleKey: "onboarding.apology.title",
                bodyKey: "onboarding.apology.body",
                buttonKey: "onboarding.next",
                pageIndex: 1, pageCount: 2
            ) { vm.advance() }

        case .disclaimer:
            DisclaimerView { vm.advance() }

        case .houseMap:
            HouseMapView(context: .onboarding, onContinue: { vm.advance() })

        case .names:
            NamesEntryView(vm: vm) { vm.advance() }

        case .couplesAgreementSetup:
            CouplesAgreementSetupView(vm: vm) { vm.advance() }

        case .dice:
            DiceView(vm: vm) { vm.advance() }

        case .intensityState:
            IntensityStateView(vm: vm) { vm.advance() }

        case .calmDown:
            CalmDownView { vm.advance() }

        case .oath:
            OathView(vm: vm) { vm.advance() }

        case .ritual:
            RitualView(vm: vm) { vm.advance() }

        case .room(let kind):
            if let config = RoomConfig.all[kind] {
                RoomView(vm: vm, config: config)
            }

        case .basement:
            BasementView(vm: vm)

        case .bridgeFinale:
            BridgeFinaleView(vm: vm) { vm.advance() }

        case .voiceSnapshot:
            VoiceSnapshotView(vm: vm) { vm.advance() }

        case .closing:
            ClosingScreenView { appState.endActiveSession() }
        }
    }

    /// Gates a brand-new walk behind the paywall once the profile's one free session
    /// is used up (spec section 2, monetization). Mid-walk `advance()` calls never
    /// pass through here again, so the paywall never interrupts a session in progress.
    private func attemptBegin() {
        if appState.canStartSession {
            vm.advance()
        } else {
            showingPaywall = true
        }
    }

    private var globalNavBar: some View {
        HStack {
            if vm.canGoBack {
                Button {
                    vm.goBack()
                } label: {
                    HStack(spacing: 4) {
                        Image(systemName: "chevron.left")
                        Text(L("nav.back"))
                    }
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(Color.bridgeInk)
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(.ultraThinMaterial, in: Capsule())
                }
                .accessibilityIdentifier("uitest.nav.back")
            }

            Spacer()

            // Deliberately no circle/background behind the gear — a plain glyph with
            // just enough shadow to read on both a light screen and a room photo,
            // per explicit request.
            Button {
                showingSettings = true
            } label: {
                Image(systemName: "gearshape.fill")
                    .font(.title2)
                    .foregroundStyle(Color.bridgeInk)
                    .shadow(color: .white.opacity(0.9), radius: 3)
            }
            .accessibilityIdentifier("uitest.settings.gear")
        }
        .padding(.horizontal, 16)
        .padding(.top, 8)
    }
}
