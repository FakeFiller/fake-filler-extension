var _gaq = _gaq || [];
_gaq.push(['_setAccount', '##']);
_gaq.push(['_trackEvent', 'extension_version', chrome.app.getDetails().version]);
_gaq.push(['_trackPageview']);

(function () {
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();

var application = (function () {
	var
		defaultOptions = {
			'username': {
				'random': true,
				'constants': []
			},
			'password': {
				'random': false,
				'constant': 'enterhere'
			},
			'email': {
				'username_random': true,
				'username_constants': ['jack', 'sparrow', 'frodo', 'baggins'],
				'hostname_random': false,
				'hostname_constants': ['gmail.com', 'yahoo.com', 'live.com', 'hotmail.com']
			},
			'ignore_fields': ['captcha'],
			'field_types': {
				'confirm': ['confirm', 'reenter', 'retype'],
				'email': ['email'],
				'number': ['integer', 'number', 'numeric', 'price', 'qty', 'quantity', 'zip'],
				'telephone': ['phone', 'fax'],
				'website': ['website'],
				'date': ['date'],
				'day': ['day'],
				'month': ['month'],
				'year': ['year']
			}
		};

	return {
		getOptions: function () {
			var opt = localStorage['options'];
			if (!opt) {
				return defaultOptions;
			}
			else {
				return JSON.parse(opt);
			}
		},

		getDefaultOptions: function () {
			return defaultOptions;
		},

		setOptions: function (options) {
			localStorage['options'] = JSON.stringify(options);
		},

		showUpgradeMessage: function () {
			var
				previousVersion = localStorage['version'],
				currentVersion = chrome.app.getDetails().version;

			if (currentVersion != previousVersion) {
				if (typeof previousVersion == 'undefined') {
					localStorage['options'] = JSON.stringify(defaultOptions);
				} else {
					// Update
				}
			}
			localStorage['version'] = currentVersion;
		}
	}
})();

application.showUpgradeMessage();

chrome.browserAction.onClicked.addListener(function () {
	_gaq.push(['_trackEvent', 'extension_button', 'click']);
	chrome.tabs.executeScript(null, { code: 'window.formFiller.fillAllInputs();' })
});

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	if (request == 'getOptions')
		sendResponse({options: application.getOptions()});
});
