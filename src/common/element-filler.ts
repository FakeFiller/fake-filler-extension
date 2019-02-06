// @ts-ignore
import cssesc from 'cssesc';

import moment from 'moment';
import RandExp from 'randexp';

import DataGenerator from './data-generator';
import { SanitizeText } from './helpers';

type FillableElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

class ElementFiller {
  private generator: DataGenerator;
  private options: IFormFillerOptions;

  private previousValue: string;
  private previousPassword: string;
  private previousUsername: string;
  private previousFirstName: string;
  private previousLastName: string;

  constructor(options: IFormFillerOptions) {
    this.options = options;
    this.generator = new DataGenerator(options);

    this.previousValue = '';
    this.previousPassword = '';
    this.previousUsername = '';
    this.previousFirstName = '';
    this.previousLastName = '';
  }

  private fireEvents(element: FillableElement): void {
    ['input', 'click', 'change', 'blur'].forEach(event => {
      const changeEvent = new Event(event, { bubbles: true, cancelable: true });
      element.dispatchEvent(changeEvent);
    });
  }

  private isAnyMatch(haystack: string, needles: string[]): boolean {
    for (let i = 0, count = needles.length; i < count; i += 1) {
      if (new RegExp(needles[i], 'i').test(haystack)) {
        return true;
      }
    }
    return false;
  }

  private isElementVisible(element: FillableElement): boolean {
    if (!element.offsetHeight && !element.offsetWidth) {
      return false;
    }
    if (window.getComputedStyle(element).visibility === 'hidden') {
      return false;
    }
    return true;
  }

  private shouldIgnoreElement(element: FillableElement): boolean {
    if (['button', 'submit', 'reset', 'file', 'hidden', 'image'].indexOf(element.type) > -1) {
      return true;
    }

    // Ignore any invisible elements.
    if (this.options.ignoreHiddenFields && !this.isElementVisible(element)) {
      return true;
    }

    // Ignore any elements that match an item in the the "ignoredFields" array.
    const elementName = this.getElementName(element);
    if (this.isAnyMatch(elementName, this.options.ignoredFields)) {
      return true;
    }

    if (this.options.ignoreFieldsWithContent) {
      // A radio button list will be ignored if it has been selected previously.
      if (element.type === 'radio') {
        if (document.querySelectorAll(`input[name="${element.name}"]:checked`).length > 0) {
          return true;
        }
      }

      // All elements excluding radio buttons and check boxes will be ignored if they have a value.
      if (element.type !== 'checkbox' && element.type !== 'radio') {
        const elementValue = element.value;
        if (elementValue && elementValue.trim().length > 0) {
          return true;
        }
      }
    }

    // If all above checks have failed, we do not need to ignore this element.
    return false;
  }

  private selectRandomRadio(name: string): void {
    let i = 0;
    const list = [];
    const elements = document.getElementsByName(name) as NodeListOf<HTMLInputElement>;

    for (; i < elements.length; i += 1) {
      if (elements[i].type === 'radio') {
        list.push(elements[i]);
      }
    }

    const radioElement = list[Math.floor(Math.random() * list.length)];
    radioElement.checked = true;
    this.fireEvents(radioElement);
  }

  private findCustomField(elementName: string, matchTypes: CustomFieldTypes[] = []): ICustomField | undefined {
    const doMatchType = matchTypes.length > 0;

    for (let i = 0; i < this.options.fields.length; i += 1) {
      if (this.isAnyMatch(elementName, this.options.fields[i].match)) {
        if (doMatchType) {
          for (let j = 0; j < matchTypes.length; j += 1) {
            if (this.options.fields[i].type === matchTypes[j]) {
              return this.options.fields[i];
            }
          }
        } else {
          return this.options.fields[i];
        }
      }
    }

    return undefined;
  }

  private getElementName(element: FillableElement): string {
    let normalizedName = '';

    if (this.options.fieldMatchSettings.matchName) {
      normalizedName += ` ${SanitizeText(element.name)}`;
    }

    if (this.options.fieldMatchSettings.matchId) {
      normalizedName += ` ${SanitizeText(element.id)}`;
    }

    if (this.options.fieldMatchSettings.matchClass) {
      normalizedName += ` ${SanitizeText(element.className)}`;
    }

    if (this.options.fieldMatchSettings.matchPlaceholder) {
      if (typeof element === typeof HTMLInputElement || typeof element === typeof HTMLTextAreaElement) {
        normalizedName += ` ${SanitizeText((<HTMLInputElement>element).placeholder)}`;
      }
    }

    if (this.options.fieldMatchSettings.matchLabel) {
      const normalizedId = cssesc(element.id);
      const labels = document.querySelectorAll(`label[for='${normalizedId}']`);
      for (let i = 0; i < labels.length; i += 1) {
        normalizedName += ` ${SanitizeText(labels[i].innerHTML)}`;
      }
    }

    return normalizedName;
  }

