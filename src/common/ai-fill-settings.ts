import { AiProvider, IAiFillSettings, IAiProviderSettings } from "src/types";

const AI_FILL_SETTINGS_KEY = "aiFillSettings";

interface IAiProviderInfo {
  label: string;
  defaultModel: string;
  defaultBaseUrl: string;
  keyPlaceholder: string;
  // Whether the provider speaks the OpenAI chat completions format (and so can also take audio for transcription).
  openAiCompatible: boolean;
}

export const AI_PROVIDERS: Record<AiProvider, IAiProviderInfo> = {
  openrouter: {
    label: "OpenRouter",
    defaultModel: "anthropic/claude-opus-5.5",
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    keyPlaceholder: "sk-or-…",
    openAiCompatible: true,
  },
  claude: {
    label: "Claude (Anthropic)",
    defaultModel: "claude-opus-5-5",
    defaultBaseUrl: "https://api.anthropic.com",
    keyPlaceholder: "sk-ant-…",
    openAiCompatible: false,
  },
  custom: {
    label: "Custom (OpenAI-compatible)",
    defaultModel: "",
    defaultBaseUrl: "",
    keyPlaceholder: "API key (leave empty if not needed)",
    openAiCompatible: true,
  },
};

export const AI_PROVIDER_IDS = Object.keys(AI_PROVIDERS) as AiProvider[];

function normalizeProvider(provider: AiProvider, saved: Partial<IAiProviderSettings> | undefined): IAiProviderSettings {
  return {
    apiKey: (saved && saved.apiKey) || "",
    model: (saved && saved.model) || AI_PROVIDERS[provider].defaultModel,
    baseUrl: (saved && saved.baseUrl) || AI_PROVIDERS[provider].defaultBaseUrl,
  };
}

// A provider is ready once it has what it needs to send a request. Local custom servers often need no key.
export function IsProviderConfigured(provider: AiProvider, settings: IAiProviderSettings): boolean {
  if (provider === "custom") {
    return !!settings.baseUrl && !!settings.model;
  }
  return !!settings.apiKey;
}

// Accepts either a base URL (".../v1") or the full chat completions endpoint.
export function GetChatCompletionsUrl(baseUrl: string): string {
  const trimmed = baseUrl.trim().replace(/\/+$/, "");
  return /\/chat\/completions$/.test(trimmed) ? trimmed : `${trimmed}/chat/completions`;
}

// Kept in chrome.storage.local (not the synced options) so API keys never leave this browser profile.
export function GetAiFillSettings(): Promise<IAiFillSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(AI_FILL_SETTINGS_KEY, (result) => {
      const saved: Record<string, any> = (result && result[AI_FILL_SETTINGS_KEY]) || {};
      const savedProviders = saved.providers || {};

      // Settings saved before multi-provider support held a single Claude key at the top level.
      if (!saved.providers && saved.apiKey) {
        savedProviders.claude = { apiKey: saved.apiKey, model: saved.model };
      }

      let provider: AiProvider = AI_PROVIDER_IDS.includes(saved.provider) ? saved.provider : "openrouter";
      if (!saved.provider && savedProviders.claude && savedProviders.claude.apiKey) {
        provider = "claude";
      }

      resolve({
        provider,
        providers: {
          openrouter: normalizeProvider("openrouter", savedProviders.openrouter),
          claude: normalizeProvider("claude", savedProviders.claude),
          custom: normalizeProvider("custom", savedProviders.custom),
        },
        humanTyping: saved.humanTyping !== false,
      });
    });
  });
}

export function SaveAiFillSettings(settings: IAiFillSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [AI_FILL_SETTINGS_KEY]: settings }, () => resolve());
  });
}
