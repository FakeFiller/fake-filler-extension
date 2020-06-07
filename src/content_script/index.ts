import FakeFiller from "src/common/fake-filler";
import { IFakeFillerOptions, MessageRequest } from "src/types";

declare global {
  interface Window {
    fakeFiller: FakeFiller;
  }
}

function initialize(options: IFakeFillerOptions) {
  const url = window.location.href;
  let profileIndex = -1;

  if (url && options.profiles && options.profiles.length > 0) {
    for (let i = 0; i < options.profiles.length; i += 1) {
      const currentProfile = options.profiles[i];

      if (url.match(new RegExp(currentProfile.urlMatch))) {
        profileIndex = i;
        chrome.runtime.sendMessage({ type: "foundProfile", data: currentProfile });
        break;
      }
    }
  }

  window.fakeFiller = new FakeFiller(options, profileIndex);
}

function handleMessage(request: MessageRequest): boolean | null {
  switch (request.type) {
    case "receiveNewOptions": {
      const options = request.data as IFakeFillerOptions;
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
