import { CreateContextMenus, GetFormFillerOptions, GetMessage, SaveFormFillerOptions } from '../common/helpers';

function handleMessage(request: string, sender: {}, sendResponse: Function): boolean | null {
  if (request === 'getOptions') {
    GetFormFillerOptions().then(result => {
      sendResponse({ options: result });
    });
    return true;
  }

  return null;
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(details => {
    if (details.reason === 'update') {
      try {
        if (details.previousVersion && details.previousVersion.startsWith('2.8')) {
          GetFormFillerOptions().then(options => {
            options.defaultMaxLength = 20;
            SaveFormFillerOptions(options);
          });
        }
      } catch (ex) {
        alert(GetMessage('bgPage_errorMigratingOptions', [ex.message]));
      }
    }
  });
}

chrome.runtime.onMessage.addListener(handleMessage);

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    code: 'window.formFiller && window.formFiller.fillAllInputs();',
    allFrames: true,
  });
});

GetFormFillerOptions().then(options => {
  CreateContextMenus(options.enableContextMenu);
});

chrome.contextMenus.onClicked.addListener(info => {
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

chrome.commands.onCommand.addListener(command => {
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
