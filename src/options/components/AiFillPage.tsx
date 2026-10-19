import React, { useEffect, useState } from "react";

import {
  AI_PROVIDER_IDS,
  AI_PROVIDERS,
  GetAiFillSettings,
  IsProviderConfigured,
  SaveAiFillSettings,
} from "src/common/ai-fill-settings";
import { AiProvider, IAiFillSettings } from "src/types";

const AiFillPage = () => {
  const [settings, setSettings] = useState<IAiFillSettings | null>(null);
  const [provider, setProvider] = useState<AiProvider>("openrouter");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [humanTyping, setHumanTyping] = useState(true);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    GetAiFillSettings().then((saved) => {
      setSettings(saved);
      setProvider(saved.provider);
      setModel(saved.providers[saved.provider].model);
      setBaseUrl(saved.providers[saved.provider].baseUrl);
      setHumanTyping(saved.humanTyping);
    });
  }, []);

  function handleProviderChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextProvider = event.target.value as AiProvider;
    setProvider(nextProvider);
    setApiKey("");
    setErrorMessage("");
    if (settings) {
      setModel(settings.providers[nextProvider].model);
      setBaseUrl(settings.providers[nextProvider].baseUrl);
    }
  }

  // Saved straight away, independent of the provider form below.
  function handleHumanTypingChange(event: React.ChangeEvent<HTMLInputElement>) {
    const enabled = event.target.checked;
    setHumanTyping(enabled);
    GetAiFillSettings().then((saved) => {
      const updated = { ...saved, humanTyping: enabled };
      setSettings(updated);
      return SaveAiFillSettings(updated);
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!settings) {
      return;
    }

    const providerSettings = {
      // An empty key field keeps the key that is already saved.
      apiKey: apiKey.trim() || settings.providers[provider].apiKey,
      model: model.trim() || AI_PROVIDERS[provider].defaultModel,
      baseUrl: baseUrl.trim() || AI_PROVIDERS[provider].defaultBaseUrl,
    };

    if (providerSettings.baseUrl && !/^https?:\/\//i.test(providerSettings.baseUrl)) {
      setErrorMessage("The API URL must start with http:// or https://");
      return;
    }
    if (!IsProviderConfigured(provider, providerSettings)) {
      setErrorMessage(provider === "custom" ? "Enter the API URL and model." : "Enter an API key.");
      return;
    }
    setErrorMessage("");

    const updated: IAiFillSettings = {
      provider,
      providers: { ...settings.providers, [provider]: providerSettings },
      humanTyping,
    };

    SaveAiFillSettings(updated).then(() => {
      setSettings(updated);
      setApiKey("");
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    });
  }

  if (!settings) {
    return <div>Loading…</div>;
  }

  const savedKey = settings.providers[provider].apiKey;

  return (
    <>
      <h2>AI Fill</h2>
      <p>
        Instead of random dummy data, AI Fill lets you say or type what goes into a form, for example{" "}
        <em>“my name is Jane Doe, email jane@example.com, country Bangladesh”</em>. The AI reads the form fields on the
        page and fills only the ones you mention.
      </p>
      <p>
        Open it with the <strong>AI fill by voice or text</strong> keyboard shortcut (default <kbd>Ctrl+Shift+Y</kbd>)
        or from the right-click menu.
      </p>
      <div className="form-check form-switch mb-4">
        <input
          className="form-check-input"
          type="checkbox"
          role="switch"
          id="aiFillHumanTyping"
          checked={humanTyping}
          onChange={handleHumanTypingChange}
        />
        {}
        <label className="form-check-label" htmlFor="aiFillHumanTyping">
          <strong>Human-like typing</strong>
          <span className="d-block text-muted small">
            {humanTyping
              ? "On: AI fill types each field key by key, with natural pauses, like a person."
              : "Off: AI fill puts every value in instantly."}
          </span>
        </label>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="aiFillProvider" className="d-block">
            AI provider
            <select id="aiFillProvider" className="form-select" value={provider} onChange={handleProviderChange}>
              {AI_PROVIDER_IDS.map((id) => (
                <option key={id} value={id}>
                  {AI_PROVIDERS[id].label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-3">
          <label htmlFor="aiFillApiKey" className="d-block">
            {AI_PROVIDERS[provider].label} API key
            <input
              id="aiFillApiKey"
              type="password"
              className="form-control"
              autoComplete="off"
              placeholder={AI_PROVIDERS[provider].keyPlaceholder}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
          </label>
          <small className="form-text text-muted">
            {savedKey
              ? `A key ending in …${savedKey.slice(-4)} is saved. Leave this empty to keep it.`
              : "No key saved yet."}{" "}
            Keys are stored only in this browser&apos;s local extension storage and are not synced.
          </small>
        </div>
        <div className="mb-3">
          <label htmlFor="aiFillModel" className="d-block">
            Model
            <input
              id="aiFillModel"
              type="text"
              className="form-control"
              placeholder={AI_PROVIDERS[provider].defaultModel}
              value={model}
              onChange={(event) => setModel(event.target.value)}
            />
          </label>
          <small className="form-text text-muted">
            {AI_PROVIDERS[provider].defaultModel && `Default: ${AI_PROVIDERS[provider].defaultModel}`}
            {provider === "openrouter" && " — any model ID from openrouter.ai/models works."}
            {provider === "custom" && "The model name your server expects, e.g. gpt-4o-mini or llama3.1."}
          </small>
        </div>
        <div className="mb-3">
          <label htmlFor="aiFillBaseUrl" className="d-block">
            API URL
            <input
              id="aiFillBaseUrl"
              type="url"
              className="form-control"
              placeholder={AI_PROVIDERS[provider].defaultBaseUrl || "https://api.openai.com/v1"}
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
            />
          </label>
          <small className="form-text text-muted">
            {provider === "custom"
              ? "Any OpenAI-compatible server: OpenAI (https://api.openai.com/v1), Groq, Together, Ollama (http://localhost:11434/v1), LM Studio (http://localhost:1234/v1)… Either the base URL or the full /chat/completions URL works."
              : `Default: ${AI_PROVIDERS[provider].defaultBaseUrl}. Change it only to go through a proxy or gateway.`}
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          Save and use {AI_PROVIDERS[provider].label}
        </button>
        {showSaved && <span className="ms-3 text-success">Saved.</span>}
        {errorMessage && <span className="ms-3 text-danger">{errorMessage}</span>}
      </form>
      <hr />
      <p className="text-muted small">
        When you use AI Fill, the labels, names, options and current values of the visible form fields, plus your
        request, are sent to the selected AI provider. Voice input uses the browser&apos;s built-in speech recognition,
        which in Chrome is processed by Google.
      </p>
    </>
  );
};

export default AiFillPage;
