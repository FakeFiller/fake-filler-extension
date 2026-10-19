import {
  AI_PROVIDERS,
  GetAiFillSettings,
  GetChatCompletionsUrl,
  SaveAiFillSettings,
} from "src/common/ai-fill-settings";
import AudioCapture, { IAudioChunk } from "src/transcriber/audio-capture";
import { AiProvider, IAiFillSettings } from "src/types";

const TRANSCRIBER_SETTINGS_KEY = "transcriberSettings";
const DEFAULT_TRANSCRIPTION_MODEL = "google/gemini-3.5-flash-lite";
const NO_SPEECH = "[no speech]";
// A clip is a few seconds of audio; a request still running after this long is not coming back.
const REQUEST_TIMEOUT_MS = 90000;

const TRANSCRIBE_PROMPT = `Transcribe the speech in this audio clip. Output only the spoken words, in the language they are spoken in, with normal punctuation. Do not translate, summarise or add commentary. If the clip contains no speech (only music, noise or silence), output exactly ${NO_SPEECH}.`;

interface ITranscriptLine {
  time: Date;
  text: string;
  state: "pending" | "done" | "failed";
}

const byId = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const startButton = byId<HTMLButtonElement>("startButton");
const pauseButton = byId<HTMLButtonElement>("pauseButton");
const stopButton = byId<HTMLButtonElement>("stopButton");
const statePill = byId<HTMLSpanElement>("statePill");
const meterBar = byId<HTMLDivElement>("meterBar");
const statusRow = byId<HTMLDivElement>("status");
const statusText = byId<HTMLSpanElement>("statusText");
const spinner = byId<HTMLSpanElement>("spinner");
const transcriptBox = byId<HTMLDivElement>("transcript");
const emptyMessage = byId<HTMLDivElement>("empty");
const settingsSection = byId<HTMLDetailsElement>("settings");
const apiKeyInput = byId<HTMLInputElement>("apiKeyInput");
const apiKeyHint = byId<HTMLParagraphElement>("apiKeyHint");
const modelInput = byId<HTMLInputElement>("modelInput");

const lines: ITranscriptLine[] = [];
let queue: Promise<void> = Promise.resolve();
let pendingCount = 0;
let isPaused = false;
let isCapturing = false;
// What the user still has to set up before transcribing; filled in by loadSettings.
let setupMessage = "";

// Claude has no audio input, so transcription uses an OpenAI-compatible provider: the active one if it is,
// otherwise OpenRouter.
function getTranscriptionProvider(settings: IAiFillSettings): AiProvider {
  return AI_PROVIDERS[settings.provider].openAiCompatible ? settings.provider : "openrouter";
}

function getTranscriptionModel(): Promise<string> {
  return new Promise((resolve) => {
    chrome.storage.local.get(TRANSCRIBER_SETTINGS_KEY, (result) => {
      const saved: Record<string, any> = (result && result[TRANSCRIBER_SETTINGS_KEY]) || {};
      resolve(saved.model || DEFAULT_TRANSCRIPTION_MODEL);
    });
  });
}

function setStatus(text: string, options: { busy?: boolean; error?: boolean } = {}): void {
  statusText.textContent = text;
  spinner.hidden = !options.busy;
  statusRow.classList.toggle("error", !!options.error);
}

function setState(state: "off" | "live" | "paused"): void {
  statePill.textContent = { off: "Off", live: "● Live", paused: "Paused" }[state];
  statePill.className = `pill ${state === "off" ? "" : state}`;
  startButton.hidden = state !== "off";
  pauseButton.hidden = state === "off";
  stopButton.hidden = state === "off";
  pauseButton.textContent = state === "paused" ? "Resume" : "Pause";
}

