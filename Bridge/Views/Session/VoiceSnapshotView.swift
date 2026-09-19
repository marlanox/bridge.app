import SwiftUI

struct VoiceSnapshotView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @StateObject private var recorderA = VoiceRecorder()
    @StateObject private var recorderB = VoiceRecorder()

    var body: some View {
        ZStack {
            RoomBackgroundImage(imageName: "ending")
            Color.black.opacity(0.3).ignoresSafeArea()

            VStack(spacing: 20) {
                Spacer()
                Text(L("voice.title"))
                    .font(.bridgeSerifTitle(24))
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.center)
                Text(L("voice.body"))
                    .font(.subheadline)
                    .foregroundStyle(.white.opacity(0.85))
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 16)

                partnerRow(role: .partnerA, color: .purple, recorder: recorderA)
                partnerRow(role: .partnerB, color: .green, recorder: recorderB)

                Spacer()
                PrimaryButton(titleKey: "voice.save", action: onContinue)
                SecondaryButton(titleKey: "voice.not_this_time", color: .white.opacity(0.85), action: onContinue)
            }
            .padding(28)
        }
    }

    @ViewBuilder
    private func partnerRow(role: PartnerRole, color: PartnerColor, recorder: VoiceRecorder) -> some View {
        HStack {
            Circle().fill(color.color).frame(width: 10, height: 10)
            Text(vm.session.name(for: role)).font(.subheadline.weight(.medium)).foregroundStyle(.white)
            Spacer()
            Button {
                let url = PersistenceManager.shared.voiceNoteURL(sessionID: vm.session.id, role: role)
                if recorder.isRecording {
                    recorder.stopRecording()
                    vm.markVoiceNoteRecorded(role)
                    PersistenceManager.shared.mirrorVoiceNoteToiCloud(sessionID: vm.session.id, role: role)
                } else {
                    recorder.startRecording(to: url)
                }
            } label: {
                Image(systemName: recorder.isRecording ? "stop.circle.fill" : "mic.circle.fill")
                    .font(.title2)
                    .foregroundStyle(color.color)
            }
        }
        .padding(14)
        .background(.ultraThinMaterial)
        .background(color.color.opacity(0.18))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
    }
}
