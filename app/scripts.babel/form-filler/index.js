/* eslint-disable no-console */

import DataGenerator from './data-generator';

class FormFiller {
  constructor(options, trackingCode) {
    this.options = options;
    this.trackingCode = trackingCode;
    this.dataGenerator = new DataGenerator(options);
  }

  setClickedElement(element) {
    this.clickedElement = element;
  }

  fillAllInputs() {
    document.querySelectorAll('input:enabled:not([readonly])').forEach((element) => {
      this.dataGenerator.fillInputTagElement(element);
    });

    document.querySelectorAll('textarea:enabled:not([readonly])').forEach((element) => {
      this.dataGenerator.fillTextAreaTagElement(element);
    });

    document.querySelectorAll('select:enabled:not([readonly])').forEach((element) => {
      this.dataGenerator.fillSelectTagElement(element);
    });

    document.querySelectorAll('[contenteditable]').forEach((element) => {
      if (element.isContentEditable) {
        // eslint-disable-next-line no-param-reassign
        element.textContent = this.dataGenerator.generateParagraph(5, 100);
      }
    });
  }

  fillThisInput() {
    const element = this.clickedElement || document.activeElement;

    if (element) {
      const tagName = element.tagName.toLowerCase();

      if (tagName === 'input') {
        this.dataGenerator.fillInputTagElement(element);
      } else if (tagName === 'textarea') {
        this.dataGenerator.fillTextAreaTagElement(element);
      } else if (tagName === 'select') {
        this.dataGenerator.fillSelectTagElement(element);
      } else if (element.isContentEditable) {
        element.textContent = this.dataGenerator.generateParagraph(5, 100);
      }
    }

    this.setClickedElement(null);
  }

  fillThisForm() {
    const theElement = this.clickedElement || document.activeElement;

    if (theElement && theElement.tagName.toLowerCase() !== 'body') {
      const form = theElement.closest('form');

      if (form) {
        form.querySelectorAll('input:enabled:not([readonly])').forEach((element) => {
          this.dataGenerator.fillInputTagElement(element);
        });

        form.querySelectorAll('textarea:enabled:not([readonly])').forEach((element) => {
          this.dataGenerator.fillTextAreaTagElement(element);
        });

        form.querySelectorAll('select:enabled:not([readonly])').forEach((element) => {
          this.dataGenerator.fillSelectTagElement(element);
        });

        form.querySelectorAll('[contenteditable]').forEach((element) => {
          if (element.isContentEditable) {
            // eslint-disable-next-line no-param-reassign
            element.textContent = this.dataGenerator.generateParagraph(5, 100);
          }
        });
      }
    }

    this.setClickedElement(null);
  }
}

export default FormFiller;
