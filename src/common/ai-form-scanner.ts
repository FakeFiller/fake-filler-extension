import { IAiFieldDescriptor, IAiFillInstruction } from "src/types";

const REF_ATTRIBUTE = "data-fake-filler-ref";
const MAX_FIELDS = 250;
const MAX_TEXT_LENGTH = 120;

type AiFillableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLElement;

const IGNORED_INPUT_TYPES = ["button", "submit", "reset", "file", "hidden", "image"];

// Custom widgets that behave like checkboxes and radio buttons without being <input> elements
// (Google Forms, Angular Material, many design systems).
const ARIA_CHECKABLE_SELECTOR =
  "[role='checkbox'], [role='switch'], [role='radio'], [role='menuitemcheckbox'], [role='menuitemradio']";
const ARIA_RADIO_SELECTOR = "[role='radio'], [role='menuitemradio']";
const CONTROL_SELECTOR = `input, select, textarea, ${ARIA_CHECKABLE_SELECTOR}`;

function cleanText(text: string | null | undefined): string {
  return (text || "").replace(/\s+/g, " ").trim().substring(0, MAX_TEXT_LENGTH);
}

function isVisible(element: HTMLElement): boolean {
  if (!element.offsetHeight && !element.offsetWidth && element.getClientRects().length === 0) {
    return false;
  }
  return window.getComputedStyle(element).visibility !== "hidden";
}

function isNativeCheckable(element: Element): element is HTMLInputElement {
  return element instanceof HTMLInputElement && (element.type === "checkbox" || element.type === "radio");
}

function isAriaCheckable(element: Element): boolean {
  return !(element instanceof HTMLInputElement) && element.matches(ARIA_CHECKABLE_SELECTOR);
}

function isAriaRadio(element: Element): boolean {
  return !(element instanceof HTMLInputElement) && element.matches(ARIA_RADIO_SELECTOR);
}

// Styled checkboxes and radios usually hide the real input and show a label or wrapper instead.
// Returns the element a person would actually see and click, or null if nothing about the control is visible.
function getVisibleTarget(element: HTMLElement): HTMLElement | null {
  if (isVisible(element)) {
    return element;
  }

  if (isNativeCheckable(element)) {
    const labels = element.labels ? Array.from(element.labels) : [];
    const visibleLabel = labels.find((label) => isVisible(label));
    if (visibleLabel) {
      return visibleLabel;
    }

    // A wrapper that holds only this control, e.g. <div class="toggle"><input hidden><span></span></div>.
    let ancestor = element.parentElement;
    for (let depth = 0; ancestor && depth < 3; depth += 1) {
      if (ancestor.querySelectorAll(CONTROL_SELECTOR).length > 1) {
        break;
      }
      if (isVisible(ancestor)) {
        return ancestor;
      }
      ancestor = ancestor.parentElement;
    }
  }

  return null;
}

function belongsToOtherField(node: Element): boolean {
  return node.matches(`label, ${CONTROL_SELECTOR}`) || !!node.querySelector(CONTROL_SELECTOR);
}

// Text that follows a checkbox or radio without a <label>, as in `<input type="checkbox"> I agree`.
function getFollowingText(element: HTMLElement): string {
  let text = "";
  for (let node = element.nextSibling; node && text.length < MAX_TEXT_LENGTH; node = node.nextSibling) {
    if (node instanceof Element && belongsToOtherField(node)) {
      break;
    }
    text += ` ${node.textContent || ""}`;
  }
  return cleanText(text);
}

function getReferencedText(element: Element): string {
  const parts: string[] = [];
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) {
    parts.push(cleanText(ariaLabel));
  }
  (element.getAttribute("aria-labelledby") || "").split(" ").forEach((id) => {
    const labelElement = id ? document.getElementById(id) : null;
    if (labelElement) {
      parts.push(cleanText(labelElement.textContent));
    }
  });
  return parts.filter(Boolean).join(" / ");
}

// The question a group of checkboxes or radios answers, e.g. "Interests" for ☐ Sports ☐ Music.
function getGroupLabel(element: HTMLElement): string {
  const group = element.closest("fieldset, [role='radiogroup'], [role='group'], [role='list'], [role='listbox']");
  if (!group) {
    return "";
  }

  if (group instanceof HTMLFieldSetElement) {
    const legend = group.querySelector("legend");
    return legend ? cleanText(legend.textContent) : getReferencedText(group);
  }

  return getReferencedText(group);
}

