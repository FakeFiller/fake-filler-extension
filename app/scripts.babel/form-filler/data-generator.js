/* eslint-disable no-console, class-methods-use-this */

import jQuery from 'jquery';
import moment from 'moment';
import RandExp from 'randexp';
import * as data from './dummy-data';

class DataGenerator {
  constructor(options) {
    this.options = options;
    this.previousValue = '';
    this.previousUsername = '';
    this.previousFirstName = '';
    this.previousLastName = '';
  }

  isAnyMatch(haystack, needles) {
    for (let i = 0, count = needles.length; i < count; i += 1) {
      if ((new RegExp(needles[i], 'i')).test(haystack)) {
        return true;
      }
    }
    return false;
  }

  sanitizeName(name) {
    return name.replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
  }

  generateNumber(start, end) {
    return Math.floor((Math.random() * ((end - start) + 1)) + start);
  }

  generateScrambledWord(minLength, maxLength, firstLetterLower) {
    let sanitizedMinLength = minLength;

    if (!sanitizedMinLength) {
      sanitizedMinLength = this.generateNumber(3, 15);
    }

    let wordLength = sanitizedMinLength;
    let resultWord = '';
    let odd = true;

    if (maxLength && maxLength > sanitizedMinLength) {
      wordLength = this.generateNumber(sanitizedMinLength, maxLength);
    }

    while (resultWord.length < wordLength) {
      const newSymbol = odd
        ? data.consonants[Math.floor(Math.random() * data.consonants.length)]
        : data.vowels[Math.floor(Math.random() * data.vowels.length)];

      odd = !odd;
      resultWord += newSymbol;
    }

    if (!firstLetterLower) {
      resultWord = resultWord[0].toUpperCase() + resultWord.substring(1);
    }

    return resultWord;
  }

  generateWords(wordCount, maxLength) {
    let i = 0;
    let resultPhrase = '';
    let word = '';

    for (; i < wordCount; i += 1) {
      word = data.wordBank[Math.floor(Math.random() * (data.wordBank.length - 1))];
      const phraseLength = resultPhrase.length;

      if (
        phraseLength === 0
        || resultPhrase.substring(phraseLength - 1, phraseLength) === '.'
        || resultPhrase.substring(phraseLength - 1, phraseLength) === '?'
      ) {
        word = word.substring(0, 1).toUpperCase() + word.substring(1, word.length);
      }

      resultPhrase += phraseLength > 0 ? ` ${word}` : word;
    }

    if (maxLength && maxLength > 0) {
      resultPhrase = resultPhrase.substring(0, maxLength);
    }

    return resultPhrase;
  }

  generateAlphanumeric(template) {
    const count = template.length;
    let i = 0;
    let returnValue = '';
    let currentCharacter = '';
    let ignore = false;

    for (; i < count; i += 1) {
      currentCharacter = template[i];

      if (currentCharacter === ']') {
        ignore = false;
        // eslint-disable-next-line no-continue
        continue;
      }

      if (currentCharacter === '[') {
        ignore = true;
        // eslint-disable-next-line no-continue
        continue;
      }

      if (ignore === true) {
        currentCharacter = '';
      }

      const alphabetsLength = data.alphabets.length;
      const consonantsLength = data.consonants.length;
      const vowelsLength = data.vowels.length;

      switch (currentCharacter) {
        case 'L':
          returnValue += data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))]
            .toUpperCase();
          break;

