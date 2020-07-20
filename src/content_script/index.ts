import FakeFiller from "src/common/fake-filler";
import { IFakeFillerOptions, MessageRequest } from "src/types";

declare global {
  interface Window {
    fakeFiller: FakeFiller;
  }
}

function initialize(options: IFakeFillerOptions) {
  window.fakeFiller = new FakeFiller(options);
}

function handleMessage(request: MessageRequest): boolean | null {
  switch (request.type) {
    case "receiveNewOptions": {
      const options = request.data.options as IFakeFillerOptions;
      initialize(options);
      return true;
    }

    default:
      return null;
  }
}

document.addEventListener("mousedown", (event) => {
  if (event.button === 2 && window.fakeFiller) {
    window.fakeFiller.setClickedElement(event.target as HTMLElement);
  }
});

chrome.runtime.sendMessage({ type: "getOptions" }, (response) => {
  const options = response.options as IFakeFillerOptions;
  initialize(options);
});

chrome.runtime.onMessage.addListener(handleMessage);
