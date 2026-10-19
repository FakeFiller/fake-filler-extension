import { IPageContent } from "src/types";

// About 30k tokens: enough for long articles and multi-page forms while keeping requests fast and affordable.
const MAX_PAGE_CHARACTERS = 120000;
// A selection shorter than this is probably accidental, so the whole page is used instead.
export const MIN_SELECTION_CHARACTERS = 20;

// Reads what the user can see on the page, or only the text they selected (pass "" for the whole page).
// Input values (including passwords) are not part of innerText, so they are never sent.
export default function GetPageContent(selectedText: string): IPageContent {
  const selection = selectedText.trim();
  const isSelection = selection.length >= MIN_SELECTION_CHARACTERS;
  const fullText = isSelection ? selection : (document.body?.innerText || "").trim();
  // Collapse the runs of blank lines that layouts produce.
  const text = fullText.replace(/\n{3,}/g, "\n\n");

  return {
    title: document.title,
    url: window.location.href,
    text: text.slice(0, MAX_PAGE_CHARACTERS),
    isSelection,
    truncated: text.length > MAX_PAGE_CHARACTERS,
  };
}
