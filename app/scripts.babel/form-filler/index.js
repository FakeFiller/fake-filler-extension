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

  fillAllInputs() {
    console.log('fillAllInputs');

    jQuery('input:enabled:not([readonly])').each((index, element) => {
      this.dataGenerator.fillInputTagElement(element);
    });

    jQuery('textarea:enabled:not([readonly])').each((index, element) => {
      this.dataGenerator.fillTextAreaTagElement(element);
    });

    jQuery('select:enabled:not([readonly])').each((index, element) => {
      this.dataGenerator.fillSelectTagElement(element);
    });

    // TODO: Handle contentEditable elements.

    // jQuery('[contenteditable]').each((index, element) => {
    //   if (element.isContentEditable) {
    //     element.innerHTML = this.dataGenerator.generateParagraph(5, 100);
    //   }
    // });
  }

  fillThisInput() {
    console.log('fillThisInput');

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
        // TODO: Handle contentEditable elements.
      }
    }

    this.setClickedElement(null);
  }

  fillThisForm() {
    console.info('fillThisForm');

    const theElement = this.clickedElement || document.activeElement;

    if (theElement && theElement.tagName.toLowerCase() !== 'body') {
      const form = jQuery(theElement).closest('form');

      if (form.length > 0) {
        jQuery('input:enabled:not([readonly])', form[0]).each((index, element) => {
          this.dataGenerator.fillInputTagElement(element);
        });

        jQuery('textarea:enabled:not([readonly])', form[0]).each((index, element) => {
          this.dataGenerator.fillTextAreaTagElement(element);
        });

        jQuery('select:enabled:not([readonly])', form[0]).each((index, element) => {
          this.dataGenerator.fillSelectTagElement(element);
        });

        // TODO: Handle contentEditable elements.

        // jQuery('[contenteditable]', form[0]).each((index, element) => {
        //   if (element.isContentEditable) {
        //     element.innerHTML = this.dataGenerator.generateParagraph(5, 100);
        //   }
        // });
      }
    }

    this.setClickedElement(null);
  }

  trackEvent(category, action) {
    if (this.trackingCode) {
      console.log(`Tracked Event - Category: ${category}, Action: ${action}`);
    }
  }
}

export default FormFiller;