function formatTime(time: Date): string {
  return time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function renderTranscript(): void {
  const isAtBottom = transcriptBox.scrollHeight - transcriptBox.scrollTop - transcriptBox.clientHeight < 40;
  const visibleLines = lines.filter((line) => line.state !== "done" || line.text);

  emptyMessage.hidden = visibleLines.length > 0;
  transcriptBox.querySelectorAll(".line").forEach((element) => element.remove());

  visibleLines.forEach((line) => {
    const row = document.createElement("div");
    row.className = `line ${line.state}`;
    const time = document.createElement("span");
    time.className = "time";
    time.textContent = formatTime(line.time);
    const text = document.createElement("span");
    text.className = "text";
    text.textContent = line.state === "pending" ? "Transcribing…" : line.text;
    row.append(time, text);
    transcriptBox.appendChild(row);
  });

  // Follow new text unless the user has scrolled up to read something.
  if (isAtBottom) {
    transcriptBox.scrollTop = transcriptBox.scrollHeight;
  }
}

function updateBusyStatus(): void {
  if (pendingCount > 0) {
    setStatus(`Transcribing ${pendingCount} clip${pendingCount === 1 ? "" : "s"}…`, { busy: true });
  } else if (isCapturing) {
    setStatus(isPaused ? "Paused." : "Listening… text appears after each pause in the speech.");
  } else {
    // Stopped, and the last clips have come back.
    const failedCount = lines.filter((line) => line.state === "failed").length;
    setStatus(
      failedCount > 0
        ? `Stopped. ${failedCount} clip${failedCount === 1 ? "" : "s"} could not be transcribed (shown in red).`
        : "Stopped. The transcript is complete.",
      { error: failedCount > 0 }
    );
  }
}

async function transcribeChunk(chunk: IAudioChunk, line: ITranscriptLine): Promise<void> {
  const settings = await GetAiFillSettings();
  const provider = getTranscriptionProvider(settings);
  const credentials = settings.providers[provider];
  const providerLabel = AI_PROVIDERS[provider].label;
  const model = await getTranscriptionModel();

  // The tail of the transcript so far helps the model with names and sentences that continue across clips.
  const previousText = lines
    .filter((other) => other !== line && other.state === "done" && other.text)
    .map((other) => other.text)
    .join(" ")
    .slice(-400);

  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Title": "FillPilot AI" };
  if (credentials.apiKey) {
    headers.Authorization = `Bearer ${credentials.apiKey}`;
  }

  let response: Response;
  try {
    response = await fetch(GetChatCompletionsUrl(credentials.baseUrl), {
      method: "POST",
      headers,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model,
        temperature: 0,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: previousText
                  ? `${TRANSCRIBE_PROMPT}\n\nThe transcript so far ends with: “${previousText}”`
                  : TRANSCRIBE_PROMPT,
              },
              { type: "input_audio", input_audio: { data: chunk.wavBase64, format: "wav" } },
            ],
          },
        ],
      }),
    });
  } catch (error) {
    if ((error as Error).name === "TimeoutError") {
      throw new Error(`${providerLabel} did not answer within ${REQUEST_TIMEOUT_MS / 1000} seconds.`);
    }
    throw new Error(`Could not reach ${providerLabel}. Check your connection and the API URL.`);
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || (data && data.error)) {
    const detail = data && data.error ? String(data.error.message || data.error) : response.statusText;
    if (response.status === 401) {
      throw new Error(`${providerLabel} rejected the API key. Check it in Settings below.`);
    }
    throw new Error(`${providerLabel} error ${response.status}: ${detail}`);
  }

  const text = String(data?.choices?.[0]?.message?.content || "").trim();
  line.text = text === NO_SPEECH || text.includes(NO_SPEECH) ? "" : text;
}

function handleChunk(chunk: IAudioChunk): void {
  const line: ITranscriptLine = { time: chunk.startedAt, text: "", state: "pending" };
  lines.push(line);
  pendingCount += 1;
  renderTranscript();
  updateBusyStatus();

  // One request at a time keeps the transcript in order and lets each clip see the text before it.
  queue = queue.then(async () => {
    try {
      await transcribeChunk(chunk, line);
      line.state = "done";
    } catch (error) {
      line.state = "failed";
      line.text = `Could not transcribe this clip: ${(error as Error).message}`;
    }
    pendingCount -= 1;
    renderTranscript();
    updateBusyStatus();
  });
}

