import * as data from "src/common/dummy-data";
import { DEFAULT_TELEPHONE_TEMPLATE } from "src/common/helpers";

class DataGenerator {
  public randomNumber(start: number, end: number, decimalPlaces = 0): number {
    const min = Math.ceil(start);
    const max = Math.floor(end);
    let result = Math.random() * (max - min + 1) + min;

    if (decimalPlaces > 0) {
      result = Number(result.toFixed(decimalPlaces));
      result = result > max ? max : result;
      return result;
    }

    return Math.floor(result);
  }

  public scrambledWord(minLength = 3, maxLength = 15): string {
    const wordLength = this.randomNumber(minLength, maxLength);
    let resultWord = "";
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

  public words(wordCount: number, maxLength = 0): string {
    let resultPhrase = "";
    let word = "";

    for (let i = 0; i < wordCount; i += 1) {
      word = data.wordBank[Math.floor(Math.random() * (data.wordBank.length - 1))];
      const phraseLength = resultPhrase.length;

      if (
        phraseLength === 0 ||
        resultPhrase.substring(phraseLength - 1, phraseLength) === "." ||
        resultPhrase.substring(phraseLength - 1, phraseLength) === "?"
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
    let returnValue = "";
    let currentCharacter = "";
    let ignore = false;

    for (; i < count; i += 1) {
      currentCharacter = template[i];

      if (currentCharacter === "]") {
        ignore = false;
        // eslint-disable-next-line no-continue
        continue;
      }

      if (currentCharacter === "[") {
        ignore = true;
        // eslint-disable-next-line no-continue
        continue;
      }

      if (ignore) {
        currentCharacter = "";
      }

      const alphabetsLength = data.alphabets.length;
      const consonantsLength = data.consonants.length;
      const vowelsLength = data.vowels.length;

      switch (currentCharacter) {
        case "L":
          returnValue += data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toUpperCase();
          break;

        case "l":
          returnValue += data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toLowerCase();
          break;

        case "D":
          returnValue +=
            Math.random() > 0.5
              ? data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toUpperCase()
              : data.alphabets[Math.floor(Math.random() * (alphabetsLength - 1))].toLowerCase();
          break;

        case "C":
          returnValue += data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toUpperCase();
          break;

        case "c":
          returnValue += data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toLowerCase();
          break;

        case "E":
          returnValue +=
            Math.random() > 0.5
              ? data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toUpperCase()
              : data.consonants[Math.floor(Math.random() * (consonantsLength - 1))].toLowerCase();
          break;

        case "V":
          returnValue += data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toUpperCase();
          break;

        case "v":
          returnValue += data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toLowerCase();
          break;

        case "F":
          returnValue +=
            Math.random() > 0.5
              ? data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toUpperCase()
              : data.vowels[Math.floor(Math.random() * (vowelsLength - 1))].toLowerCase();
          break;

        case "X":
          returnValue += this.randomNumber(1, 9);
          break;

        case "x":
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

    return resultPhrase.replace(/[?.!,;]?$/, ".");
  }

  public phrase(maxLength: number): string {
    const length = this.randomNumber(5, 20);
    const resultPhrase = this.words(length, maxLength);

    return resultPhrase.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
  }

  public website(): string {
    const scrambledWord = this.scrambledWord().toLowerCase();
    const randomDomain = data.domains[this.randomNumber(0, data.domains.length - 1)];
    return `https://www.${scrambledWord}${randomDomain}`;
  }

  public phoneNumber(template: string = DEFAULT_TELEPHONE_TEMPLATE): string {
    let i = 0;
    let telephone = "";

    for (; i < template.length; i += 1) {
      if (template[i] === "X") {
        telephone += this.randomNumber(1, 9);
      } else if (template[i] === "x") {
        telephone += this.randomNumber(0, 9);
      } else {
        telephone += template[i];
      }
    }

    return telephone;
  }

  public date(minimumDate?: Date, maximumDate?: Date): string {
    let randomYear: number;
    let randomMonth: number;
    let randomDay: number;

    if (minimumDate && maximumDate) {
      const randomDate = new Date(+minimumDate + Math.random() * (+maximumDate - +minimumDate));
      randomYear = randomDate.getFullYear();
      randomMonth = randomDate.getMonth() + 1;
      randomDay = randomDate.getDate();
    } else {
      randomYear = this.randomNumber(1970, new Date().getFullYear());
      randomMonth = this.randomNumber(1, 12);
      randomDay = this.randomNumber(1, 28);
    }

    const formattedYear = String(randomYear);
    const formattedMonth = `0${randomMonth}`.slice(-2);
    const formattedDay = `0${randomDay}`.slice(-2);
    return `${formattedYear}-${formattedMonth}-${formattedDay}`;
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

  public lastName(): string {
    return data.lastNames[this.randomNumber(0, data.lastNames.length - 1)];
  }

  public organizationName(): string {
    const partOne = this.lastName();
    const connector = Math.random() > 0.5 ? " and " : " ";
    const partTwo = this.lastName();
    const suffix = data.organizationSuffix[this.randomNumber(0, data.organizationSuffix.length - 1)];

    return `${partOne}${connector}${partTwo} ${suffix}`;
  }

  public color(): string {
    // 16777215 === FFFFFF in decimal
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")}`;
  }
}

export default DataGenerator;
