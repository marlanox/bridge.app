import AVFoundation

/// A very soft, continuously-looping ambient pad, procedurally generated (three sustained
/// sine tones forming an open A-major chord, with a slow amplitude swell so it breathes
/// rather than droning flat) — no bundled/licensed audio file, same reasoning as
/// `ChimeSynth`. Played only through the screens before the actual rooms start (language
/// picker through the dice/intensity/calm-down check-in); silent once a room, the
/// basement, or the Bridge finale begins, and during the closing screens.
///
/// `start()`/`stop()` are both idempotent, so call sites can call them freely on every
/// flow change without tracking whether music is already playing.
enum AmbientMusic {
    private final class PlaybackState {
        var elapsedSeconds: Double = 0
        var fadeOutStartedAtSeconds: Double?
    }

    private static let sampleRate = 44_100.0
    /// A3, E4, C#5 — an open, warm major chord, not the app's own gold/ink palette turned
    /// into a mood, just a plain pleasant sustain.
    private static let frequencies: [Double] = [220.00, 329.63, 415.30]

    private static var engine: AVAudioEngine?
    private static var state: PlaybackState?
    private static var isPlaying = false

    static func start() {
        guard !isPlaying else { return }
        guard let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1) else { return }

        let playbackState = PlaybackState()
        var phase = [Double](repeating: 0, count: frequencies.count)
        let frequencies = self.frequencies
        let sampleRate = self.sampleRate

        let node = AVAudioSourceNode(format: format) { _, _, frameCount, audioBufferList in
            let bufferList = UnsafeMutableAudioBufferListPointer(audioBufferList)
            guard let buffer = bufferList.first,
                  let data = buffer.mData?.assumingMemoryBound(to: Float.self) else {
                return noErr
            }
            for frame in 0..<Int(frameCount) {
                var sample: Float = 0
                for i in 0..<frequencies.count {
                    phase[i] += 2.0 * .pi * frequencies[i] / sampleRate
                    if phase[i] > 2.0 * .pi { phase[i] -= 2.0 * .pi }
                    sample += Float(sin(phase[i]))
                }
                sample /= Float(frequencies.count)

                let elapsed = playbackState.elapsedSeconds
                let swell = 0.75 + 0.25 * sin(elapsed * 0.35)
                var volume = Float(0.045 * swell)
                if let fadeStart = playbackState.fadeOutStartedAtSeconds {
                    volume *= Float(max(0, 1 - (elapsed - fadeStart) / 1.5))
                } else {
                    volume *= Float(min(1, elapsed / 2.5)) // gentle fade-in
                }
                data[frame] = sample * volume
                playbackState.elapsedSeconds += 1.0 / sampleRate
            }
            return noErr
        }

        let engine = AVAudioEngine()
        engine.attach(node)
        engine.connect(node, to: engine.mainMixerNode, format: format)
        guard (try? engine.start()) != nil else { return }

        isPlaying = true
        self.engine = engine
        self.state = playbackState
    }

    static func stop() {
        guard isPlaying, let state, let engine else { return }
        isPlaying = false
        if state.fadeOutStartedAtSeconds == nil {
            state.fadeOutStartedAtSeconds = state.elapsedSeconds
        }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
            engine.stop()
        }
        self.engine = nil
        self.state = nil
    }
}
