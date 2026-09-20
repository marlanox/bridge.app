import AVFoundation

/// Procedurally synthesized tones — no bundled audio files, so nothing to license or
/// track down (same reasoning as `FeedbackSounds`' use of built-in system sounds). Used
/// for the one thing system sounds can't do: a short, pleasant multi-note chime, for a
/// gentle "welcome" moment on the language-picker screen, and a light generic tap for
/// every button press app-wide (wired into `PressableButtonStyle`).
enum ChimeSynth {
    private static let sampleRate = 44_100.0
    private static var engine: AVAudioEngine?
    private static var player: AVAudioPlayerNode?

    /// A soft three-note ascending chime (C5-E5-G5, a plain major triad) — played once
    /// when the language picker first appears.
    static func playWelcomeChime() {
        play(frequencies: [523.25, 659.25, 783.99], noteDuration: 0.42, gap: 0.10, volume: 0.18)
    }

    /// A very short, quiet blip for an ordinary button tap — deliberately understated so
    /// it reads as acknowledgment, not a notification.
    static func playTap() {
        play(frequencies: [740], noteDuration: 0.045, gap: 0, volume: 0.09)
    }

    private static func play(frequencies: [Double], noteDuration: Double, gap: Double, volume: Float) {
        let engine = AVAudioEngine()
        let player = AVAudioPlayerNode()
        engine.attach(player)
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1) else { return }
        engine.connect(player, to: engine.mainMixerNode, format: format)
        guard (try? engine.start()) != nil else { return }

        // Retained until playback finishes so the engine/player aren't torn down mid-note.
        self.engine = engine
        self.player = player

        for frequency in frequencies {
            guard let buffer = toneBuffer(frequency: frequency, duration: noteDuration, volume: volume) else { continue }
            player.scheduleBuffer(buffer)
        }
        player.play()

        let totalDuration = Double(frequencies.count) * (noteDuration + gap) + 0.2
        DispatchQueue.main.asyncAfter(deadline: .now() + totalDuration) {
            player.stop()
            engine.stop()
        }
    }

    /// A single sine tone with a short linear attack/release envelope, so it starts and
    /// ends as a soft fade rather than an audible click.
    private static func toneBuffer(frequency: Double, duration: Double, volume: Float) -> AVAudioPCMBuffer? {
        let frameCount = AVAudioFrameCount(duration * sampleRate)
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1),
              let buffer = AVAudioPCMBuffer(pcmFormat: format, frameCapacity: frameCount) else { return nil }
        buffer.frameLength = frameCount
        guard let channelData = buffer.floatChannelData?[0] else { return nil }

        let totalFrames = Int(frameCount)
        let attackFrames = max(1, Int(0.015 * sampleRate))
        let releaseFrames = max(1, min(totalFrames / 2, Int(0.15 * sampleRate)))

        for i in 0..<totalFrames {
            let t = Double(i) / sampleRate
            var envelope: Float = 1
            if i < attackFrames {
                envelope = Float(i) / Float(attackFrames)
            } else if i > totalFrames - releaseFrames {
                envelope = Float(totalFrames - i) / Float(releaseFrames)
            }
            channelData[i] = Float(sin(2.0 * .pi * frequency * t)) * volume * envelope
        }
        return buffer
    }
}
