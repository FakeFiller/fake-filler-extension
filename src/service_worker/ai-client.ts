// Sends one prompt to whichever AI provider the user configured (Claude, OpenRouter or any
// OpenAI-compatible API URL) and returns the reply text.

import { Anthropic } from "@anthropic-ai/sdk";

import {
  AI_PROVIDERS,
  GetAiFillSettings,
  GetChatCompletionsUrl,
  IsProviderConfigured,
} from "src/common/ai-fill-settings";
import { IAiProviderSettings } from "src/types";

export interface IModelRequest {
  system: string;
  user: string;
  // JSON schema the reply must follow; omit for a free-text answer.
  schema?: Record<string, unknown>;
  // How hard the model should think. Form filling is simple; answering questions about a page needs more care.
  effort: "low" | "medium";
}

export interface IModelReply {
  text: string;
  providerLabel: string;
}

function describeClaudeError(error: unknown): string {
  if (error instanceof Anthropic.AuthenticationError) {
    return "The Claude API key was rejected. Check it in the AI fill settings (⚙).";
  }
  if (error instanceof Anthropic.RateLimitError) {
    return "Claude API rate limit reached. Wait a moment and try again.";
  }
  if (error instanceof Anthropic.BadRequestError) {
    return `Claude rejected the request: ${error.message}`;
  }
  if (error instanceof Anthropic.APIError) {
    return `Claude API error ${error.status ?? ""}: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}

async function callClaude(credentials: IAiProviderSettings, request: IModelRequest): Promise<string> {
  // The key is the user's own and the request originates from the extension, so
  // direct browser access is intentional here.
  const client = new Anthropic({
    apiKey: credentials.apiKey,
    baseURL: credentials.baseUrl || undefined,
    dangerouslyAllowBrowser: true,
  });

  try {
    const response = await client.beta.messages.create({
      model: credentials.model,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: request.effort,
        ...(request.schema ? { format: { type: "json_schema" as const, schema: request.schema } } : {}),
      },
      system: request.system,
      messages: [{ role: "user", content: request.user }],
    });

    if (response.stop_reason === "refusal") {
      throw new Error("Claude declined this request.");
    }

    const text = response.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();
    if (!text) {
      throw new Error("Claude returned an empty reply.");
    }
    return text;
  } catch (error) {
    throw new Error(describeClaudeError(error));
  }
}

function describeHttpError(providerLabel: string, status: number, detail: string): string {
  switch (status) {
    case 401:
    case 403:
      return `The ${providerLabel} API key was rejected. Check it in the AI fill settings (⚙).`;
    case 402:
      return `Your ${providerLabel} account is out of credits.`;
    case 404:
      return `${providerLabel} returned 404. Check the API URL and model name in the AI fill settings (⚙).`;
    case 413:
      return `This page is too long for ${providerLabel}. Select the part you need and try again.`;
    case 429:
      return `${providerLabel} rate limit reached. Wait a moment and try again.`;
    default:
      return `${providerLabel} error ${status}${detail ? `: ${detail}` : ""}`;
  }
}

async function postChatCompletion(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
  providerLabel: string
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Title": "FillPilot AI" };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  let response: Response;
  try {
    response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  } catch {
    throw new Error(`Could not reach ${providerLabel} at ${url}. Check the API URL and your connection.`);
  }

  const data = await response.json().catch(() => null);
  // Some servers (OpenRouter among them) report errors inside a 200 response body.
  const status = response.ok && data && data.error ? Number(data.error.code) || 500 : response.status;
  return { status, data };
}

// Works with any server that speaks the OpenAI chat completions format: OpenRouter, OpenAI, Groq, Ollama, LM Studio…
async function callOpenAiCompatible(
  providerLabel: string,
  credentials: IAiProviderSettings,
  request: IModelRequest
): Promise<string> {
  const url = GetChatCompletionsUrl(credentials.baseUrl);
  const body: Record<string, unknown> = {
    model: credentials.model,
    messages: [
      { role: "system", content: request.system },
      { role: "user", content: request.user },
    ],
  };
  if (request.schema) {
    // Models that do not support structured outputs ignore this and follow the JSON instruction in the prompt.
    body.response_format = {
      type: "json_schema",
      json_schema: { name: "reply", strict: true, schema: request.schema },
    };
  }

  let { status, data } = await postChatCompletion(url, credentials.apiKey, body, providerLabel);

  // Some servers reject response_format outright; the prompt alone still asks for JSON, so retry without it.
  if ((status === 400 || status === 422) && body.response_format) {
    delete body.response_format;
    ({ status, data } = await postChatCompletion(url, credentials.apiKey, body, providerLabel));
  }

  if (status < 200 || status >= 300) {
    const detail = data && data.error ? String(data.error.message || data.error) : "";
    throw new Error(describeHttpError(providerLabel, status, detail));
  }

  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error(`${providerLabel} returned an empty reply.`);
  }
  return content.trim();
}

export async function CallModel(request: IModelRequest): Promise<IModelReply> {
  const settings = await GetAiFillSettings();
  const credentials = settings.providers[settings.provider];
  const providerLabel = AI_PROVIDERS[settings.provider].label;

  if (!IsProviderConfigured(settings.provider, credentials)) {
    throw new Error(
      settings.provider === "custom"
        ? "Set the API URL and model for your custom provider in the AI fill settings (⚙)."
        : `No ${providerLabel} API key set. Add one in the AI fill settings (⚙).`
    );
  }

  const text = AI_PROVIDERS[settings.provider].openAiCompatible
    ? await callOpenAiCompatible(providerLabel, credentials, request)
    : await callClaude(credentials, request);

  return { text, providerLabel };
}
