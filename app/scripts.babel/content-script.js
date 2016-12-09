import FormFiller from './form-filler/';

document.addEventListener('mousedown', (event) => {
  if (event.button === 2 && window.formFiller) {
    window.formFiller.setClickedElement(event.target);
  }
});

chrome.runtime.sendMessage('getOptions', (response) => {
  if (!window.formFiller) {
    window.formFiller = new FormFiller(response.options, response.analyticsTrackingCode);
  }
});
