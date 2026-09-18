import SwiftUI

struct VoiceSnapshotView: View {
    @ObservedObject var vm: SessionViewModel
    let onContinue: () -> Void

    @StateObject private var recorderA = VoiceRecorder()
    @StateObject private var recorderB = VoiceRecorder()

    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            Text(LocalizedStringKey("voice.title"))
                .font(.title2.weight(.semibold))
                .multilineTextAlignment(.center)
            Text(LocalizedStringKey("voice.body"))
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 16)

            partnerRow(role: .partnerA, color: .purple, recorder: recorderA)
            partnerRow(role: .partnerB, color: .green, recorder: recorderB)

            Spacer()
            PrimaryButton(titleKey: "voice.save", action: onContinue)
            SecondaryButton(titleKey: "voice.not_this_time", action: onContinue)
        }
        .padding(28)
        .background(Color(red: 0.98, green: 0.96, blue: 0.93))
    }

    @ViewBuilder
    private func partnerRow(role: PartnerRole, color: PartnerColor, recorder: VoiceRecorder) -> some View {
        HStack {
            Circle().fill(color.color).frame(width: 10, height: 10)
            Text(vm.session.name(for: role)).font(.subheadline.weight(.medium))
            Spacer()
            Button {
                let url = PersistenceManager.shared.voiceNoteURL(sessionID: vm.session.id, role: role)
                if recorder.isRecording {
                    recorder.stopRecording()
                    vm.markVoiceNoteRecorded(role)
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
        .background(color.color.opacity(0.08), in: RoundedRectangle(cornerRadius: 14))
    }
}