const capture = new AudioCapture({
  onChunk: handleChunk,
  onLevel: (level) => {
    meterBar.style.width = `${Math.round(level * 100)}%`;
  },
  onEnded: () => {
    isCapturing = false;
    isPaused = false;
    setState("off");
    updateBusyStatus();
  },
});

async function loadSettings(): Promise<boolean> {
  const settings = await GetAiFillSettings();
  const provider = getTranscriptionProvider(settings);
  const { apiKey, baseUrl } = settings.providers[provider];

  apiKeyInput.placeholder = AI_PROVIDERS[provider].keyPlaceholder;
  apiKeyHint.textContent = `Provider: ${AI_PROVIDERS[provider].label} (${baseUrl || "no API URL set"}). ${
    apiKey ? `A key ending in …${apiKey.slice(-4)} is saved; leave the field empty to keep it.` : "No key saved yet."
  }`;
  modelInput.value = await getTranscriptionModel();

  setupMessage =
    provider === "custom"
      ? "Set the API URL for your custom provider on the AI Fill settings page"
      : `Add your ${AI_PROVIDERS[provider].label} API key in Settings`;
  return provider === "custom" ? !!baseUrl : !!apiKey;
}

async function saveSettings(): Promise<void> {
  const settings = await GetAiFillSettings();
  const provider = getTranscriptionProvider(settings);
  if (apiKeyInput.value.trim()) {
    settings.providers[provider].apiKey = apiKeyInput.value.trim();
    await SaveAiFillSettings(settings);
  }
  await new Promise<void>((resolve) =>
    chrome.storage.local.set(
      { [TRANSCRIBER_SETTINGS_KEY]: { model: modelInput.value.trim() || DEFAULT_TRANSCRIPTION_MODEL } },
      () => resolve()
    )
  );
  apiKeyInput.value = "";
  await loadSettings();
  setStatus("Settings saved.");
}

startButton.addEventListener("click", async () => {
  if (!(await loadSettings())) {
    settingsSection.open = true;
    apiKeyInput.focus();
    setStatus(`${setupMessage} first.`, { error: true });
    return;
  }

  setStatus("Choose what to listen to in Chrome's picker…", { busy: true });
  try {
    await capture.start();
    isCapturing = true;
    isPaused = false;
    setState("live");
    updateBusyStatus();
  } catch (error) {
    const { name, message } = error as Error;
    setStatus(name === "NotAllowedError" ? "Sharing was cancelled." : message, { error: name !== "NotAllowedError" });
  }
});

pauseButton.addEventListener("click", () => {
  isPaused = !isPaused;
  capture.setPaused(isPaused);
  setState(isPaused ? "paused" : "live");
  updateBusyStatus();
});

stopButton.addEventListener("click", () => capture.stop());

byId<HTMLButtonElement>("saveSettingsButton").addEventListener("click", () => saveSettings());

function transcriptAsText(): string {
  return lines
    .filter((line) => line.state === "done" && line.text)
    .map((line) => `[${formatTime(line.time)}] ${line.text}`)
    .join("\n");
}

byId<HTMLButtonElement>("copyButton").addEventListener("click", async () => {
  await navigator.clipboard.writeText(transcriptAsText());
  setStatus("Transcript copied.");
});

byId<HTMLButtonElement>("downloadButton").addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([transcriptAsText()], { type: "text/plain" }));
  link.download = `transcript-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
});

byId<HTMLButtonElement>("clearButton").addEventListener("click", () => {
  lines.splice(0, lines.length);
  renderTranscript();
});

window.addEventListener("beforeunload", () => capture.stop());

loadSettings().then((isReady) => {
  setState("off");
  if (!isReady) {
    settingsSection.open = true;
    setStatus(`${setupMessage} to start.`);
  }
});
