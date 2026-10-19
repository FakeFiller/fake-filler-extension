import { CallModel } from "src/service_worker/ai-client";
import { IPageContent } from "src/types";

const ANSWER_PROMPT = `You help a user with the web page they are looking at. You receive the page's title, address and visible text (or just the part the user selected), followed by the user's question.

- Answer from the page first. When the page does not contain the answer, use your own knowledge and say that you did.
- If there is no question, find the questions on the page (quiz or exam questions, form questions, exercises, FAQs) and answer each one in order: repeat the question briefly, then give the answer. For multiple choice, give the option exactly as it is written on the page. Add a one-line reason when it helps the user check the answer.
- If you are not sure of an answer, say so instead of guessing.
- Keep it short and plain: short paragraphs or a numbered list, no tables or headings.`;

const ANSWER_ALL_QUESTIONS = "(No question given. Answer the questions on this page.)";

async function RequestPageAnswer(question: string, page: IPageContent): Promise<string> {
  const scope = page.isSelection ? "selected text from the page" : "visible text of the page";
  const truncationNote = page.truncated ? "\n(The page is long, so only its beginning is included.)" : "";

  const { text } = await CallModel({
    system: ANSWER_PROMPT,
    user: `<page title="${page.title.replace(/"/g, "'")}" url="${page.url}">\n<!-- ${scope} -->\n${page.text}${truncationNote}\n</page>\n\n<question>\n${question.trim() || ANSWER_ALL_QUESTIONS}\n</question>`,
    effort: "medium",
  });

  return text;
}

export default RequestPageAnswer;