  private getElementMaxLength(element: HTMLInputElement | HTMLTextAreaElement | undefined): number {
    if (element && element.maxLength && element.maxLength > 0) {
      return element.maxLength;
    }
    return this.options.defaultMaxLength;
  }

  private generateDummyDataForCustomField(
    customField: ICustomField | undefined,
    element: HTMLInputElement | HTMLTextAreaElement | undefined = undefined,
  ): string {
    // If the current element has a pattern attribute, we use that to generate random data and
    // skip everything else.
    const elementPattern = (element && element.getAttribute('pattern')) || null;
    if (elementPattern) {
      return new RandExp(elementPattern).gen();
    }

    if (!customField) {
      return this.generator.phrase(this.getElementMaxLength(element));
    }

    switch (customField.type) {
      case 'username':
        this.previousUsername = this.generator.scrambledWord(5, 10).toLowerCase();
        this.generator.setPreviousUsername(this.previousUsername);
        return this.previousUsername;

      case 'first-name':
        this.previousFirstName = this.generator.firstName();
        this.generator.setPreviousFirstName(this.previousFirstName);
        return this.previousFirstName;

      case 'last-name':
        this.previousLastName = this.generator.lastName();
        this.generator.setPreviousLastName(this.previousLastName);
        return this.previousLastName;

      case 'full-name':
        this.previousFirstName = this.generator.firstName();
        this.previousLastName = this.generator.lastName();
        this.generator.setPreviousFirstName(this.previousFirstName);
        this.generator.setPreviousLastName(this.previousLastName);
        return `${this.previousFirstName} ${this.previousLastName}`;

      case 'email':
        return this.generator.email();

      case 'organization':
        return this.generator.organizationName();

      case 'telephone':
        return this.generator.phoneNumber(customField.template);

      case 'number':
        return String(this.generator.randomNumber(customField.min || 1, customField.max || 100));

      case 'date':
        return moment(this.generator.date()).format(customField.template);

      case 'url':
        return this.generator.website();

      case 'text':
        const minWords = customField.min || 10;
        const maxWords = customField.max || 30;
        let maxLength = customField.maxLength || this.options.defaultMaxLength;
        if (element && element.maxLength && element.maxLength < maxLength) {
          maxLength = element.maxLength;
        }
        return this.generator.paragraph(minWords, maxWords, maxWords);

      case 'alphanumeric':
        return this.generator.alphanumeric(customField.template || '');

      case 'regex':
        return new RandExp(customField.template || '').gen();

      case 'randomized-list':
        if (customField.list && customField.list.length > 0) {
          return customField.list[this.generator.randomNumber(0, customField.list.length - 1)];
        }
        return '';

      default:
        return this.generator.phrase(this.getElementMaxLength(element));
    }
  }