function getLabelText(element: HTMLElement): string {
  const parts: string[] = [];

  if (element.id) {
    document.querySelectorAll(`label[for="${CSS.escape(element.id)}"]`).forEach((label) => {
      parts.push(cleanText(label.textContent));
    });
  }

  const wrappingLabel = element.closest("label");
  if (wrappingLabel) {
    parts.push(cleanText(wrappingLabel.textContent));
  }

  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) {
    parts.push(cleanText(ariaLabel));
  }

  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    labelledBy.split(" ").forEach((id) => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        parts.push(cleanText(labelElement.textContent));
      }
    });
  }

  // ARIA widgets often carry their option text inside themselves or in a data attribute.
  if (parts.length === 0 && isAriaCheckable(element)) {
    parts.push(cleanText(element.textContent) || cleanText(element.getAttribute("data-value")));
  }

  // Checkboxes and radios usually have their text after them.
  if (parts.length === 0 && (isNativeCheckable(element) || isAriaCheckable(element))) {
    parts.push(getFollowingText(element));
  }

  // Fall back to the nearest preceding text, which covers forms that place a caption in a sibling element.
  // Stop at anything that is or holds another control, since that text describes a different field.
  if (parts.every((part) => !part)) {
    let previous = element.previousElementSibling;
    while (previous && !belongsToOtherField(previous) && !cleanText(previous.textContent)) {
      previous = previous.previousElementSibling;
    }

    if (previous && !belongsToOtherField(previous)) {
      parts.push(cleanText(previous.textContent));
    } else if (!previous && element.parentElement) {
      const parent = element.parentElement;
      if (parent.querySelectorAll(CONTROL_SELECTOR).length === 1) {
        parts.push(cleanText(parent.textContent));
      }
    }
  }

  return Array.from(new Set(parts.filter((part) => part.length > 0))).join(" / ");
}

// The value the AI should answer with for an ARIA radio or checkbox option.
function getAriaOptionValue(element: HTMLElement): string {
  return cleanText(element.getAttribute("data-value")) || getLabelText(element);
}

function isAriaChecked(element: Element): boolean {
  return element.getAttribute("aria-checked") === "true";
}

function getAriaRadioGroup(element: HTMLElement): HTMLElement {
  return (element.closest("[role='radiogroup']") as HTMLElement) || element.parentElement || element;
}

function getAriaRadios(group: HTMLElement): HTMLElement[] {
  return Array.from(group.querySelectorAll<HTMLElement>(ARIA_RADIO_SELECTOR)).filter(
    (radio) => radio.getAttribute("aria-disabled") !== "true"
  );
}

// Prefixes a checkbox's own text with the question it belongs to.
function withGroupLabel(element: HTMLElement, ownLabel: string): string {
  const groupLabel = getGroupLabel(element);
  return groupLabel && groupLabel !== ownLabel ? `${groupLabel} › ${ownLabel}` : ownLabel;
}

// Refs stay on the elements between scans, so new ones come from a counter rather than the scan position:
// a position-based ref would collide with one given out by an earlier scan of a different container or of a
// form that has changed since. The random prefix keeps refs unique if the content script is injected again.
const REF_PREFIX = Math.random().toString(36).substring(2, 5);
let nextRefNumber = 0;

function assignRef(element: Element): string {
  let ref = element.getAttribute(REF_ATTRIBUTE);
  if (!ref) {
    ref = `${REF_PREFIX}${nextRefNumber}`;
    nextRefNumber += 1;
    element.setAttribute(REF_ATTRIBUTE, ref);
  }
  return ref;
}

// Values of password fields never leave the page; the AI only learns whether one is already filled in.
function getSafeCurrentValue(element: HTMLInputElement | HTMLTextAreaElement): string {
  if (element instanceof HTMLInputElement && element.type === "password") {
    return element.value ? "(filled in, hidden)" : "";
  }
  return element.value;
}

function getFillableElements(container: Document | HTMLElement): AiFillableElement[] {
  const elements = container.querySelectorAll<AiFillableElement>(
    `input:not(:disabled):not([readonly]), textarea:not(:disabled):not([readonly]), select:not(:disabled), [contenteditable='true'], [contenteditable=''], ${ARIA_CHECKABLE_SELECTOR}`
  );

  return Array.from(elements).filter((element) => {
    if (element instanceof HTMLInputElement && IGNORED_INPUT_TYPES.includes(element.type)) {
      return false;
    }
    if (isAriaCheckable(element) && element.getAttribute("aria-disabled") === "true") {
      return false;
    }
    // Hidden checkboxes and radios still count when their styled label or wrapper is visible.
    return getVisibleTarget(element) !== null;
  });
}

