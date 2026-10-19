async function getCurrentTabId() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab?.id ?? -1;
}

import { CreateContextMenus, GetFakeFillerOptions, GetMessage, SaveFakeFillerOptions } from "src/common/helpers";

import { ApplySyncedOptions, IsSyncChange, PullNewerOptionsFromSync } from "src/common/settings-sync";
import RequestPageAnswer from "src/service_worker/ai-answer";
import RequestAiFill from "src/service_worker/ai-fill";
import { MessageRequest, IProfile, IFakeFillerOptions, IAiFieldDescriptor, IPageContent } from "src/types";

function NotifyTabsOfNewOptions(options: IFakeFillerOptions) {
  chrome.tabs.query({}, (tabs: any[]) => {
    tabs.forEach((tab: { id: any }) => {
      if (tab && tab.id && tab.id !== chrome.tabs.TAB_ID_NONE) {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "receiveNewOptions", data: { options } },
          () => chrome.runtime.lastError
        );
      }
    });
  });
}

// A small window of its own so it keeps capturing while the user works in other tabs.
function openTranscriber() {
  chrome.windows.create({ url: chrome.runtime.getURL("transcriber.html"), type: "popup", width: 440, height: 660 });
}

function handleMessage(
  request: MessageRequest,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void
): boolean | null {
  switch (request.type) {
    case "getOptions": {
      GetFakeFillerOptions().then((result) => {
        sendResponse({ options: result });
      });
      return true;
    }

    case "setProfileBadge": {
      const profile = request.data as IProfile;
      chrome.action.setBadgeText({ text: "★", tabId: sender.tab?.id });
      chrome.action.setBadgeBackgroundColor({ color: "#757575", tabId: sender.tab?.id });
      chrome.action.setTitle({
        title: `${GetMessage("actionTitle")}\n${GetMessage("matchedProfile")}: ${profile.name}`,
        tabId: sender.tab?.id,
      });
      return true;
    }

    case "clearProfileBadge": {
      chrome.action.setBadgeText({ text: "", tabId: sender.tab?.id });
      return true;
    }

    case "aiFill": {
      const { instruction, fields } = request.data as { instruction: string; fields: IAiFieldDescriptor[] };
      RequestAiFill(instruction, fields)
        .then((result) => sendResponse({ result }))
        .catch((error: Error) => sendResponse({ error: error.message }));
      return true;
    }

    case "askPage": {
      const { question, page } = request.data as { question: string; page: IPageContent };
      RequestPageAnswer(question, page)
        .then((answer) => sendResponse({ answer }))
        .catch((error: Error) => sendResponse({ error: error.message }));
      return true;
    }

    case "openTranscriber": {
      openTranscriber();
      return true;
    }

    case "openAiFillSettings": {
      chrome.tabs.create({ url: chrome.runtime.getURL("options.html#/ai-fill") });
      return true;
    }

    case "optionsUpdated": {
      GetFakeFillerOptions().then((options) => {
        NotifyTabsOfNewOptions(options);
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
      // Service workers have no window, so a failed migration is logged rather than shown in an alert.
      if (details.previousVersion && details.previousVersion.startsWith("3.2")) {
        GetFakeFillerOptions()
          .then((options) => {
            options.fieldMatchSettings.matchAriaLabelledBy = true;
            return SaveFakeFillerOptions(options);
          })
          .catch((ex) => console.error(GetMessage("bgPage_errorMigratingOptions", [(ex as Error).message])));
      }
    }
  });
}

chrome.runtime.onMessage.addListener(handleMessage);

// Options saved in another browser on the same account arrive through chrome.storage.sync.
async function applyNewerSyncedOptions() {
  const options = await PullNewerOptionsFromSync();
  if (options) {
    await ApplySyncedOptions(options);
    NotifyTabsOfNewOptions(options);
    CreateContextMenus(options.enableContextMenu);
  }
}

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (IsSyncChange(changes, areaName)) {
    applyNewerSyncedOptions();
  }
});

applyNewerSyncedOptions();

// mode "ask" opens the panel on its Ask page tab; without a mode the shortcut toggles the panel.
async function openAiFill(mode?: "fill" | "ask") {
  const tabId = await getCurrentTabId();
  if (tabId > -1) {
    // Only the top frame shows the panel; it scans the forms in that frame.
    chrome.tabs.sendMessage(
      tabId,
      { type: "toggleAiFillPanel", data: { mode } },
      { frameId: 0 },
      () => chrome.runtime.lastError
    );
  }
}

function fillAllInputs() {
  window.fakeFiller?.fillAllInputs();
}

function fillThisForm() {
  window.fakeFiller.fillThisForm();
}

function fillThisInput() {
  window.fakeFiller.fillThisInput();
}

chrome.action.onClicked.addListener(async () => {
  await chrome.scripting.executeScript({
    func: fillAllInputs,
    target: {
      allFrames: true,
      tabId: await getCurrentTabId(),
    },
  });
});

GetFakeFillerOptions().then((options) => {
  CreateContextMenus(options.enableContextMenu);
});

chrome.contextMenus.onClicked.addListener(async (info) => {
  if (info.menuItemId === "fake-filler-all") {
    await chrome.scripting.executeScript({
      func: fillAllInputs,
      target: {
        allFrames: true,
        tabId: await getCurrentTabId(),
      },
    });
  }
  if (info.menuItemId === "fake-filler-form") {
    await chrome.scripting.executeScript({
      func: fillThisForm,
      target: {
        allFrames: true,
        tabId: await getCurrentTabId(),
      },
    });
  }
  if (info.menuItemId === "fake-filler-transcriber") {
    openTranscriber();
  }
  if (info.menuItemId === "fake-filler-ask") {
    await openAiFill("ask");
  }
  if (info.menuItemId === "fake-filler-ai") {
    await openAiFill();
  }
  if (info.menuItemId === "fake-filler-input") {
    await chrome.scripting.executeScript({
      func: fillThisInput,
      target: {
        allFrames: true,
        tabId: await getCurrentTabId(),
      },
    });
  }
});

chrome.commands.onCommand.addListener(async (command: string) => {
  if (command === "fill_all_inputs") {
    await chrome.scripting.executeScript({
      func: fillAllInputs,
      target: {
        allFrames: true,
        tabId: await getCurrentTabId(),
      },
    });
  }
  if (command === "fill_this_form") {
    await chrome.scripting.executeScript({
      func: fillThisForm,
      target: {
        allFrames: true,
        tabId: await getCurrentTabId(),
      },
    });
  }
  if (command === "open_ask_page") {
    await openAiFill("ask");
  }
  if (command === "open_audio_transcriber") {
    openTranscriber();
  }
  if (command === "open_ai_fill") {
    await openAiFill();
  }
  if (command === "fill_this_input") {
    await chrome.scripting.executeScript({
      func: fillThisInput,
      target: {
        allFrames: true,
        tabId: await getCurrentTabId(),
      },
    });
  }
});