  public fillInputElement(element: HTMLInputElement): void {
    if (this.shouldIgnoreElement(element)) {
      return;
    }

    let fireEvent = true;
    const elementType = element.type ? element.type.toLowerCase() : '';

    switch (elementType) {
      case 'checkbox':
        if (this.isAnyMatch(element.name.toLowerCase(), this.options.agreeTermsFields)) {
          element.checked = true;
        } else {
          element.checked = Math.random() > 0.5;
        }
        break;

      case 'date':
        element.value = this.generator.date();
        break;

      case 'datetime':
        element.value = `${this.generator.date()}T${this.generator.time()}Z`;
        break;

      case 'datetime-local':
        element.value = `${this.generator.date()}T${this.generator.time()}`;
        break;

      case 'time':
        element.value = this.generator.time();
        break;

      case 'month':
        element.value = `${this.generator.year()}-${this.generator.month()}`;
        break;

      case 'week':
        element.value = `${this.generator.year()}-W${this.generator.weekNumber()}`;
        break;

      case 'email':
        if (this.isAnyMatch(element.name.toLowerCase(), this.options.confirmFields)) {
          element.value = this.previousValue;
        } else {
          this.previousValue = this.generator.email();
          element.value = this.previousValue;
        }
        break;

      case 'number':
      case 'range':
        let min = element.min ? parseInt(element.min, 10) : 1;
        let max = element.max ? parseInt(element.max, 10) : 100;

        const numberCustomField = this.findCustomField(this.getElementName(element), ['number']);

        if (numberCustomField) {
          min = numberCustomField.min || min;
          max = numberCustomField.max || max;

          if (element.min && element.max) {
            min = Number(element.min) > min ? Number(element.min) : min;
            max = Number(element.max) < max ? Number(element.max) : max;
          }
        }

        element.value = String(this.generator.randomNumber(min, max));
        break;

      case 'password':
        if (this.isAnyMatch(element.name.toLowerCase(), this.options.confirmFields)) {
          element.value = this.previousPassword;
        } else {
          this.previousPassword = this.generator.password();
          element.value = this.previousPassword;
        }
        break;

      case 'radio':
        this.selectRandomRadio(element.name);
        fireEvent = false;
        break;

      case 'tel':
        const telephoneCustomField = this.findCustomField(this.getElementName(element), ['telephone']);

        if (telephoneCustomField) {
          element.value = this.generateDummyDataForCustomField(telephoneCustomField, element);
        } else {
          // If the telephone element has a pattern attribute, we use that instead of the custom field.
          const elementPattern = element.getAttribute('pattern') || null;
          if (elementPattern) {
            element.value = new RandExp(elementPattern).gen();
          } else {
            element.value = this.generator.phoneNumber();
          }
        }
        break;

      case 'url':
        element.value = this.generator.website();
        break;

      case 'color':
        element.value = this.generator.color();
        break;

      case 'search':
        element.value = this.generator.words(1);
        break;

      default:
        if (this.isAnyMatch(element.name.toLowerCase(), this.options.confirmFields)) {
          element.value = this.previousValue;
        } else {
          const customField = this.findCustomField(this.getElementName(element));
          this.previousValue = this.generateDummyDataForCustomField(customField, element);
          element.value = this.previousValue;
        }
        break;
    }

    if (this.options.triggerClickEvents && fireEvent) {
      this.fireEvents(element);
    }
  }

  public fillTextAreaElement(element: HTMLTextAreaElement): void {
    if (this.shouldIgnoreElement(element)) {
      return;
    }

    const matchingCustomField = this.findCustomField(this.getElementName(element), [
      'text',
      'alphanumeric',
      'regex',
      'randomized-list',
    ]);

    element.value = this.generateDummyDataForCustomField(matchingCustomField, element);

    if (this.options.triggerClickEvents) {
      this.fireEvents(element);
    }
  }

  public fillSelectElement(element: HTMLSelectElement): void {
    if (this.shouldIgnoreElement(element)) {
      return;
    }

    if (!element.options || element.options.length < 1) {
      return;
    }

    let valueExists = false;
    let valueSelected = false;
    const matchingCustomField = this.findCustomField(this.getElementName(element));

    // If a custom field exists for this element, we use that to determine the value.
    // However, if the generated value is not present in the options list we will select a random one.
    if (matchingCustomField) {
      const value = this.generateDummyDataForCustomField(matchingCustomField);

      for (let i = 0; i < element.options.length; i += 1) {
        if (element.options[i].value === value) {
          element.options[i].selected = true;
          valueExists = true;
          valueSelected = true;
          break;
        }
      }
    }

    if (!valueExists) {
      const optionsCount = element.options.length;

      if (element.multiple) {
        // Unselect any existing options.
        for (let i = 0; i < optionsCount; i += 1) {
          if (!element.options[i].disabled) {
            element.options[i].selected = false;
          }
        }

        // Select a random number of options.
        const numberOfOptionsToSelect = this.generator.randomNumber(1, optionsCount);

        for (let i = 0; i < numberOfOptionsToSelect; i += 1) {
          if (!element.options[i].disabled) {
            element.options[this.generator.randomNumber(1, optionsCount - 1)].selected = true;
            valueSelected = true;
          }
        }
      } else {
        // Select a random option as long as it is not disabled.
        // If it is disabled, continue finding a random option that can be selected.

        let iterations = 0;

        while (iterations < optionsCount) {
          const randomOptionIndex = Math.floor(Math.random() * (optionsCount - 1)) + 1;

          if (!element.options[randomOptionIndex].disabled) {
            element.options[randomOptionIndex].selected = true;
            valueSelected = true;
            break;
          } else {
            iterations += 1;
          }
        }
      }
    }

    if (valueSelected && this.options.triggerClickEvents) {
      this.fireEvents(element);
    }
  }

  public fillContentEditableElement(element: HTMLElement): void {
    if ((<HTMLElement>element).isContentEditable) {
      element.textContent = this.generator.paragraph(5, 100, this.options.defaultMaxLength);
    }
  }
}

export default ElementFiller;
