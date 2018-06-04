/* eslint-disable no-console */

import jQuery from 'jquery';
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

  fillAllInputs(context) {

    context = context || document;

    jQuery('input:enabled:not([readonly])', context).each((index, element) => {
      this.fillInput(element);
    });

    jQuery('textarea:enabled:not([readonly])', context).each((index, element) => {
      this.fillInput(element);
    });

    jQuery('select:enabled:not([readonly])', context).each((index, element) => {
      this.fillInput(element);
    });

    jQuery('[contenteditable]', context).each((index, element) => {
      this.fillInput(element);
    });
  }

  fillInput(element) {
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
      var evt = document.createEvent('HTMLEvents');
      evt.initEvent('change', true, true);
      element.dispatchEvent(evt);
      if (!element.trigger) {
        element = jQuery(element);
      }
      element.trigger('change');
    }
  }

  fillThisInput() {
    const element = this.clickedElement || document.activeElement;

    this.fillInput(element);

    this.setClickedElement(null);
  }

  fillThisForm() {
    const theElement = this.clickedElement || document.activeElement;

    if (theElement && theElement.tagName.toLowerCase() !== 'body') {
      const form = jQuery(theElement).closest('form');

      if (form.length > 0) {
        this.fillAllInputs(form[0]);
      }
    }

    this.setClickedElement(null);
  }
}

export default FormFiller;
