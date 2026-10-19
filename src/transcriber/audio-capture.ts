// Captures the audio of a shared tab or screen and cuts it into speech chunks encoded as 16 kHz mono WAV.

const TARGET_SAMPLE_RATE = 16000;
const MIN_CHUNK_SECONDS = 4;
const MAX_CHUNK_SECONDS = 12;
// Cut a chunk at the first quiet moment after MIN_CHUNK_SECONDS so words are not split in half.
const QUIET_WINDOW_SECONDS = 0.35;
const QUIET_RMS = 0.008;
// Chunks quieter than this overall are treated as silence and never sent for transcription.
const SILENT_CHUNK_RMS = 0.006;

export interface IAudioChunk {
  wavBase64: string;
  startedAt: Date;
  seconds: number;
}

export interface IAudioCaptureCallbacks {
  onChunk: (chunk: IAudioChunk) => void;
  onLevel: (level: number) => void;
  onEnded: () => void;
}

function rms(samples: Float32Array, from = 0, to = samples.length): number {
  let sum = 0;
  for (let i = from; i < to; i += 1) {
    sum += samples[i] * samples[i];
  }
  return to > from ? Math.sqrt(sum / (to - from)) : 0;
}

function downsample(input: Float32Array, inputRate: number): Float32Array {
  if (inputRate === TARGET_SAMPLE_RATE) {
    return input;
  }

  const ratio = inputRate / TARGET_SAMPLE_RATE;
  const output = new Float32Array(Math.floor(input.length / ratio));

  // Average the source samples that fall into each output sample, which also acts as a simple low-pass filter.
  for (let i = 0; i < output.length; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    for (let j = start; j < end; j += 1) {
      sum += input[j];
    }
    output[i] = end > start ? sum / (end - start) : 0;
  }

  return output;
}

function encodeWavBase64(samples: Float32Array): string {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const writeString = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true); // PCM header size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, TARGET_SAMPLE_RATE, true);
  view.setUint32(28, TARGET_SAMPLE_RATE * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...Array.from(bytes.subarray(i, i + 0x8000)));
  }
  return btoa(binary);
}

class AudioCapture {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private buffered: Float32Array[] = [];
  private bufferedLength = 0;
  private chunkStartedAt = new Date();
  private isPaused = false;

  private callbacks: IAudioCaptureCallbacks;

  constructor(callbacks: IAudioCaptureCallbacks) {
    this.callbacks = callbacks;
  }

  public get isRunning(): boolean {
    return this.stream !== null;
  }

  // Opens Chrome's share picker. The user picks a tab (with "Also share tab audio") or the entire screen
  // (with "Also share system audio", where the OS supports it).
  public async start(): Promise<void> {
    const constraints = {
      video: true,
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        // Keep playing the audio through the speakers while it is being captured.
        suppressLocalAudioPlayback: false,
      },
      systemAudio: "include",
      selfBrowserSurface: "exclude",
    } as MediaStreamConstraints;

    // TypeScript 4.0's DOM types predate getDisplayMedia.
    const mediaDevices = navigator.mediaDevices as MediaDevices & {
      getDisplayMedia(options: MediaStreamConstraints): Promise<MediaStream>;
    };
    const stream = await mediaDevices.getDisplayMedia(constraints);
    const audioTracks = stream.getAudioTracks();

    if (audioTracks.length === 0) {
      stream.getTracks().forEach((track) => track.stop());
      throw new Error(
        "No audio was shared. Start again and tick “Also share tab audio” (or “Also share system audio”) in Chrome's picker."
      );
    }

    this.stream = stream;
    // Sharing stops when the user presses Chrome's "Stop sharing" button or closes the shared tab.
    audioTracks[0].addEventListener("ended", () => this.stop());

    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(new MediaStream(audioTracks));
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
    // The processor only runs while connected to the output; a muted gain node keeps it from playing twice.
    const mute = this.audioContext.createGain();
    mute.gain.value = 0;
    source.connect(this.processor);
    this.processor.connect(mute);
    mute.connect(this.audioContext.destination);

    const inputRate = this.audioContext.sampleRate;
    this.processor.onaudioprocess = (event) => {
      const samples = downsample(event.inputBuffer.getChannelData(0), inputRate);
      this.callbacks.onLevel(this.isPaused ? 0 : Math.min(1, rms(samples) * 8));
      if (!this.isPaused) {
        this.addSamples(samples);
      }
    };

    this.resetChunk();
  }

  public setPaused(paused: boolean): void {
    if (paused && !this.isPaused) {
      this.flush();
    }
    this.isPaused = paused;
    this.resetChunk();
  }

  public stop(): void {
    if (!this.stream) {
      return;
    }

    this.flush();
    this.processor?.disconnect();
    this.audioContext?.close();
    this.stream.getTracks().forEach((track) => track.stop());

    this.stream = null;
    this.audioContext = null;
    this.processor = null;
    this.callbacks.onLevel(0);
    this.callbacks.onEnded();
  }

  private resetChunk(): void {
    this.buffered = [];
    this.bufferedLength = 0;
    this.chunkStartedAt = new Date();
  }

  private addSamples(samples: Float32Array): void {
    this.buffered.push(new Float32Array(samples));
    this.bufferedLength += samples.length;

    const seconds = this.bufferedLength / TARGET_SAMPLE_RATE;
    if (seconds >= MAX_CHUNK_SECONDS || (seconds >= MIN_CHUNK_SECONDS && this.endsQuietly())) {
      this.flush();
    }
  }

  private endsQuietly(): boolean {
    let remaining = Math.floor(QUIET_WINDOW_SECONDS * TARGET_SAMPLE_RATE);
    let sum = 0;
    let count = 0;

    for (let i = this.buffered.length - 1; i >= 0 && remaining > 0; i -= 1) {
      const part = this.buffered[i];
      const from = Math.max(0, part.length - remaining);
      for (let j = from; j < part.length; j += 1) {
        sum += part[j] * part[j];
      }
      count += part.length - from;
      remaining -= part.length - from;
    }

    return count > 0 && Math.sqrt(sum / count) < QUIET_RMS;
  }

  private joinBuffered(): Float32Array {
    const joined = new Float32Array(this.bufferedLength);
    let offset = 0;
    this.buffered.forEach((part) => {
      joined.set(part, offset);
      offset += part.length;
    });
    return joined;
  }

  private flush(): void {
    if (this.bufferedLength === 0) {
      return;
    }

    const samples = this.joinBuffered();
    const startedAt = this.chunkStartedAt;
    this.resetChunk();

    if (rms(samples) >= SILENT_CHUNK_RMS) {
      this.callbacks.onChunk({
        wavBase64: encodeWavBase64(samples),
        startedAt,
        seconds: samples.length / TARGET_SAMPLE_RATE,
      });
    }
  }
}

export default AudioCapture;
