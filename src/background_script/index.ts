/* eslint-disable no-param-reassign */

import {
  CreateContextMenus,
  GetFakeFillerOptions,
  GetMessage,
  SaveFakeFillerOptions,
  DEFAULT_EMAIL_CUSTOM_FIELD,
} from "src/common/helpers";
import { MessageRequest, IProfile } from "src/types";

function handleMessage(
  request: MessageRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (options: any) => void
): boolean | null {
  switch (request.type) {
    case "getOptions": {
      GetFakeFillerOptions().then((result) => {
        sendResponse({ options: result });
      });
      return true;
    }

    case "foundProfile": {
      const profile = request.data as IProfile;
      chrome.browserAction.setBadgeText({ text: "⭐", tabId: sender.tab?.id });
      chrome.browserAction.setBadgeBackgroundColor({ color: "#7f8ea1", tabId: sender.tab?.id });
      chrome.browserAction.setTitle({
        title: `${GetMessage("browserActionTitle")}\n${GetMessage("matchedProfile")}: ${profile.name}`,
        tabId: sender.tab?.id,
      });
      return true;
    }

    default:
      return null;
  }
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "update") {
      try {
        if (details.previousVersion && details.previousVersion.startsWith("2.8")) {
          GetFakeFillerOptions().then((options) => {
            options.defaultMaxLength = 20;
            SaveFakeFillerOptions(options);
          });
        }
        if (details.previousVersion && details.previousVersion.startsWith("2.10")) {
          GetFakeFillerOptions().then((options) => {
            options.fields.forEach((field) => {
              if (field.type === "number") {
                field.decimalPlaces = 0;
              }
              if (field.type === "date") {
                field.minDate = "1970-01-01";
                field.max = 0;
              }
            });
            SaveFakeFillerOptions(options);
          });
        }
        if (details.previousVersion && details.previousVersion.startsWith("2.12")) {
          GetFakeFillerOptions().then((options) => {
            options.profiles = [];
            options.version = 1;

            let hasEmailField = false;
            options.fields.forEach((field) => {
              if (field.type === "email") {
                // @ts-ignore
                field.emailUsername = options.emailSettings.username;
                // @ts-ignore
                field.emailUsernameList = options.emailSettings.usernameList;
                // @ts-ignore
                field.emailUsernameRegEx = options.emailSettings.usernameRegEx;
                // @ts-ignore
                field.emailHostname = options.emailSettings.hostname;
                // @ts-ignore
                field.emailHostnameList = options.emailSettings.hostnameList;

                hasEmailField = true;
              }
            });

            if (!hasEmailField) {
              options.fields.push(DEFAULT_EMAIL_CUSTOM_FIELD);
            }

            // @ts-ignore
            delete options.emailSettings;

            SaveFakeFillerOptions(options);
          });
        }
        if (details.previousVersion && details.previousVersion.startsWith("3")) {
          GetFakeFillerOptions().then((options) => {
            options.version = 1;

            // @ts-ignore
            delete options.emailSettings;

            SaveFakeFillerOptions(options);
          });
        }
      } catch (ex) {
        // eslint-disable-next-line no-alert
        window.alert(GetMessage("bgPage_errorMigratingOptions", [ex.message]));
      }
    }
  });
}

chrome.runtime.onMessage.addListener(handleMessage);

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.executeScript({
    code: "window.fakeFiller && window.fakeFiller.fillAllInputs();",
    allFrames: true,
  });
});

GetFakeFillerOptions().then((options) => {
  CreateContextMenus(options.enableContextMenu);
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "fake-filler-all") {
    chrome.tabs.executeScript({
      code: "window.fakeFiller.fillAllInputs();",
      allFrames: true,
    });
  }
  if (info.menuItemId === "fake-filler-form") {
    chrome.tabs.executeScript({
      code: "window.fakeFiller.fillThisForm();",
      allFrames: true,
    });
  }
  if (info.menuItemId === "fake-filler-input") {
    chrome.tabs.executeScript({
      code: "window.fakeFiller.fillThisInput();",
      allFrames: true,
    });
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === "fill_all_inputs") {
    chrome.tabs.executeScript({
      code: "window.fakeFiller.fillAllInputs();",
      allFrames: true,
    });
  }
  if (command === "fill_this_form") {
    chrome.tabs.executeScript({
      code: "window.fakeFiller.fillThisForm();",
      allFrames: true,
    });
  }
  if (command === "fill_this_input") {
    chrome.tabs.executeScript({
      code: "window.fakeFiller.fillThisInput();",
      allFrames: true,
    });
  }
});
