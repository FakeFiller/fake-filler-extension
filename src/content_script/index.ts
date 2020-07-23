import FakeFiller from "src/common/fake-filler";
import { IFakeFillerOptions, MessageRequest } from "src/types";

declare global {
  interface Window {
    fakeFiller: FakeFiller;
  }
}

function initialize(options: IFakeFillerOptions, isProEdition: boolean) {
  let profileIndex = -1;
  const url = window.location.href;

  chrome.runtime.sendMessage({ type: "clearProfileBadge" }, () => chrome.runtime.lastError);

  if (isProEdition && url && options.profiles && options.profiles.length > 0) {
    for (let i = 0; i < options.profiles.length; i += 1) {
      const currentProfile = options.profiles[i];

      if (url.match(new RegExp(currentProfile.urlMatch))) {
        profileIndex = i;
        chrome.runtime.sendMessage({ type: "setProfileBadge", data: currentProfile }, () => chrome.runtime.lastError);
        break;
      }
    }
  }

  window.fakeFiller = new FakeFiller(options, profileIndex);
}

function handleMessage(request: MessageRequest): boolean | null {
  switch (request.type) {
    case "receiveNewOptions": {
      const options = request.data.options as IFakeFillerOptions;
      const isProEdition = request.data.isProEdition as boolean;
      initialize(options, isProEdition);
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
  const isProEdition = response.isProEdition as boolean;
  initialize(options, isProEdition);
});

chrome.runtime.onMessage.addListener(handleMessage);