        case 'l':
          returnValue += data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))]
            .toLowerCase();
          break;

        case 'D':
          returnValue += (Math.random() > 0.5)
            ? data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toUpperCase()
            : data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toLowerCase();
          break;

        case 'C':
          returnValue += data.consonants[Math.floor(Math.random() * (consonantsLength - 1))]
            .toUpperCase();
          break;

        case 'c':
          returnValue += data.consonants[Math.floor(Math.random() * (consonantsLength - 1))]
            .toLowerCase();
          break;

        case 'E':
          returnValue += (Math.random() > 0.5)
            ? data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toUpperCase()
            : data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toLowerCase();
          break;

        case 'V':
          returnValue += data.vowels[Math.floor(Math.random() * (vowelsLength - 1))]
            .toUpperCase();
          break;

        case 'v':
          returnValue += data.vowels[Math.floor(Math.random() * (vowelsLength - 1))]
            .toLowerCase();
          break;

        case 'F':
          returnValue += (Math.random() > 0.5)
            ? data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toUpperCase()
            : data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toLowerCase();
          break;

        case 'X':
          returnValue += this.generateNumber(1, 9);
          break;

        case 'x':
          returnValue += this.generateNumber(0, 9);
          break;

        default:
          returnValue += template[i];
          break;
      }
    }

    return returnValue;
  }

  generateParagraph(minWords, maxWords, maxLength) {
    const wordCount = this.generateNumber(minWords, maxWords);
    const resultPhrase = this.generateWords(wordCount, maxLength);

    return resultPhrase.replace(/[?.!,;]?$/, '.');
  }

  generatePhrase(maxLength) {
    const length = this.generateNumber(5, 20);
    const resultPhrase = this.generateWords(length, maxLength);

    return resultPhrase.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
  }

  generatePassword() {
    if (this.options.passwordSettings.mode === 'random') {
      const password = this.generateScrambledWord(8).toLowerCase();
      console.info(`Generated Password: ${password}`);
      return password;
    }

    return this.options.passwordSettings.password;
  }

  generateEmail(emailSettings) {
    let username = '';

    switch (emailSettings.username) {
      case 'list':
        username = emailSettings.usernameList[
          Math.floor(Math.random() * (emailSettings.usernameList.length))
        ];
        break;

      case 'username':
        if (this.previousUsername.length > 0) {
          username = this.sanitizeName(this.previousUsername);
        }
        break;

      case 'name':
        if (this.previousFirstName.length > 0) {
          username = this.sanitizeName(this.previousFirstName);
        }
        if (this.previousLastName.length > 0) {
          if (username.length > 0) {
            username += `.${this.sanitizeName(this.previousLastName)}`;
          } else {
            username = this.sanitizeName(this.previousLastName);
          }
        }
        break;

      case 'regex':
        try {
          username = new RandExp(emailSettings.usernameRegEx).gen();
        } catch (ex) {
          // Do nothing.
        }
        break;

      default:
        break;
    }

    if (!username || username.length === 0) {
      username = this.generateScrambledWord(4, 10).toLowerCase();
    }

    let domain = '';

    if (emailSettings.hostname === 'list') {
      const randomNumber = Math.floor(Math.random() * (emailSettings.hostnameList.length));
      domain = emailSettings.hostnameList[randomNumber];
    }

    if (!domain || domain.length === 0) {
      domain = `${this.generateScrambledWord().toLowerCase()}.com`;
    }

    if (domain.indexOf('@') === -1) {
      domain = `@${domain}`;
    }

    return username + domain;
  }

  generateWebsite() {
    const scrambledWord = this.generateScrambledWord().toLowerCase();
    const randomDomain = data.domains[this.generateNumber(0, data.domains.length - 1)];
    return (`http://www.${scrambledWord}${randomDomain}`);
  }

  generatePhoneNumber(template = '+XXX-Xx-Xxxxxxx') {
    let i = 0;
    let telephone = '';

    for (; i < template.length; i += 1) {
      if (template[i] === 'X') {
        telephone += this.generateNumber(1, 9);
      } else if (template[i] === 'x') {
        telephone += this.generateNumber(0, 9);
      } else {
        telephone += template[i];
      }
    }

    return telephone;
  }

  generateDate() {
    const randomYear = this.generateNumber(1970, new Date().getFullYear());
    const randomMonth = (`0${this.generateNumber(1, 12)}`).slice(-2);
    const randomDay = (`0${this.generateNumber(1, 28)}`).slice(-2);
    return `${randomYear}-${randomMonth}-${randomDay}`;
  }

  generateTime() {
    const randomHour = (`0${this.generateNumber(0, 23)}`).slice(-2);
    const randomMinute = (`0${this.generateNumber(0, 59)}`).slice(-2);
    return `${randomHour}:${randomMinute}`;
  }

  generateMonth() {
    return (`0${this.generateNumber(1, 12)}`).slice(-2);
  }

  generateYear() {
    return this.generateNumber(1970, new Date().getFullYear());
  }

  generateFirstName() {
    return data.firstNames[this.generateNumber(0, data.firstNames.length - 1)];
  }

  generateLastName(saveName) {
    if (saveName) {
      this.previousLastName = data.lastNames[this.generateNumber(0, data.lastNames.length - 1)];
      return this.previousLastName;
    }

    return data.lastNames[this.generateNumber(0, data.lastNames.length - 1)];
  }

  generateOrganizationName() {
    const partOne = this.generateLastName();
    const connector = (Math.random() > 0.5) ? ' and ' : ' ';
    const partTwo = this.generateLastName();
    const suffix = data.organizationSuffix[
      this.generateNumber(0, data.organizationSuffix.length - 1)
    ];

    return `${partOne}${connector}${partTwo} ${suffix}`;
  }

  getSanitizedElementName(element) {
    let sanitizedElementName = '';

    if (this.options.fieldMatchSettings.matchName) {
      sanitizedElementName += ` ${this.sanitizeName(element.name)}`;
    }

    if (this.options.fieldMatchSettings.matchId) {
      sanitizedElementName += ` ${this.sanitizeName(element.id)}`;
    }

    if (this.options.fieldMatchSettings.matchClass) {
      sanitizedElementName += ` ${this.sanitizeName(element.className)}`;
    }

    if (this.options.fieldMatchSettings.matchLabel) {
      const label = jQuery(`label[for='${element.id}']`);
      if (label.length === 1) {
        sanitizedElementName += ` ${this.sanitizeName(label.html())}`;
      }
    }

    return sanitizedElementName;
  }

  getFieldFromElement(elementName, matchTypes = []) {
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

    return null;
  }

  getRandomDataForField(field, element) {
    switch (field.type) {
      case 'username':
        this.previousUsername = this.generateScrambledWord(5, 10, true);
        return this.previousUsername;

      case 'first-name':
        this.previousFirstName = this.generateFirstName();
        return this.previousFirstName;

      case 'last-name':
        this.previousLastName = this.generateLastName();
        return this.previousLastName;

      case 'full-name':
        this.previousFirstName = this.generateFirstName();
        this.previousLastName = this.generateLastName();
        return `${this.previousFirstName} ${this.previousLastName}`;

      case 'email':
        return this.generateEmail(this.options.emailSettings);

      case 'organization':
        return this.generateOrganizationName();

      case 'telephone':
        return this.generatePhoneNumber(field.template);

      case 'number':
        return this.generateNumber(field.min, field.max);

      case 'date':
        return moment(this.generateDate()).format(field.template);

      case 'url':
        return this.generateWebsite();

      case 'text':
        return this.generateParagraph(field.min, field.max, element.maxLength);

      case 'alphanumeric':
        return this.generateAlphanumeric(field.template);

      case 'regex':
        return new RandExp(field.template, field.caseInSensitive ? 'i' : '').gen();

      case 'randomized-list':
        return field.list[this.generateNumber(0, field.list.length - 1)];

      default:
        return this.generatePhrase(element.maxLength);
    }
  }

  generateValueByType(element, currentElementName, currentField) {
    const elementName = currentElementName || this.getSanitizedElementName(element);
    const field = currentField || this.getFieldFromElement(elementName) || { type: 'unknown' };
    return this.getRandomDataForField(field, element);
  }

  selectRandomRadio(name) {
    let i = 0;
    const list = [];
    const elements = document.getElementsByName(name);

    for (; i < elements.length; i += 1) {
      if (elements[i].type === 'radio') {
        list.push(elements[i]);
      }
    }

    const radioElement = list[Math.floor(Math.random() * list.length)];

    if (this.options.triggerClickEvents) {
      jQuery(radioElement).click();
    } else {
      radioElement.checked = true;
    }
  }

  shouldIgnoreField(element) {
    if (this.options.ignoreHiddenFields && jQuery(element).is(':hidden')) {
      return true;
    }

    const elementName = this.getSanitizedElementName(element);
    if (this.isAnyMatch(elementName, this.options.ignoredFields)) {
      return true;
    }

    if (this.options.ignoreFieldsWithContent === true) {
      if (element.type === 'checkbox') {
        return false;
      }

      if (element.type === 'radio') {
        if (jQuery(`input[name="${element.name}"]:checked`).length > 0) {
          return true;
        }
      }

      if (element.type !== 'checkbox' && element.type !== 'radio') {
        if (jQuery(element).val() && jQuery(element).val().trim().length > 0) {
          return true;
        }
      }
    }

    return false;
  }

  fillInputTagElement(theElement) {
    const element = theElement;

    if (this.shouldIgnoreField(element)) {
      return;
    }

    const jQueryElement = jQuery(element);
    let elementType = jQueryElement.attr('type');

    if (elementType !== undefined) {
      elementType = elementType.toLowerCase();
    }

    if (elementType === 'checkbox') {
      if (this.isAnyMatch(element.name.toLowerCase(), this.options.agreeTermsFields)) {
        element.checked = true;
      } else if (this.options.triggerClickEvents) {
        jQueryElement.prop('checked', (Math.random() > 0.5)).click();
      } else {
        element.checked = (Math.random() > 0.5) ? 'checked' : '';
      }
    } else if (elementType === 'date') {
      element.value = this.generateDate();
    } else if (elementType === 'datetime') {
      element.value = `${this.generateDate()}T${this.generateTime()}Z`;
    } else if (elementType === 'datetime-local') {
      element.value = `${this.generateDate()}T${this.generateTime()}`;
    } else if (elementType === 'time') {
      element.value = this.generateTime();
    } else if (elementType === 'month') {
      element.value = `${this.generateYear()}-${this.generateMonth()}`;
    } else if (elementType === 'week') {
      const randomYear = this.generateYear();
      const randomWeek = (`0${this.generateNumber(1, 52)}`).slice(-2);
      element.value = `${randomYear}-W${randomWeek}`;
    } else if (elementType === 'email') {
      if (this.isAnyMatch(element.name.toLowerCase(), this.options.confirmFields)) {
        element.value = this.previousValue;
      } else {
        this.previousValue = this.generateEmail(this.options.emailSettings);
        element.value = this.previousValue;
      }
    } else if (elementType === 'number' || elementType === 'range') {
      let min = 1;
      let max = 100;

      if (element.min) {
        min = parseInt(element.min, 10);
      }
      if (element.max) {
        max = parseInt(element.max, 10);
      }

      const numberOptions = this.getFieldFromElement(this.getSanitizedElementName(element), ['number']);
      if (numberOptions) {
        min = numberOptions.min;
        max = numberOptions.max;
      }

      element.value = this.generateNumber(min, max);
    } else if (elementType === 'password') {
      if (this.isAnyMatch(element.name.toLowerCase(), this.options.confirmFields)) {
        element.value = this.previousValue;
      } else {
        this.previousValue = this.generatePassword();
        element.value = this.previousValue;
      }
    } else if (elementType === 'radio') {
      this.selectRandomRadio(element.name);
    } else if (elementType === 'tel') {
      const elementName = this.getSanitizedElementName(element);
      const telephoneOptions = this.getFieldFromElement(elementName);

      if (telephoneOptions) {
        element.value = this.generateValueByType(element, elementName, telephoneOptions);
      } else {
        element.value = this.generatePhoneNumber();
      }
    } else if (elementType === 'url') {
      element.value = this.generateWebsite();
    } else if (elementType === 'color') {
      const randomHexValue = (`000000${Math.random().toString(16).slice(2, 8).toUpperCase()}`).slice(-6);
      element.value = `#${randomHexValue}`;
    } else if (elementType === 'search') {
      element.value = this.generateWords(1);
    } else if (elementType === 'text' || elementType === '' || elementType === undefined) {
      if (this.isAnyMatch(element.name.toLowerCase(), this.options.confirmFields)) {
        element.value = this.previousValue;
      } else {
        this.previousValue = this.generateValueByType(element);
        element.value = this.previousValue;
      }
    }

    if (elementType !== 'checkbox' && elementType !== 'radio' && this.options.triggerClickEvents) {
      if (window.Event && window.dispatchEvent) {
        element.dispatchEvent(new Event('input'));
        element.dispatchEvent(new Event('change'));
        element.dispatchEvent(new Event('blur'));
      }
    }
  }

  fillTextAreaTagElement(theElement) {
    const element = theElement;

    if (this.shouldIgnoreField(element)) {
      return;
    }

    const fieldMatches = ['text', 'alphanumeric', 'regex', 'randomized-list'];
    const field = this.getFieldFromElement(this.getSanitizedElementName(element), fieldMatches) || { min: 10, max: 20 };

    element.value = this.getRandomDataForField(field, element);

    if (this.options.triggerClickEvents) {
      if (window.Event && window.dispatchEvent) {
        element.dispatchEvent(new Event('input'));
        element.dispatchEvent(new Event('change'));
        element.dispatchEvent(new Event('blur'));
      }
    }
  }

  fillSelectTagElement(theElement) {
    const element = theElement;

    if (this.shouldIgnoreField(element)) {
      return;
    }

    if (element.options && element.options.length > 1) {
      const elementName = this.getSanitizedElementName(element);
      const field = this.getFieldFromElement(elementName);
      let value;
      let valueExists = false;

      // First determine if there is a matching type for this field.
      if (field) {
        // Get a value according the field type.
        value = this.generateValueByType(element, elementName, field);

        // Check if the value exists in the select element.
        for (let index = 0; index < element.options.length; index += 1) {
          if (element.options[index].value === value) {
            valueExists = true;
            break;
          }
        }
      }

      if (valueExists) {
        jQuery(element).val(value);
      } else {
        // Use the default random option item selection because there was
        // no field type or value found.
        const optionsCount = element.options.length;

        // Use generic random selection process.
        if (element.multiple) {
          const count = this.generateNumber(1, optionsCount);

          for (let i = 0; i < optionsCount; i += 1) {
            if (!element.options[i].disabled) {
              element.options[i].selected = false;
            }
          }

          for (let i = 0; i < count; i += 1) {
            if (!element.options[i].disabled) {
              element.options[this.generateNumber(1, optionsCount - 1)].selected = true;
            }
          }
        } else {
          let iteration = 0;

          while (iteration < optionsCount) {
            const randomOption = Math.floor(Math.random() * (optionsCount - 1)) + 1;

            if (!element.options[randomOption].disabled) {
              element.options[randomOption].selected = true;
              break;
            } else {
              iteration += 1;
            }
          }
        }
      }

      if (this.options.triggerClickEvents) {
        if (window.Event && window.dispatchEvent) {
          element.dispatchEvent(new Event('input'));
          element.dispatchEvent(new Event('change'));
          element.dispatchEvent(new Event('blur'));
        }
      }
    }
  }
}

export default DataGenerator;
