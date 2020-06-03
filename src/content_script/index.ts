import FormFiller from 'src/common/form-filler';
import { IFormFillerOptions, MessageRequest } from 'src/types';

declare global {
  interface Window {
    formFiller: FormFiller;
  }
}

function initialize(options: IFormFillerOptions) {
  window.formFiller = new FormFiller(options);
}

function handleMessage(request: MessageRequest): boolean | null {
  switch (request.type) {
    case 'receiveNewOptions': {
      const options = request.data as IFormFillerOptions;
      initialize(options);
      return true;
    }

    default:
      return null;
  }
}

document.addEventListener('mousedown', event => {
  if (event.button === 2 && window.formFiller) {
    window.formFiller.setClickedElement(event.target as HTMLElement);
  }
});

chrome.runtime.sendMessage({ type: 'getOptions' }, response => {
  const options = response.options as IFormFillerOptions;
  initialize(options);
});

chrome.runtime.onMessage.addListener(handleMessage);
