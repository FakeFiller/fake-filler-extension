import {
  AI_PROVIDER_IDS,
  AI_PROVIDERS,
  GetAiFillSettings,
  IsProviderConfigured,
  SaveAiFillSettings,
} from "src/common/ai-fill-settings";
import { ApplyAiFills, GetAiScanContainer, ScanFormFields } from "src/common/ai-form-scanner";
import GetPageContent, { MIN_SELECTION_CHARACTERS } from "src/common/page-content";
import { AiProvider, IAiFillResult, IAiFillSettings } from "src/types";

export type PanelMode = "fill" | "ask";

const MODE_TEXT: Record<PanelMode, { placeholder: string; button: string; ready: string }> = {
  fill: {
    placeholder: "e.g. My name is Jane Doe, email jane at example dot com, country Bangladesh, tick the newsletter box",
    button: "Fill",
    ready: "Type or speak what to fill, then press Fill (Ctrl/⌘+Enter).",
  },
  ask: {
    placeholder: "Ask anything about this page, or leave empty to answer the questions on it",
    button: "Ask",
    ready: "Ask a question about this page, or press Ask to answer the questions on it.",
  },
};

// Minimal typing for the Web Speech API, which TypeScript's DOM lib does not include.
interface ISpeechRecognitionResultEvent extends Event {
  resultIndex: number;
  results: { length: number; [index: number]: { isFinal: boolean; 0: { transcript: string } } };
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: ISpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => ISpeechRecognition;

const PANEL_STYLES = `
  :host { all: initial; }
  .panel {
    position: fixed; right: 16px; bottom: 16px; z-index: 2147483647;
    width: 340px; max-width: calc(100vw - 32px);
    font: 13px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #1f2328; background: #fff; border: 1px solid #d0d7de; border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,.18); padding: 12px;
  }
  .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; font-weight: 600; }
  .header-actions { display: flex; gap: 4px; }
  .tabs { display: flex; gap: 4px; margin-bottom: 8px; padding: 3px; border-radius: 8px; background: #f6f8fa; }
  .tab { flex: 1; padding: 5px 8px; border: 0; border-radius: 6px; background: transparent; font: inherit; color: #57606a; cursor: pointer; }
  .tab[aria-selected="true"] { background: #fff; color: #1f2328; font-weight: 600; box-shadow: 0 1px 2px rgba(0,0,0,.12); }
  .panel.mode-ask { width: 400px; }
  .fill-only, .ask-only { display: none; }
  .panel.mode-fill .fill-only, .panel.mode-ask .ask-only { display: revert; }
  .panel.mode-fill label.live.fill-only { display: flex; }
  .scope { display: flex; gap: 6px; align-items: baseline; margin-top: 6px; color: #57606a; font-size: 12px; }
  .answer {
    max-height: 260px; overflow-y: auto; margin-top: 8px; padding: 8px 10px; border: 1px solid #d0d7de; border-radius: 6px;
    background: #f6f8fa; white-space: pre-wrap; word-break: break-word; user-select: text;
  }
  .answer[hidden], .answer-actions[hidden] { display: none; }
  .icon { border: 0; background: none; font-size: 16px; line-height: 1; padding: 2px 4px; cursor: pointer; color: #57606a; }
  .close { font-size: 18px; }
  .settings { border: 1px solid #d0d7de; border-radius: 6px; padding: 8px; margin-bottom: 8px; }
  .settings[hidden] { display: none; }
  .settings label { display: block; margin-bottom: 6px; color: inherit; }
  .settings input, .settings select {
    box-sizing: border-box; display: block; width: 100%; margin-top: 2px; padding: 6px 8px;
    font: inherit; color: inherit; background: transparent; border: 1px solid #d0d7de; border-radius: 6px;
  }
  .hint { color: #57606a; font-size: 12px; margin: 4px 0 0; }
  .link { border: 0; background: none; padding: 0; color: #0969da; font: inherit; font-size: 12px; cursor: pointer; text-decoration: underline; }
  textarea {
    box-sizing: border-box; width: 100%; min-height: 72px; resize: vertical; padding: 8px;
    font: inherit; color: inherit; border: 1px solid #d0d7de; border-radius: 6px;
  }
  .interim { color: #57606a; font-style: italic; min-height: 1.4em; margin: 4px 0; }
  .row { display: flex; gap: 8px; align-items: center; margin-top: 6px; }
  button.action {
    flex: 1; padding: 7px 10px; border-radius: 6px; border: 1px solid #d0d7de;
    background: #f6f8fa; font: inherit; cursor: pointer; color: inherit;
  }
  button.primary { background: #1f6feb; border-color: #1f6feb; color: #fff; }
  button.listening { background: #cf222e; border-color: #cf222e; color: #fff; }
  button:disabled { opacity: .6; cursor: default; }
  label.live { display: flex; align-items: center; gap: 6px; margin-top: 8px; color: #57606a; }
  .switch-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 10px; }
  .switch-row .switch-text { display: flex; flex-direction: column; }
  .switch-row .switch-title { font-weight: 600; }
  input.switch {
    appearance: none; -webkit-appearance: none; flex: none; position: relative; width: 36px; height: 20px; margin: 0;
    border-radius: 10px; background: #d0d7de; cursor: pointer; transition: background .2s ease;
  }
  input.switch::before {
    content: ""; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,.25); transition: transform .2s ease;
  }
  input.switch:checked { background: #1f6feb; }
  input.switch:checked::before { transform: translateX(16px); }
  input.switch:focus-visible { outline: 2px solid #1f6feb; outline-offset: 2px; }
  .status-row { display: flex; align-items: flex-start; gap: 8px; margin-top: 8px; }
  .status { flex: 1; color: #57606a; white-space: pre-wrap; }
  .status.error { color: #cf222e; }
  .spinner {
    flex: none; box-sizing: border-box; width: 14px; height: 14px; margin-top: 2px; border-radius: 50%;
    border: 2px solid rgba(31,111,235,.25); border-top-color: #1f6feb; animation: ff-spin .8s linear infinite;
  }
  .spinner[hidden], .progress[hidden] { display: none; }
  .btn-spinner {
    display: inline-block; vertical-align: -2px; box-sizing: border-box; width: 12px; height: 12px; margin-right: 6px;
    border-radius: 50%; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; animation: ff-spin .8s linear infinite;
  }
  .progress { position: relative; height: 4px; margin-top: 8px; border-radius: 2px; overflow: hidden; background: rgba(31,111,235,.15); }
  .progress-bar { height: 100%; width: 0; border-radius: 2px; background: #1f6feb; transition: width .35s ease; }
  .progress.indeterminate .progress-bar { width: 35%; transition: none; animation: ff-slide 1.1s ease-in-out infinite; }
  .panel.busy { border-color: #1f6feb; box-shadow: 0 8px 24px rgba(0,0,0,.18), 0 0 0 3px rgba(31,111,235,.18); }
  @keyframes ff-spin { to { transform: rotate(360deg); } }
  @keyframes ff-slide { from { transform: translateX(-100%); } to { transform: translateX(290%); } }
  @media (prefers-reduced-motion: reduce) {
    .spinner, .btn-spinner, .progress.indeterminate .progress-bar { animation-duration: 2.4s; }
  }
  @media (prefers-color-scheme: dark) {
    .panel { color: #e6edf3; background: #161b22; border-color: #30363d; }
    textarea, button.action, .settings, .settings input, .settings select, .answer { background: #0d1117; border-color: #30363d; }
    .interim, .status, label.live, .icon, .hint, .scope, .tab { color: #8b949e; }
    input.switch { background: #30363d; }
    input.switch:checked { background: #1f6feb; }
    .tabs { background: #0d1117; }
    .tab[aria-selected="true"] { background: #21262d; color: #e6edf3; }
    .link { color: #4493f8; }
  }
`;

class AiFillPanel {
  private host: HTMLDivElement | null = null;
  private textArea!: HTMLTextAreaElement;
  private interimText!: HTMLDivElement;
  private micButton!: HTMLButtonElement;
  private fillButton!: HTMLButtonElement;
  private liveCheckbox!: HTMLInputElement;
  private humanCheckbox!: HTMLInputElement;
  private humanHint!: HTMLSpanElement;
  private statusText!: HTMLDivElement;
  private panelElement!: HTMLDivElement;
  private spinner!: HTMLSpanElement;
  private progress!: HTMLDivElement;
  private progressBar!: HTMLDivElement;
  private settingsSection!: HTMLDivElement;
  private providerSelect!: HTMLSelectElement;
  private apiKeyLabel!: HTMLSpanElement;
  private apiKeyInput!: HTMLInputElement;
  private modelInput!: HTMLInputElement;
  private baseUrlInput!: HTMLInputElement;
  private apiKeyHint!: HTMLParagraphElement;
  private settings: IAiFillSettings | null = null;
  private mode: PanelMode = "fill";
  private tabs: HTMLButtonElement[] = [];
  private scopeText!: HTMLSpanElement;
  private useWholePageButton!: HTMLButtonElement;
  private answerBox!: HTMLDivElement;
  private answerActions!: HTMLDivElement;
  private lastAnswer = "";
  // The page text the user selected; kept because clicking into the panel clears the page selection.
  private pageSelection = "";
  private readonly handleSelectionChange = () => this.captureSelection();

