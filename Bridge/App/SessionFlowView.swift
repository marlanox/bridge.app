import SwiftUI

/// Dispatches on `vm.flow` to render every screen in the walk (spec section 4 / 11),
/// and drives the per-second timer tick shared by all room-style screens.
struct SessionFlowView: View {
    @EnvironmentObject var appState: AppState
    @ObservedObject var vm: SessionViewModel

    @State private var showingPaywall = false
    @State private var showingSettings = false

    var body: some View {
        ZStack(alignment: .topLeading) {
            content

            if vm.flow == .welcome {
                settingsButton
            }
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
                pageIndex: 0, pageCount: 3
            ) { vm.advance() }

        case .howItWorksApology:
            OnboardingTextPage(
                titleKey: "onboarding.apology.title",
                bodyKey: "onboarding.apology.body",
                buttonKey: "onboarding.next",
                pageIndex: 1, pageCount: 3
            ) { vm.advance() }

        case .howItWorksModes:
            OnboardingModesPage { vm.advance() }

        case .disclaimer:
            DisclaimerView { vm.advance() }

        case .names:
            NamesEntryView(vm: vm) { vm.advance() }

        case .comprehensionAgreement:
            ComprehensionAgreementView(vm: vm) { vm.advance() }

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

    private var settingsButton: some View {
        Button {
            showingSettings = true
        } label: {
            Image(systemName: "gearshape.fill")
                .font(.title2)
                .foregroundStyle(.white)
                .padding(10)
                .background(.ultraThinMaterial, in: Circle())
        }
        .padding(16)
    }
}