export function GetAiScanContainer(): Document | HTMLElement {
  const active = document.activeElement;
  if (active && active.tagName.toLowerCase() !== "body") {
    const form = active.closest("form");
    if (form) {
      return form;
    }
  }
  return document;
}

export function ScanFormFields(container: Document | HTMLElement = document): IAiFieldDescriptor[] {
  const fields: IAiFieldDescriptor[] = [];
  const seenRadioGroups = new Set<string | Element>();

  getFillableElements(container).forEach((element) => {
    if (fields.length >= MAX_FIELDS) {
      return;
    }

    const ref = assignRef(element);

    if (element instanceof HTMLSelectElement) {
      fields.push({
        ref,
        kind: element.multiple ? "select-multiple" : "select",
        label: getLabelText(element),
        name: element.name || element.id,
        currentValue: element.value,
        options: Array.from(element.options)
          .filter((option) => !option.disabled)
          .map((option) => ({ value: option.value, text: cleanText(option.text) })),
      });
      return;
    }

    if (isAriaRadio(element)) {
      // ARIA radios are grouped by their radiogroup, like native radios are grouped by name.
      const group = getAriaRadioGroup(element);
      if (seenRadioGroups.has(group)) {
        return;
      }
      seenRadioGroups.add(group);

      const radios = getAriaRadios(group);
      radios.forEach((radio) => assignRef(radio));
      const checked = radios.find((radio) => isAriaChecked(radio));
      fields.push({
        ref,
        kind: "radio",
        label: getReferencedText(group) || getGroupLabel(element),
        name: group.id,
        currentValue: checked ? getAriaOptionValue(checked) : "",
        options: radios.map((radio) => ({ value: getAriaOptionValue(radio), text: getLabelText(radio) })),
      });
      return;
    }

    if (isAriaCheckable(element)) {
      fields.push({
        ref,
        kind: "checkbox",
        label: withGroupLabel(element, getLabelText(element)),
        name: element.id,
        currentValue: String(isAriaChecked(element)),
      });
      return;
    }

    if (element instanceof HTMLInputElement && element.type === "radio") {
      // Radio buttons are sent to the model as one field per group.
      const groupKey = element.name || ref;
      if (seenRadioGroups.has(groupKey)) {
        return;
      }
      seenRadioGroups.add(groupKey);

      const radios = element.name
        ? Array.from(
            container.querySelectorAll<HTMLInputElement>(`input[type='radio'][name="${CSS.escape(element.name)}"]`)
          )
        : [element];
      radios.forEach((radio) => assignRef(radio));

      const checked = radios.find((radio) => radio.checked);
      fields.push({
        ref,
        kind: "radio",
        label: getGroupLabel(element) || element.name,
        name: element.name,
        currentValue: checked ? checked.value : "",
        options: radios.map((radio) => ({ value: radio.value, text: getLabelText(radio) })),
      });
      return;
    }

    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      const isCheckbox = element instanceof HTMLInputElement && element.type === "checkbox";
      fields.push({
        ref,
        kind: element instanceof HTMLTextAreaElement ? "textarea" : element.type || "text",
        label: isCheckbox ? withGroupLabel(element, getLabelText(element)) : getLabelText(element),
        name: element.name || element.id,
        placeholder: element.getAttribute("placeholder") || undefined,
        currentValue: isCheckbox ? String((element as HTMLInputElement).checked) : getSafeCurrentValue(element),
      });
      return;
    }

    fields.push({
      ref,
      kind: "contenteditable",
      label: getLabelText(element),
      name: element.id,
      currentValue: cleanText(element.textContent),
    });
  });

  return fields;
}

function fireEvents(element: HTMLElement): void {
  ["input", "change", "blur"].forEach((eventName) => {
    element.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true }));
  });
}

// Frameworks such as React track the value through the prototype setter, so assigning
// `element.value` directly would be overwritten on the next render.
function setNativeValue(element: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  const prototype = element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(prototype, "value")?.set;
  if (setter) {
    setter.call(element, value);
  } else {
    element.value = value;
  }
}

function matchesOption(candidate: { value: string; text: string }, wanted: string): boolean {
  const normalizedWanted = wanted.trim().toLowerCase();
  const texts = [candidate.text, ...candidate.text.split(" / ")].map((text) => text.trim().toLowerCase());
  return candidate.value.toLowerCase() === normalizedWanted || texts.includes(normalizedWanted);
}

