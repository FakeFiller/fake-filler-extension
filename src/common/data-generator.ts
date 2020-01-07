/// <reference path="../../index.d.ts" />

import RandExp from 'randexp';

import * as data from './dummy-data';
import { DEFAULT_TELEPHONE_TEMPLATE, SanitizeText } from './helpers';

class DataGenerator {
  private options: IFormFillerOptions;
  private previousUsername: string;
  private previousFirstName: string;
  private previousLastName: string;

  constructor(options: IFormFillerOptions) {
    this.options = options;
    this.previousUsername = '';
    this.previousFirstName = '';
    this.previousLastName = '';
  }

  public setPreviousUsername(username: string): void {
    this.previousUsername = username;
  }

  public setPreviousFirstName(firstName: string): void {
    this.previousFirstName = firstName;
  }

  public setPreviousLastName(lastName: string): void {
    this.previousLastName = lastName;
  }

  public randomNumber(start: number, end: number, decimalPlaces: number = 0): number {
    const result: number = Math.random() * (end - start + 1) + start;
    return Number(result.toFixed(decimalPlaces));
  }

  public scrambledWord(minLength: number = 3, maxLength: number = 15): string {
    const wordLength = this.randomNumber(minLength, maxLength);
    let resultWord = '';
    let odd = true;

    while (resultWord.length < wordLength) {
      const newSymbol = odd
        ? data.consonants[Math.floor(Math.random() * data.consonants.length)]
        : data.vowels[Math.floor(Math.random() * data.vowels.length)];

      odd = !odd;
      resultWord += newSymbol;
    }

    return resultWord;
  }