  private recognition: ISpeechRecognition | null = null;
  private isListening = false;
  private scanContainer: Document | HTMLElement = document;
  private queue: string[] = [];
  private isBusy = false;

  // With a mode, opens the panel in that mode (or switches to it); without one, opens or closes the panel.
  public toggle(mode?: PanelMode): void {
    if (this.host && mode) {
      this.setMode(mode);
    } else if (this.host) {
      this.close();
    } else {
      this.open(mode || "fill");
    }
  }

  private open(mode: PanelMode): void {
    // Capture the form the user was working in, and any selected text, before focus moves into the panel.
    this.scanContainer = GetAiScanContainer();
    this.pageSelection = "";
    this.captureSelection();
    document.addEventListener("selectionchange", this.handleSelectionChange);

    this.host = document.createElement("div");
    const shadow = this.host.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>${PANEL_STYLES}</style>
      <div class="panel" role="dialog" aria-label="FillPilot AI fill">
        <div class="header">
          <span>✦ FillPilot AI</span>
          <span class="header-actions">
            <button class="icon transcriber" title="Transcribe audio that is playing" aria-label="Transcribe audio that is playing">🔊</button>
            <button class="icon settings-toggle" title="AI API settings" aria-label="AI API settings">⚙</button>
            <button class="icon close" title="Close (Esc)" aria-label="Close">×</button>
          </span>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" data-mode="fill">✎ Fill form</button>
          <button class="tab" role="tab" data-mode="ask">? Ask page</button>
        </div>
        <div class="settings" hidden>
          <label>AI provider
            <select class="provider">
              ${AI_PROVIDER_IDS.map((id) => `<option value="${id}">${AI_PROVIDERS[id].label}</option>`).join("")}
            </select>
          </label>
          <label><span class="api-key-label">API key</span>
            <input type="password" class="api-key" autocomplete="off" spellcheck="false">
          </label>
          <p class="hint api-key-hint"></p>
          <label>Model
            <input type="text" class="model" autocomplete="off" spellcheck="false">
          </label>
          <label>API URL
            <input type="url" class="base-url" autocomplete="off" spellcheck="false">
          </label>
          <div class="row">
            <button class="action primary save-settings">Save</button>
            <button class="action remove-key">Remove key</button>
          </div>
          <p class="hint">Stored only in this browser's extension storage. On pages you don't trust, use the
            <button class="link open-options">settings page</button> instead.</p>
        </div>
        <textarea></textarea>
        <div class="scope ask-only"><span class="scope-text"></span><button class="link use-whole-page" hidden>Use the whole page</button></div>
        <div class="interim"></div>
        <div class="row">
          <button class="action mic">🎤 Speak</button>
          <button class="action primary fill">Fill</button>
        </div>
        <label class="live fill-only"><input type="checkbox" class="live-toggle" checked> Fill as I speak (after each pause)</label>
        <label class="switch-row">
          <span class="switch-text">
            <span class="switch-title">Human-like typing</span>
            <span class="hint human-hint"></span>
          </span>
          <input type="checkbox" role="switch" class="switch human-toggle" checked>
        </label>
        <div class="answer ask-only" hidden></div>
        <div class="row answer-actions ask-only" hidden>
          <button class="action copy-answer">Copy</button>
          <button class="action fill-answer">Fill answers into the form</button>
        </div>
        <div class="progress" hidden><div class="progress-bar"></div></div>
        <div class="status-row" aria-live="polite">
          <span class="spinner" hidden></span>
          <div class="status"></div>
        </div>
      </div>`;

    this.textArea = shadow.querySelector("textarea") as HTMLTextAreaElement;
    this.interimText = shadow.querySelector(".interim") as HTMLDivElement;
    this.micButton = shadow.querySelector(".mic") as HTMLButtonElement;
    this.fillButton = shadow.querySelector(".fill") as HTMLButtonElement;
    this.liveCheckbox = shadow.querySelector(".live-toggle") as HTMLInputElement;
    this.humanCheckbox = shadow.querySelector(".human-toggle") as HTMLInputElement;
    this.humanHint = shadow.querySelector(".human-hint") as HTMLSpanElement;
    this.humanCheckbox.addEventListener("change", () => this.saveHumanTyping());
    this.statusText = shadow.querySelector(".status") as HTMLDivElement;
    this.panelElement = shadow.querySelector(".panel") as HTMLDivElement;
    this.spinner = shadow.querySelector(".spinner") as HTMLSpanElement;
    this.progress = shadow.querySelector(".progress") as HTMLDivElement;
    this.progressBar = shadow.querySelector(".progress-bar") as HTMLDivElement;
    this.settingsSection = shadow.querySelector(".settings") as HTMLDivElement;
    this.providerSelect = shadow.querySelector(".provider") as HTMLSelectElement;
    this.apiKeyLabel = shadow.querySelector(".api-key-label") as HTMLSpanElement;
    this.apiKeyInput = shadow.querySelector(".api-key") as HTMLInputElement;
    this.providerSelect.addEventListener("change", () => this.renderProviderFields());
    this.modelInput = shadow.querySelector(".model") as HTMLInputElement;
    this.baseUrlInput = shadow.querySelector(".base-url") as HTMLInputElement;
    this.apiKeyHint = shadow.querySelector(".api-key-hint") as HTMLParagraphElement;
    this.scopeText = shadow.querySelector(".scope-text") as HTMLSpanElement;
    this.useWholePageButton = shadow.querySelector(".use-whole-page") as HTMLButtonElement;
    this.answerBox = shadow.querySelector(".answer") as HTMLDivElement;
    this.answerActions = shadow.querySelector(".answer-actions") as HTMLDivElement;
    this.tabs = Array.from(shadow.querySelectorAll<HTMLButtonElement>(".tab"));
    this.tabs.forEach((tab) => tab.addEventListener("click", () => this.setMode(tab.dataset.mode as PanelMode)));
    this.useWholePageButton.addEventListener("click", () => {
      this.pageSelection = "";
      this.renderScope();
    });
    (shadow.querySelector(".copy-answer") as HTMLButtonElement).addEventListener("click", () => this.copyAnswer());
    (shadow.querySelector(".fill-answer") as HTMLButtonElement).addEventListener("click", () =>
      this.enqueue(`Fill in the form with these answers:\n${this.lastAnswer}`)
    );

    (shadow.querySelector(".settings-toggle") as HTMLButtonElement).addEventListener("click", () =>
      this.showSettings(Boolean(this.settingsSection.hidden))
    );
    (shadow.querySelector(".transcriber") as HTMLButtonElement).addEventListener("click", () =>
      chrome.runtime.sendMessage({ type: "openTranscriber" }, () => chrome.runtime.lastError)
    );
    (shadow.querySelector(".save-settings") as HTMLButtonElement).addEventListener("click", () => this.saveSettings());
    (shadow.querySelector(".remove-key") as HTMLButtonElement).addEventListener("click", () => this.removeApiKey());
    (shadow.querySelector(".open-options") as HTMLButtonElement).addEventListener("click", () =>
      chrome.runtime.sendMessage({ type: "openAiFillSettings" }, () => chrome.runtime.lastError)
    );
    this.apiKeyInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.saveSettings();
      }
    });

    (shadow.querySelector(".close") as HTMLButtonElement).addEventListener("click", () => this.close());
    this.micButton.addEventListener("click", () => this.toggleListening());
    this.fillButton.addEventListener("click", () => this.submitTextArea());
    this.textArea.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        this.submitTextArea();
      }
    });
    const panel = shadow.querySelector(".panel") as HTMLDivElement;
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.close();
      }
    });
    // Keep typing inside the panel from reaching the page's own keyboard shortcuts and key handlers.
    ["keydown", "keyup", "keypress", "input", "paste"].forEach((eventName) => {
      panel.addEventListener(eventName, (event) => event.stopPropagation());
    });

    if (!this.getSpeechRecognition()) {
      this.micButton.disabled = true;
      this.micButton.title = "Speech recognition is not available in this browser";
    }

    this.setMode(mode);

    document.documentElement.appendChild(this.host);
    this.textArea.focus();
    this.loadSettings();
  }

  private get selectedProvider(): AiProvider {
    return this.providerSelect.value as AiProvider;
  }

  private hasApiKey(): boolean {
    return (
      !!this.settings && IsProviderConfigured(this.settings.provider, this.settings.providers[this.settings.provider])
    );
  }

  private renderHumanTyping(): void {
    this.humanHint.textContent = this.humanCheckbox.checked
      ? "On: types each field key by key, like a person."
      : "Off: fills every field instantly.";
  }

  private async saveHumanTyping(): Promise<void> {
    const settings = await GetAiFillSettings();
    settings.humanTyping = this.humanCheckbox.checked;
    await SaveAiFillSettings(settings);
    this.settings = settings;
    this.renderHumanTyping();
    this.setStatus(
      this.humanCheckbox.checked ? "Human-like typing is on." : "Human-like typing is off: fills are instant."
    );
  }

  private async loadSettings(): Promise<void> {
    this.settings = await GetAiFillSettings();
    this.humanCheckbox.checked = this.settings.humanTyping;
    this.renderHumanTyping();
    this.providerSelect.value = this.settings.provider;
    this.renderProviderFields();

    if (!this.hasApiKey()) {
      this.showSettings(true);
      this.setStatus(
        this.settings.provider === "custom"
          ? "Add the API URL and model of your custom provider to start."
          : `Add your ${AI_PROVIDERS[this.settings.provider].label} API key to start.`
      );
    }
  }

  // Shows the saved key hint and model for whichever provider is selected in the dropdown.
  private renderProviderFields(): void {
    if (!this.settings) {
      return;
    }

    const provider = this.selectedProvider;
    const { label, keyPlaceholder, defaultModel, defaultBaseUrl } = AI_PROVIDERS[provider];
    const { apiKey, model, baseUrl } = this.settings.providers[provider];

    this.apiKeyLabel.textContent = `${label} API key`;
    this.apiKeyInput.value = "";
    this.apiKeyInput.placeholder = keyPlaceholder;
    this.apiKeyHint.textContent = apiKey
      ? `A key ending in …${apiKey.slice(-4)} is saved. Leave the field empty to keep it.`
      : "No key saved yet.";
    this.modelInput.value = model;
    this.modelInput.placeholder = defaultModel || "e.g. gpt-4o-mini, llama3.1";
    this.baseUrlInput.value = baseUrl;
    this.baseUrlInput.placeholder = defaultBaseUrl || "e.g. https://api.openai.com/v1 or http://localhost:11434/v1";
  }

  private showSettings(visible: boolean): void {
    this.settingsSection.hidden = !visible;
    if (visible) {
      (this.hasApiKey() ? this.modelInput : this.apiKeyInput).focus();
    } else {
      this.textArea.focus();
    }
  }

  private async saveSettings(): Promise<void> {
    const settings = await GetAiFillSettings();
    const provider = this.selectedProvider;
    const info = AI_PROVIDERS[provider];
    const updated = {
      apiKey: this.apiKeyInput.value.trim() || settings.providers[provider].apiKey,
      model: this.modelInput.value.trim() || info.defaultModel,
      baseUrl: this.baseUrlInput.value.trim() || info.defaultBaseUrl,
    };

    if (updated.baseUrl && !/^https?:\/\//i.test(updated.baseUrl)) {
      this.setStatus("The API URL must start with http:// or https://", true);
      this.baseUrlInput.focus();
      return;
    }

    if (!IsProviderConfigured(provider, updated)) {
      this.setStatus(
        provider === "custom" ? "Enter the API URL and model first." : `Enter a ${info.label} API key first.`,
        true
      );
      (provider === "custom" ? this.baseUrlInput : this.apiKeyInput).focus();
      return;
    }

    settings.provider = provider;
    settings.providers[provider] = updated;
    await SaveAiFillSettings(settings);

    this.settings = settings;
    this.renderProviderFields();
    this.showSettings(false);
    this.setStatus(`Using ${info.label}. Type or speak what to fill.`);
  }

  private async removeApiKey(): Promise<void> {
    const settings = await GetAiFillSettings();
    const provider = this.selectedProvider;
    settings.providers[provider].apiKey = "";
    await SaveAiFillSettings(settings);

    this.settings = settings;
    this.renderProviderFields();
    this.setStatus(`${AI_PROVIDERS[provider].label} API key removed.`);
  }

  private setMode(mode: PanelMode): void {
    this.mode = mode;
    this.panelElement.classList.toggle("mode-fill", mode === "fill");
    this.panelElement.classList.toggle("mode-ask", mode === "ask");
    this.tabs.forEach((tab) => tab.setAttribute("aria-selected", String(tab.dataset.mode === mode)));
    this.textArea.placeholder = MODE_TEXT[mode].placeholder;
    if (!this.isBusy) {
      this.fillButton.textContent = MODE_TEXT[mode].button;
    }

    if (mode === "fill") {
      const scope = this.scanContainer === document ? "the whole page" : "the form you were in";
      this.setStatus(`Will fill ${scope}. ${MODE_TEXT.fill.ready}`);
    } else {
      this.renderScope();
      this.setStatus(MODE_TEXT.ask.ready);
    }
    this.textArea.focus();
  }

  // Remembers text the user selects on the page (not inside the panel, whose selection is hidden in its shadow root).
  private captureSelection(): void {
    const selected = (window.getSelection()?.toString() || "").trim();
    if (selected.length >= MIN_SELECTION_CHARACTERS) {
      this.pageSelection = selected;
      if (this.host) {
        this.renderScope();
      }
    }
  }

  private renderScope(): void {
    if (this.pageSelection) {
      this.scopeText.textContent = `Reads your selected text (${this.pageSelection.length.toLocaleString()} characters).`;
      this.useWholePageButton.hidden = false;
    } else {
      this.scopeText.textContent =
        "Reads the visible text of this page. Select text first to ask about just that part.";
      this.useWholePageButton.hidden = true;
    }
  }

  private async copyAnswer(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.lastAnswer);
      this.setStatus("Answer copied.");
    } catch {
      this.setStatus("Could not copy automatically. Select the answer text and copy it.", true);
    }
  }

  private async ask(question: string): Promise<void> {
    if (this.isBusy || !this.host) {
      return;
    }

    this.isBusy = true;
    const panelHost = this.host;
    const providerLabel = this.settings ? AI_PROVIDERS[this.settings.provider].label : "the AI";
    this.setLoading("thinking");
    this.setStatus(`Reading the page and asking ${providerLabel}…`);
    this.answerBox.hidden = true;
    this.answerActions.hidden = true;

    try {
      const page = GetPageContent(this.pageSelection);
      if (!page.text) {
        throw new Error("This page has no readable text.");
      }

      const answer = await this.requestAnswer(question, page);
      if (this.host !== panelHost) {
        return;
      }

      this.lastAnswer = answer;
      this.answerBox.textContent = answer;
      this.answerBox.hidden = false;
      this.answerActions.hidden = false;
      this.answerBox.scrollTop = 0;
      this.setStatus(
        page.truncated
          ? "Answered. The page was very long, so only its beginning was read; select the part you need for better answers."
          : `Answered from ${page.isSelection ? "your selected text" : "the page"}. Check important answers yourself.`
      );
      this.textArea.value = "";
    } catch (error) {
      this.setStatus((error as Error).message, true);
      if (!this.hasApiKey()) {
        this.showSettings(true);
      }
    } finally {
      this.isBusy = false;
      this.setLoading(null);
      // A fill requested while the answer was loading waits in the queue.
      this.processQueue();
    }
  }

  private requestAnswer(question: string, page: ReturnType<typeof GetPageContent>): Promise<string> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "askPage", data: { question, page } }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (!response) {
          reject(new Error("No response from the extension."));
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(String(response.answer));
        }
      });
    });
  }

  private close(): void {
    document.removeEventListener("selectionchange", this.handleSelectionChange);
    this.stopListening();
    this.host?.remove();
    this.host = null;
    this.queue = [];
  }

  private setStatus(text: string, isError = false): void {
    this.statusText.textContent = text;
    this.statusText.classList.toggle("error", isError);
  }

  // "thinking" while waiting for the AI (sliding bar), "typing" while filling fields (bar shows progress).
  private setLoading(phase: "thinking" | "typing" | null, done = 0, total = 0): void {
    const isLoading = phase !== null;
    this.panelElement.classList.toggle("busy", isLoading);
    this.spinner.hidden = !isLoading;
    this.progress.hidden = !isLoading;
    this.progress.classList.toggle("indeterminate", phase === "thinking");
    this.progressBar.style.width = phase === "typing" && total > 0 ? `${Math.round((done / total) * 100)}%` : "";

    this.fillButton.disabled = isLoading;
    if (isLoading) {
      this.fillButton.innerHTML = `<span class="btn-spinner"></span>${phase === "thinking" ? "Thinking…" : "Typing…"}`;
    } else {
      this.fillButton.textContent = MODE_TEXT[this.mode].button;
    }
  }

  private highlightedField: { element: HTMLElement; boxShadow: string; transition: string } | null = null;

  // Glow around the page field currently being filled so the user can follow along.
  private highlightField(element: HTMLElement | null): void {
    if (this.highlightedField) {
      const previous = this.highlightedField;
      previous.element.style.boxShadow = previous.boxShadow;
      setTimeout(() => {
        previous.element.style.transition = previous.transition;
      }, 250);
      this.highlightedField = null;
    }

    if (element) {
      const { style } = element;
      this.highlightedField = { element, boxShadow: style.boxShadow, transition: style.transition };
      style.transition = "box-shadow .2s ease";
      style.boxShadow = "0 0 0 3px rgba(31, 111, 235, .45)";
    }
  }

  private getSpeechRecognition(): SpeechRecognitionConstructor | undefined {
    const speechWindow = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
  }

  private toggleListening(): void {
    if (this.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  private startListening(): void {
    const SpeechRecognition = this.getSpeechRecognition();
    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.documentElement.lang || navigator.language || "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result[0].transcript.trim();
        if (result.isFinal) {
          if (transcript) {
            this.handleFinalTranscript(transcript);
          }
        } else {
          interim += `${transcript} `;
        }
      }
      this.interimText.textContent = interim.trim();
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        this.setStatus("Microphone access was blocked. Allow the microphone for this site and try again.", true);
      } else if (event.error !== "no-speech" && event.error !== "aborted") {
        this.setStatus(`Speech recognition error: ${event.error}`, true);
      }
    };

    // Chrome ends continuous recognition after a stretch of silence; restart while the user still wants to listen.
    recognition.onend = () => {
      if (this.isListening && this.recognition === recognition) {
        try {
          recognition.start();
        } catch {
          this.stopListening();
        }
      }
    };

    this.recognition = recognition;
    this.isListening = true;
    this.micButton.textContent = "■ Stop";
    this.micButton.classList.add("listening");
    this.setStatus("Listening…");

    try {
      recognition.start();
    } catch {
      this.stopListening();
      this.setStatus("Could not start the microphone.", true);
    }
  }

  private stopListening(): void {
    this.isListening = false;
    if (this.recognition) {
      this.recognition.onend = null;
      this.recognition.stop();
      this.recognition = null;
    }
    if (this.micButton) {
      this.micButton.textContent = "🎤 Speak";
      this.micButton.classList.remove("listening");
    }
    if (this.interimText) {
      this.interimText.textContent = "";
    }
  }

  private handleFinalTranscript(transcript: string): void {
    if (this.mode === "fill" && this.liveCheckbox.checked) {
      this.textArea.value = transcript;
      this.enqueue(transcript);
    } else {
      this.textArea.value = this.textArea.value ? `${this.textArea.value.trim()} ${transcript}` : transcript;
    }
  }

  private submitTextArea(): void {
    const instruction = this.textArea.value.trim();
    if (this.mode === "ask") {
      // An empty question asks the AI to answer the questions it finds on the page.
      this.ask(instruction);
    } else if (instruction) {
      this.enqueue(instruction);
    }
  }

  // Requests run one at a time so each sees the values the previous one filled in.
  private enqueue(instruction: string): void {
    this.queue.push(instruction);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isBusy) {
      return;
    }

    const instruction = this.queue.shift();
    if (!instruction || !this.host) {
      return;
    }

    this.isBusy = true;
    const providerLabel = this.settings ? AI_PROVIDERS[this.settings.provider].label : "the AI";
    this.setLoading("thinking");
    this.setStatus(`Reading the form and asking ${providerLabel}…\n“${instruction}”`);
    // If the panel is closed (or reopened) while the request or typing is running, stop touching the page.
    const panelHost = this.host;

    try {
      const container = this.scanContainer.isConnected ? this.scanContainer : document;
      const fields = ScanFormFields(container);
      if (fields.length === 0) {
        throw new Error("No fillable fields found on this page.");
      }

      const result = await this.requestFill(instruction, fields);
      if (this.host !== panelHost) {
        return;
      }
      if (result.fills.length > 0) {
        this.setLoading("typing", 0, result.fills.length);
        this.setStatus(`Filling field 1 of ${result.fills.length}…`);
      }
      const appliedCount = await ApplyAiFills(result.fills, {
        humanLike: this.humanCheckbox.checked,
        onProgress: (done, total) => {
          this.setLoading("typing", done, total);
          if (done < total) {
            this.setStatus(`Filling field ${done + 1} of ${total}…`);
          }
        },
        onFieldStart: (element) => this.highlightField(element),
        onFieldEnd: () => this.highlightField(null),
        shouldStop: () => this.host !== panelHost,
      });
      if (this.host !== panelHost) {
        return;
      }
      this.setStatus(`Filled ${appliedCount} field${appliedCount === 1 ? "" : "s"}. ${result.message}`);

      if (!this.liveCheckbox.checked || !this.isListening) {
        this.textArea.value = "";
      }
    } catch (error) {
      this.setStatus((error as Error).message, true);
      if (!this.hasApiKey()) {
        this.showSettings(true);
      }
    } finally {
      this.isBusy = false;
      this.highlightField(null);
      this.setLoading(null);
      this.processQueue();
    }
  }

  private requestFill(instruction: string, fields: ReturnType<typeof ScanFormFields>): Promise<IAiFillResult> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "aiFill", data: { instruction, fields } }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (!response) {
          reject(new Error("No response from the extension."));
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.result as IAiFillResult);
        }
      });
    });
  }
}

export default AiFillPanel;
