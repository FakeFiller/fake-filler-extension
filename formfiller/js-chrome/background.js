var analyticsTrackingCode = 'UA-XXXXXXX-X'; // UA-9183424-4 / UA-XXXXXXX-X

function handleUpgrade() {
    var previousVersion = localStorage['version'],
        currentVersion = chrome.app.getDetails().version;

    if (currentVersion != previousVersion) {
        if (typeof previousVersion !== 'undefined') {
            if (previousVersion.substr(0, 1) == '1') {
                SaveFormFillerOptions(FormFillerDefaultOptions());
            }
            else {
                var options = GetFormFillerOptions();

                if (options.triggerClickEvents === undefined) {
                    options.triggerClickEvents = false;
                }

                if (options.ignoreFieldsWithContent === undefined) {
                    options.ignoreFieldsWithContent = false;
                }

                if (options.passwordSettings.mode === undefined) {
                    var random = options.passwordSettings.random === true;
                    options.passwordSettings.mode = random ? 'random' : 'defined';
                }

                if (options.enableContextMenu === undefined) {
                    options.enableContextMenu = true;
                }

                if (options.fieldMatchSettings === undefined) {
                    options.fieldMatchSettings = {
                        matchLabel: false,
                        matchId: true,
                        matchName: true,
                        matchClass: true
                    };
                }

                if (options.agreeTermsFields === undefined) {
                    options.agreeTermsFields = ['agree', 'terms', 'conditions'];
                }

                SaveFormFillerOptions(options);
            }
        }
    }

    localStorage['version'] = currentVersion;
}

handleUpgrade();
CreateContextMenus();
SaveKeyboardShortcuts();

chrome.browserAction.onClicked.addListener(function () {
    chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillAllInputs(); window.formFiller.trackEvent("Extension Button", "Click"); }', allFrames: true })
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === 'getOptions') {
        sendResponse({
            options: GetFormFillerOptions(),
            analyticsTrackingCode: analyticsTrackingCode
        });
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === 'all') {
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillAllInputs(); window.formFiller.trackEvent("Context Menu", "fill_all_inputs"); }', allFrames: true })
    }
    if (info.menuItemId === 'form') {
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillThisForm(); window.formFiller.trackEvent("Context Menu", "fill_this_form"); }', allFrames: true })
    }
    if (info.menuItemId === 'input') {
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillThisInput(); window.formFiller.trackEvent("Context Menu", "fill_this_input"); }', allFrames: true })
    }
});

//Shortcut listener
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'fill_all_inputs') {
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillAllInputs(); window.formFiller.trackEvent("Keyboard Shortcut", "fill_all_inputs"); }', allFrames: true })
    }
    if (command === 'fill_this_form') {
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillThisForm(); window.formFiller.trackEvent("Keyboard Shortcut", "fill_this_form"); }', allFrames: true })
    }
    if (command === 'fill_this_input') {
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillThisInput(); window.formFiller.trackEvent("Keyboard Shortcut", "fill_this_input"); }', allFrames: true })
    }
});
