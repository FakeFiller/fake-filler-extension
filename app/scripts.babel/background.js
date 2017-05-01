import { GetFormFillerOptions, SaveFormFillerOptions, CreateContextMenus, GetMessage } from './form-filler/helpers';

const analyticsTrackingCode = 'UA-XXXXXXX-X'; // UA-9183424-4 / UA-XXXXXXX-X

function handleMessage(request, sender, sendResponse) {
  if (request === 'getOptions') {
    GetFormFillerOptions().then((result) => {
      sendResponse({
        options: result,
        analyticsTrackingCode,
      });
    });
    return true;
  }

  return null;
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'update') {
      try {
        const optionsString = localStorage.getItem('options');
        if (optionsString) {
          const options = JSON.parse(optionsString);
          if (options) {
            SaveFormFillerOptions(options);
            localStorage.removeItem('options');
          }
        }
      } catch (ex) {
        // eslint-disable-next-line no-alert
        alert(GetMessage('bgPage_errorMigratingOptions', [ex.message]));
      }
    }
  });
}

chrome.runtime.onMessage.addListener(handleMessage);

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    code: 'window.formFiller.fillAllInputs();',
    allFrames: true,
  });
});

GetFormFillerOptions().then((options) => {
  CreateContextMenus(options.enableContextMenu);
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === 'form-filler-all') {
    chrome.tabs.executeScript({
      code: 'window.formFiller.fillAllInputs();',
      allFrames: true,
    });
  }
  if (info.menuItemId === 'form-filler-form') {
    chrome.tabs.executeScript({
      code: 'window.formFiller.fillThisForm();',
      allFrames: true,
    });
  }
  if (info.menuItemId === 'form-filler-input') {
    chrome.tabs.executeScript({
      code: 'window.formFiller.fillThisInput();',
      allFrames: true,
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'fill_all_inputs') {
    chrome.tabs.executeScript({
      code: 'window.formFiller.fillAllInputs();',
      allFrames: true,
    });
  }
  if (command === 'fill_this_form') {
    chrome.tabs.executeScript({
      code: 'window.formFiller.fillThisForm();',
      allFrames: true,
    });
  }
  if (command === 'fill_this_input') {
    chrome.tabs.executeScript({
      code: 'window.formFiller.fillThisInput();',
      allFrames: true,
    });
  }
});