  public words(wordCount: number, maxLength: number = 0): string {
    let resultPhrase = '';
    let word = '';

    for (let i = 0; i < wordCount; i += 1) {
      word = data.wordBank[Math.floor(Math.random() * (data.wordBank.length - 1))];
      const phraseLength = resultPhrase.length;

      if (
        phraseLength === 0 ||
        resultPhrase.substring(phraseLength - 1, phraseLength) === '.' ||
        resultPhrase.substring(phraseLength - 1, phraseLength) === '?'
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

  public alphanumeric(template: string): string {
    const count = template.length;
    let i = 0;
    let returnValue = '';
    let currentCharacter = '';
    let ignore = false;

    for (; i < count; i += 1) {
      currentCharacter = template[i];

      if (currentCharacter === ']') {
        ignore = false;
        continue;
      }

      if (currentCharacter === '[') {
        ignore = true;
        continue;
      }

      if (ignore) {
        currentCharacter = '';
      }

      const alphabetsLength = data.alphabets.length;
      const consonantsLength = data.consonants.length;
      const vowelsLength = data.vowels.length;

      switch (currentCharacter) {
        case 'L':
          returnValue += data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toUpperCase();
          break;

        case 'l':
          returnValue += data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toLowerCase();
          break;

        case 'D':
          returnValue +=
            Math.random() > 0.5
              ? data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toUpperCase()
              : data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toLowerCase();
          break;

        case 'C':
          returnValue += data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toUpperCase();
          break;

        case 'c':
          returnValue += data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toLowerCase();
          break;

        case 'E':
          returnValue +=
            Math.random() > 0.5
              ? data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toUpperCase()
              : data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toLowerCase();
          break;

        case 'V':
          returnValue += data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toUpperCase();
          break;

        case 'v':
          returnValue += data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toLowerCase();
          break;

        case 'F':
          returnValue +=
            Math.random() > 0.5
              ? data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toUpperCase()
              : data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toLowerCase();
          break;

        case 'X':
          returnValue += this.randomNumber(1, 9);
          break;

        case 'x':
          returnValue += this.randomNumber(0, 9);
          break;

        default:
          returnValue += template[i];
          break;
      }
    }

    return returnValue;
  }

  public paragraph(minWords: number, maxWords: number, maxLength: number): string {
    const wordCount = this.randomNumber(minWords, maxWords);
    const resultPhrase = this.words(wordCount, maxLength);

    return resultPhrase.replace(/[?.!,;]?$/, '.');
  }

  public phrase(maxLength: number): string {
    const length = this.randomNumber(5, 20);
    const resultPhrase = this.words(length, maxLength);

    return resultPhrase.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
  }

  public password(): string {
    if (this.options.passwordSettings.mode === 'defined') {
      return this.options.passwordSettings.password;
    }

    const generatedPassword = this.scrambledWord(8, 8).toLowerCase();
    // tslint:disable-next-line:no-console
    console.info(generatedPassword);
    return generatedPassword;
  }

  public email(): string {
    const emailSettings = this.options.emailSettings;
    let username = '';

    switch (emailSettings.username) {
      case 'list':
        username = emailSettings.usernameList[Math.floor(Math.random() * emailSettings.usernameList.length)];
        break;

      case 'username':
        if (this.previousUsername.length > 0) {
          username = SanitizeText(this.previousUsername);
        }
        break;

      case 'name':
        if (this.previousFirstName.length > 0) {
          username = SanitizeText(this.previousFirstName);
        }
        if (this.previousLastName.length > 0) {
          if (username.length > 0) {
            username += `.${SanitizeText(this.previousLastName)}`;
          } else {
            username = SanitizeText(this.previousLastName);
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
      username = this.scrambledWord(4, 10).toLowerCase();
    }

    let domain = '';

    if (emailSettings.hostname === 'list') {
      const randomNumber = Math.floor(Math.random() * emailSettings.hostnameList.length);
      domain = emailSettings.hostnameList[randomNumber];
    }

    if (!domain || domain.length === 0) {
      domain = `${this.scrambledWord().toLowerCase()}.com`;
    }

    if (domain.indexOf('@') === -1) {
      domain = `@${domain}`;
    }

    return username + domain;
  }

  public website(): string {
    const scrambledWord = this.scrambledWord().toLowerCase();
    const randomDomain = data.domains[this.randomNumber(0, data.domains.length - 1)];
    return `https://www.${scrambledWord}${randomDomain}`;
  }

  public phoneNumber(template: string = DEFAULT_TELEPHONE_TEMPLATE): string {
    let i = 0;
    let telephone = '';

    for (; i < template.length; i += 1) {
      if (template[i] === 'X') {
        telephone += this.randomNumber(1, 9);
      } else if (template[i] === 'x') {
        telephone += this.randomNumber(0, 9);
      } else {
        telephone += template[i];
      }
    }

    return telephone;
  }

  public date(): string {
    const randomYear = this.randomNumber(1970, new Date().getFullYear());
    const randomMonth = `0${this.randomNumber(1, 12)}`.slice(-2);
    const randomDay = `0${this.randomNumber(1, 28)}`.slice(-2);
    return `${randomYear}-${randomMonth}-${randomDay}`;
  }

  public time(): string {
    const randomHour = `0${this.randomNumber(0, 23)}`.slice(-2);
    const randomMinute = `0${this.randomNumber(0, 59)}`.slice(-2);
    return `${randomHour}:${randomMinute}`;
  }

  public month(): string {
    return `0${this.randomNumber(1, 12)}`.slice(-2);
  }

  public year(): string {
    return String(this.randomNumber(1970, new Date().getFullYear()));
  }

  public weekNumber(): string {
    return `0${this.randomNumber(1, 52)}`.slice(-2);
  }

  public firstName(): string {
    return data.firstNames[this.randomNumber(0, data.firstNames.length - 1)];
  }

  public lastName(saveName: boolean = false): string {
    if (saveName) {
      this.previousLastName = data.lastNames[this.randomNumber(0, data.lastNames.length - 1)];
      return this.previousLastName;
    }

    return data.lastNames[this.randomNumber(0, data.lastNames.length - 1)];
  }

  public organizationName(): string {
    const partOne = this.lastName();
    const connector = Math.random() > 0.5 ? ' and ' : ' ';
    const partTwo = this.lastName();
    const suffix = data.organizationSuffix[this.randomNumber(0, data.organizationSuffix.length - 1)];

    return `${partOne}${connector}${partTwo} ${suffix}`;
  }

  public color(): string {
    const randomHexValue = `000000${Math.random()
      .toString(16)
      .slice(2, 8)
      .toUpperCase()}`.slice(-6);
    return `#${randomHexValue}`;
  }
}

export default DataGenerator;
