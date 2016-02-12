// @formatter:off
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

//ga('create', 'UA-9183424-2', 'auto');
ga('create', '##', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. See: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/pages/background.html');
// @formatter:on

ga('send', 'event', 'extension_version', chrome.app.getDetails().version);

function handleUpgrade() {
    var previousVersion = localStorage['version'],
        currentVersion = chrome.app.getDetails().version;

    if (currentVersion != previousVersion) {
        if (typeof previousVersion == 'undefined') {
            // New installation
        } else {
            // Upgrade

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

                SaveFormFillerOptions(options);
            }
        }
    }

    localStorage['version'] = currentVersion;
}

handleUpgrade();
CreateContextMenus();

chrome.browserAction.onClicked.addListener(function () {
    ga('send', 'event', 'extension_button', 'click');
    chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillAllInputs(); }', allFrames: true })
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request == 'getOptions') {
        sendResponse({options: GetFormFillerOptions()});
    }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === 'all') {
        ga('send', 'event', 'extension_context_menu', 'fill_all_inputs');
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillAllInputs(); }', allFrames: true })
    }
    if (info.menuItemId === 'form') {
        ga('send', 'event', 'extension_context_menu', 'fill_this_form');
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillThisForm(); }', allFrames: true })
    }
    if (info.menuItemId === 'input') {
        ga('send', 'event', 'extension_context_menu', 'fill_this_input');
        chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillThisInput(); }', allFrames: true })
    }
});

//Shortcut listner
chrome.commands.onCommand.addListener(function(command) {
    ga('send', 'event', 'extension_button', 'shortcut');
    chrome.tabs.executeScript(null, { code: 'if (window.formFiller) { window.formFiller.fillAllInputs(); }', allFrames: true })
});
