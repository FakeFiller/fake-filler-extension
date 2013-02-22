var _gaq = _gaq || [];
_gaq.push(['_setAccount', '##']);
_gaq.push(['_trackEvent', 'extension_version', chrome.app.getDetails().version]);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script');
    ga.type = 'text/javascript';
    ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(ga, s);
})();

var application = (function() {
    return {
        showUpgradeMessage: function() {
            var previousVersion = localStorage['version'],
                currentVersion = chrome.app.getDetails().version;

            if (currentVersion != previousVersion) {
                if (typeof previousVersion == 'undefined') {
                    // New installation
                } else {
                    // Upgrade
                    this.setOptions(this.getDefaultOptions());
                    chrome.tabs.create({url: chrome.extension.getURL('pages/changelog.html')});
                }
            }

            localStorage['version'] = currentVersion;
        },

        getOptions: function() {
            var options = localStorage['options'];
            if (!options) {
                return this.getDefaultOptions();
            }
            else {
                return JSON.parse(options);
            }
        },

        getDefaultOptions: function() {
            var options = {};
            options.ignoreHiddenFields = true;
            options.ignoredFields = ['captcha', 'hipinputtext'];
            options.confirmFields = ['confirm', 'reenter', 'retype', 'repeat'];

            options.passwordSettings = {
                random: false,
                password: 'Pa$$word!'
            };

            options.emailSettings = {
                username: 'random',
                usernameList: ['jack', 'sparrow', 'frodo', 'baggins'],
                hostname: 'list',
                hostnameList: ['hotmail.com', 'gmail.com', 'yahoo.com']
            };

            options.fields = [];

            options.fields.push({
                type: 'username',
                name: 'Username',
                match: ['userid', 'username']
            });

            options.fields.push({
                type: 'first-name',
                name: 'First Name',
                match: ['firstname']
            });

            options.fields.push({
                type: 'last-name',
                name: 'Last Name',
                match: ['lastname', 'surname', 'secondname']
            });

            options.fields.push({
                type: 'full-name',
                name: 'Full Name',
                match: ['fullname', 'name']
            });

            options.fields.push({
                type: 'email',
                name: 'Email Address',
                match: ['email']
            });

            options.fields.push({
                type: 'organization',
                name: 'Organization or Company Name',
                match: ['organization', 'organisation', 'company']
            });

            options.fields.push({
                type: 'telephone',
                name: 'Telephone Number',
                match: ['phone', 'fax'],
                template: '+XXX-Xx-Xxxxxxx'
            });

            options.fields.push({
                type: 'number',
                name: 'A Random Number between 1 and 1000',
                match: ['integer', 'number', 'numeric', 'price', 'qty', 'quantity'],
                min: 1,
                max: 1000
            });

            options.fields.push({
                type: 'number',
                name: 'Zip Code',
                match: ['zip'],
                min: 10000,
                max: 99999
            });

            options.fields.push({
                type: 'number',
                name: 'Day',
                match: ['day'],
                min: 1,
                max: 28
            });

            options.fields.push({
                type: 'number',
                name: 'Month',
                match: ['month'],
                min: 1,
                max: 12
            });

            options.fields.push({
                type: 'number',
                name: 'Year',
                match: ['year'],
                min: 1970,
                max: 2013
            });

            options.fields.push({
                type: 'date',
                name: 'Date',
                match: ['date'],
                template: 'DD-MMM-YYYY'
            });

            options.fields.push({
                type: 'url',
                name: 'Website Address',
                match: ['website']
            });

            return options;
        },

        restoreFactorySettings: function() {
            this.setOptions(this.getDefaultOptions());
        },

        setOptions: function(options) {
            localStorage['options'] = JSON.stringify(options);
        },

        addCustomField: function(fieldData) {
            var options = this.getOptions();
            delete(fieldData.hasErrors);
            options.fields.push(fieldData);
            this.setOptions(options);
        },

        saveCustomField: function(fieldData, index) {
            var options = this.getOptions();
            delete(fieldData.hasErrors);
            options.fields[index] = fieldData;
            this.setOptions(options);
        },

        removeCustomField: function(index) {
            var options = this.getOptions();
            options.fields.splice(index, 1);
            this.setOptions(options);
        },

        moveItemInArray: function(oldIndex, newIndex) {
            var options = this.getOptions();

            while (oldIndex < 0) {
                oldIndex += options.fields.length;
            }
            while (newIndex < 0) {
                newIndex += options.fields.length;
            }
            if (newIndex >= options.fields.length) {
                var k = newIndex - customFields.length;
                while ((k--) + 1) {
                    options.fields.push(undefined);
                }
            }

            options.fields.splice(newIndex, 0, options.fields.splice(oldIndex, 1)[0]);
            this.setOptions(options);
        },

        moveCustomFieldUp: function(index) {
            if (index > 0) {
                this.moveItemInArray(index, --index);
            }
        },

        moveCustomFieldDown: function(index) {
            if (this.getOptions().fields.length > index) {
                this.moveItemInArray(index, ++index);
            }
        }
    }
})();

application.showUpgradeMessage();

chrome.browserAction.onClicked.addListener(function() {
    _gaq.push(['_trackEvent', 'extension_button', 'click']);
    chrome.tabs.executeScript(null, { code: 'window.formFiller.fillAllInputs();' })
});

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request == 'getOptions') {
        sendResponse({options: application.getOptions()});
    }
    else if (request == 'trackHotKeyClick') {
        _gaq.push(['_trackEvent', 'extension_hotkey', application.getOptions().hotkey.combination]);
    }
});
