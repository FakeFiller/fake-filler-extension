import { CallModel } from "src/service_worker/ai-client";
import { IAiFieldDescriptor, IAiFillResult } from "src/types";

const SYSTEM_PROMPT = `You fill in web forms for a user. You receive a JSON list of the form fields that are currently on the page, and the user's spoken or typed request describing what to put in them.

Return a value only for the fields the user's request covers. Leave every other field out of "fills" so the page keeps what it already has. Do not invent values the user did not give, unless the user explicitly asks you to make up or generate data.

Field rules:
- Use the field's "ref" exactly as given.
- select / select-multiple / radio: the value must be one of the field's option "value"s. Pick the option that best matches what the user said. For select-multiple, join several option values with commas.
- checkbox: "true" to tick, "false" to untick.
- date: YYYY-MM-DD. time: HH:MM. datetime-local: YYYY-MM-DDTHH:MM. month: YYYY-MM.
- Respect what a field's label asks for, e.g. split a full name into first and last name fields when the form has both.

The request may be a speech transcript, so expect spelled-out punctuation ("at" / "dot" in email addresses) and homophones, and normalise them.

Put a one-sentence summary in "message", and mention anything you could not place.

Respond with only a JSON object of the form {"fills": [{"ref": "...", "value": "..."}], "message": "..."}.`;

const FILL_SCHEMA = {
  type: "object",
  properties: {
    fills: {
      type: "array",
      items: {
        type: "object",
        properties: {
          ref: { type: "string" },
          value: { type: "string" },
        },
        required: ["ref", "value"],
        additionalProperties: false,
      },
    },
    message: { type: "string" },
  },
  required: ["fills", "message"],
  additionalProperties: false,
};

function buildUserMessage(instruction: string, fields: IAiFieldDescriptor[]): string {
  return `<form_fields>\n${JSON.stringify(fields)}\n</form_fields>\n\n<request>\n${instruction}\n</request>`;
}

// Models without structured output support sometimes wrap the JSON in a code fence or add a sentence around it.
function parseFillJson(text: string, providerLabel: string): IAiFillResult {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  try {
    if (start === -1 || end <= start) {
      throw new Error("no JSON object");
    }
    return JSON.parse(text.substring(start, end + 1)) as IAiFillResult;
  } catch {
    throw new Error(`${providerLabel} returned a response that could not be read as form values.`);
  }
}

async function RequestAiFill(instruction: string, fields: IAiFieldDescriptor[]): Promise<IAiFillResult> {
  const { text, providerLabel } = await CallModel({
    system: SYSTEM_PROMPT,
    user: buildUserMessage(instruction, fields),
    schema: FILL_SCHEMA,
    effort: "low",
  });
  const result = parseFillJson(text, providerLabel);

  const validRefs = new Set(fields.map((field) => field.ref));
  return {
    fills: (Array.isArray(result.fills) ? result.fills : []).filter(
      (fill) => fill && validRefs.has(fill.ref) && typeof fill.value === "string"
    ),
    message: typeof result.message === "string" ? result.message : "",
  };
}

export default RequestAiFill;