function applySelect(element: HTMLSelectElement, value: string): boolean {
  const wantedValues = element.multiple ? value.split(",").map((part) => part.trim()) : [value];
  let selectedAny = false;

  Array.from(element.options).forEach((option) => {
    const isWanted = wantedValues.some((wanted) =>
      matchesOption({ value: option.value, text: cleanText(option.text) }, wanted)
    );
    if (element.multiple) {
      option.selected = isWanted;
    }
    if (isWanted && !selectedAny) {
      if (!element.multiple) {
        element.value = option.value;
      }
      selectedAny = true;
    }
  });

  return selectedAny;
}

const TYPABLE_INPUT_TYPES = ["", "text", "email", "tel", "url", "search", "password", "number"];

export interface IApplyAiFillsOptions {
  // Type values key by key with pauses, the way a person would, instead of setting them instantly.
  humanLike: boolean;
  // Called after each field so the caller can show progress.
  onProgress?: (done: number, total: number) => void;
  // Called around each field so the caller can highlight the one being filled.
  onFieldStart?: (element: HTMLElement) => void;
  onFieldEnd?: (element: HTMLElement) => void;
  // Checked between keystrokes so typing stops when the panel is closed.
  shouldStop?: () => boolean;
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function pause(min: number, max: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, randomBetween(min, max)));
}

// Delay before the next keystroke: mostly quick, slower after a word or punctuation, with the odd hesitation.
function keystrokeDelay(previousChar: string): Promise<void> {
  if (Math.random() < 0.03) {
    return pause(300, 700);
  }
  if (/[\s.,@\-_]/.test(previousChar)) {
    return pause(120, 260);
  }
  return pause(45, 140);
}

function dispatchKey(element: HTMLElement, type: "keydown" | "keypress" | "keyup", key: string): void {
  element.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true, cancelable: true, composed: true }));
}

function dispatchInput(element: HTMLElement, inputType: string, data: string | null): void {
  element.dispatchEvent(new InputEvent("input", { inputType, data, bubbles: true, composed: true }));
}

function pointerClick(element: HTMLElement): void {
  ["pointerdown", "mousedown", "pointerup", "mouseup"].forEach((eventName) => {
    const EventType =
      eventName.startsWith("pointer") && typeof PointerEvent !== "undefined" ? PointerEvent : MouseEvent;
    element.dispatchEvent(new EventType(eventName, { bubbles: true, cancelable: true, composed: true }));
  });
}

// Scrolls to the field (or the styled label standing in for a hidden input) and, unless told otherwise,
// presses on it the way a mouse would.
async function moveToField(element: HTMLElement, press = true): Promise<void> {
  (getVisibleTarget(element) || element).scrollIntoView({ block: "center", behavior: "smooth" });
  await pause(250, 600);
  if (press) {
    pointerClick(element);
  }
  element.focus();
}

// Clicks an ARIA checkbox or radio like a mouse would, then falls back to the Space key, which the
// ARIA pattern requires widgets to support, if the click did not change its state.
function activateAriaCheckable(element: HTMLElement): void {
  const before = isAriaChecked(element);
  pointerClick(element);
  element.click();

  if (isAriaChecked(element) === before) {
    element.focus();
    dispatchKey(element, "keydown", " ");
    dispatchKey(element, "keyup", " ");
  }
}

function leaveField(element: HTMLElement): void {
  element.dispatchEvent(new Event("change", { bubbles: true }));
  element.blur();
}

async function typeIntoField(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
  shouldStop: () => boolean
): Promise<void> {
  await moveToField(element);

  // Clear what is there first, like select-all + delete.
  if (element.value) {
    dispatchKey(element, "keydown", "Backspace");
    setNativeValue(element, "");
    dispatchInput(element, "deleteContentBackward", null);
    dispatchKey(element, "keyup", "Backspace");
    await pause(150, 350);
  }

  let typed = "";
  for (let i = 0; i < value.length; i += 1) {
    if (shouldStop()) {
      return;
    }

    const char = value[i];
    const key = char === "\n" ? "Enter" : char;
    dispatchKey(element, "keydown", key);
    dispatchKey(element, "keypress", key);
    typed += char;
    setNativeValue(element, typed);
    dispatchInput(element, char === "\n" ? "insertLineBreak" : "insertText", char);
    dispatchKey(element, "keyup", key);

    await keystrokeDelay(char);
  }

  leaveField(element);
}

async function typeIntoContentEditable(element: HTMLElement, value: string, shouldStop: () => boolean): Promise<void> {
  await moveToField(element);
  element.textContent = "";

  for (let i = 0; i < value.length; i += 1) {
    if (shouldStop()) {
      return;
    }
    dispatchKey(element, "keydown", value[i]);
    element.textContent += value[i];
    dispatchInput(element, "insertText", value[i]);
    dispatchKey(element, "keyup", value[i]);

    await keystrokeDelay(value[i]);
  }

  element.blur();
}

