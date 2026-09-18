import Foundation
import Combine
import AVFoundation

/// Minimal record/playback wrapper for the optional voice snapshot (spec section 6).
/// Notes are capped at 10 seconds and saved per-session, per-partner.
final class VoiceRecorder: NSObject, ObservableObject {
    @Published var isRecording = false
    @Published var hasRecording = false
    @Published var isPlaying = false

    private var recorder: AVAudioRecorder?
    private var player: AVAudioPlayer?
    private var stopTimer: Timer?

    private let maxDuration: TimeInterval = 10

    func startRecording(to url: URL) {
        let session = AVAudioSession.sharedInstance()
        try? session.setCategory(.playAndRecord, mode: .default)
        try? session.setActive(true)

        let settings: [String: Any] = [
            AVFormatIDKey: kAudioFormatMPEG4AAC,
            AVSampleRateKey: 44_100,
            AVNumberOfChannelsKey: 1,
            AVEncoderAudioQualityKey: AVAudioQuality.medium.rawValue
        ]

        recorder = try? AVAudioRecorder(url: url, settings: settings)
        recorder?.record()
        isRecording = true
        hasRecording = false

        stopTimer?.invalidate()
        stopTimer = Timer.scheduledTimer(withTimeInterval: maxDuration, repeats: false) { [weak self] _ in
            self?.stopRecording()
        }
    }

    func stopRecording() {
        stopTimer?.invalidate()
        recorder?.stop()
        isRecording = false
        hasRecording = true
    }

    func play(from url: URL) {
        player = try? AVAudioPlayer(contentsOf: url)
        player?.delegate = self
        player?.play()
        isPlaying = true
    }
}

extension VoiceRecorder: AVAudioPlayerDelegate {
    func audioPlayerDidFinishPlaying(_ player: AVAudioPlayer, successfully flag: Bool) {
        isPlaying = false
    }
}