function findAriaRadio(element: HTMLElement, value: string): HTMLElement | undefined {
  return getAriaRadios(getAriaRadioGroup(element)).find((radio) =>
    matchesOption({ value: getAriaOptionValue(radio), text: getLabelText(radio) }, value)
  );
}

function findRadio(element: HTMLInputElement, value: string): HTMLInputElement | undefined {
  // Look only in the radio's own form: another form on the page may use the same group name.
  const scope: Document | HTMLFormElement = element.form || document;
  const radios = element.name
    ? Array.from(scope.querySelectorAll<HTMLInputElement>(`input[type='radio'][name="${CSS.escape(element.name)}"]`))
    : [element];

  return radios.find((radio) => matchesOption({ value: radio.value, text: getLabelText(radio) }, value));
}

function getElementByRef(ref: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`[${REF_ATTRIBUTE}="${CSS.escape(ref)}"]`);
}

// Fills one field. Returns false when the value could not be applied (e.g. no matching option).
async function applyFill(element: HTMLElement, value: string, options: IApplyAiFillsOptions): Promise<boolean> {
  const { humanLike } = options;
  const shouldStop = options.shouldStop || (() => false);

  if (element instanceof HTMLSelectElement) {
    if (humanLike) {
      await moveToField(element);
      await pause(300, 700);
    }
    if (!applySelect(element, value)) {
      return false;
    }
    dispatchInput(element, "insertReplacementText", null);
    leaveField(element);
    return true;
  }

  if (isAriaRadio(element)) {
    const target = findAriaRadio(element, value);
    if (!target) {
      return false;
    }
    if (humanLike) {
      await moveToField(target, false);
    }
    if (!isAriaChecked(target)) {
      activateAriaCheckable(target);
    }
    return true;
  }

  if (isAriaCheckable(element)) {
    const shouldCheck = /^(true|yes|1|on|checked)$/i.test(value.trim());
    if (humanLike) {
      await moveToField(element, false);
    }
    if (isAriaChecked(element) !== shouldCheck) {
      activateAriaCheckable(element);
    }
    return true;
  }

  // A real click toggles checkboxes and radios natively and fires the events frameworks listen for,
  // even when a styled label hides the input itself.
  if (element instanceof HTMLInputElement && element.type === "radio") {
    const target = findRadio(element, value);
    if (!target) {
      return false;
    }
    if (humanLike) {
      await moveToField(target, false);
    }
    if (!target.checked) {
      target.click();
    }
    return true;
  }

  if (element instanceof HTMLInputElement && element.type === "checkbox") {
    const shouldCheck = /^(true|yes|1|on|checked)$/i.test(value.trim());
    if (humanLike) {
      await moveToField(element, false);
    }
    if (element.checked !== shouldCheck) {
      element.click();
    }
    return true;
  }

  if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
    const isTypable = element instanceof HTMLTextAreaElement || TYPABLE_INPUT_TYPES.includes(element.type);
    if (humanLike && isTypable) {
      await typeIntoField(element, value, shouldStop);
      return true;
    }

    // Date, time, colour and similar pickers take a complete value, so they are set in one go.
    if (humanLike) {
      await moveToField(element);
      await pause(300, 700);
    } else {
      element.focus();
    }
    setNativeValue(element, value);
    fireEvents(element);
    return true;
  }

  if (element.isContentEditable) {
    if (humanLike) {
      await typeIntoContentEditable(element, value, shouldStop);
    } else {
      element.textContent = value;
      fireEvents(element);
    }
    return true;
  }

  return false;
}

export async function ApplyAiFills(instructions: IAiFillInstruction[], options: IApplyAiFillsOptions): Promise<number> {
  let appliedCount = 0;

  for (let i = 0; i < instructions.length; i += 1) {
    if (options.shouldStop && options.shouldStop()) {
      break;
    }

    const element = getElementByRef(instructions[i].ref);
    if (element) {
      if (options.onFieldStart) {
        options.onFieldStart(getVisibleTarget(element) || element);
      }

      if (await applyFill(element, instructions[i].value, options)) {
        appliedCount += 1;
      }
      if (options.onFieldEnd) {
        options.onFieldEnd(getVisibleTarget(element) || element);
      }
    }

    if (options.onProgress) {
      options.onProgress(i + 1, instructions.length);
    }

    if (options.humanLike && i < instructions.length - 1) {
      await pause(250, 650);
    }
  }

  return appliedCount;
}
