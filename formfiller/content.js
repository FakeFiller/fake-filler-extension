var FormFiller = function ($, options) {
	var
		consonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'],
		vowels = ['a', 'e', 'i', 'o', 'u', 'y'],
		previousValue = '',

		isAnyMatch = function (haystack, needles) {
			for (var i = 0, count = needles.length; i < count; i++) {
				if (haystack.indexOf(needles[i]) >= 0) {
					return true;
				}
			}
			return false;
		},

		generateWord = function (minLength, maxLength, firstLetterLower) {
			if (!minLength)
				minLength = Math.floor(Math.random() * 10) + 3;

			var resultWord = '';
			var odd = true;

			while (resultWord.length < minLength) {
				var newSymbol = odd ? consonants[Math.floor(Math.random() * consonants.length)] : vowels[Math.floor(Math.random() * vowels.length)];
				odd = !odd;
				resultWord += newSymbol;
			}

			if (!firstLetterLower) {
				resultWord = resultWord[0].toUpperCase() + resultWord.substring(1);
			}

			if (maxLength && maxLength > 0) {
				resultWord = resultWord.substring(0, maxLength);
			}

			return resultWord;
		},

		generateParagraph = function (maxLength) {
			var word = 0,
				resultPhrase = '',
				length = Math.floor(Math.random() * 24) + 5;

			for (; word <= length; word++) {
				if (word == length) {
					resultPhrase = resultPhrase + generateWord(null, null, true) + '.';
				}

				else if (word == 1) {
					resultPhrase = generateWord(null, null, true) + ' ';
				}
				else {
					resultPhrase = resultPhrase + generateWord(null, null, true) + ' ';
				}
			}

			if (maxLength && maxLength > 0) {
				resultPhrase = resultPhrase.substring(0, maxLength);
			}

			return resultPhrase;
		},

		generatePassword = function () {
			if (options.password.random) {
				var password = generateWord(8).toLowerCase();
				console.log('Generated Password: ' + password);
				return password;
			}
			else {
				return options.password.constant;
			}
		},

		generateEmail = function () {
			var username = (options.email.username_random)
				? generateWord().toLowerCase()
				: options.email.username_constants[Math.floor(Math.random() * (options.email.username_constants.length))];

			var domain = (options.email.hostname_random)
				? generateWord().toLowerCase() + '.com'
				: options.email.hostname_constants[Math.floor(Math.random() * (options.email.hostname_constants.length))];

			return username + '@' + domain;
		},

		generateWebsite = function () {
			return ('http://www.' + generateWord().toLowerCase() + '.com');
		},

		generateNumber = function (start, end) {
			return Math.floor(Math.random() * (end - start + 1) + start);
		},

		generatePhoneNumber = function () {
			return Math.floor((Math.random() * 49)) + ' (' + Math.floor((Math.random() * 999)) + ') ' + Math.floor((Math.random() * 899) + 100) + '-' + Math.floor((Math.random() * 89) + 10) + '-' + Math.floor((Math.random() * 89) + 10);
		},

		generateDate = function () {
			return ('0' + generateNumber(1, 12)).slice(-2) + '/' + ('0' + generateNumber(1, 12)).slice(-2) + '/' + generateNumber(1970, new Date().getFullYear());
		},

		generateDay = function () {
			return ('0' + generateNumber(1, 28)).slice(-2);
		},

		generateMonth = function () {
			return ('0' + generateNumber(1, 12)).slice(-2);
		},

		generateYear = function () {
			return generateNumber(1970, new Date().getFullYear());
		},

		generateValueByType = function (element) {
			var elementName = (element.name + element.id + element.className).toLowerCase();

			if (isAnyMatch(elementName, options.field_types.confirm)) {
				return previousValue;
			}
			if (isAnyMatch(elementName, options.field_types.email)) {
				return generateEmail();
			}
			if (isAnyMatch(elementName, options.field_types.number)) {
				return generateNumber(1, 1000);
			}
			if (isAnyMatch(elementName, options.field_types.telephone)) {
				return generatePhoneNumber();
			}
			if (isAnyMatch(elementName, options.field_types.website)) {
				return generateWebsite();
			}
			if (isAnyMatch(elementName, options.field_types.date)) {
				return generateDate();
			}
			if (isAnyMatch(elementName, options.field_types.day)) {
				return generateDay();
			}
			if (isAnyMatch(elementName, options.field_types.month)) {
				return generateMonth();
			}
			if (isAnyMatch(elementName, options.field_types.year)) {
				return generateYear();
			}

			return generateWord(element.maxlength);
		},

		selectRandomRadio = function (name) {
			var i = 0,
				list = [],
				elements = document.getElementsByName(name),
				count = elements.length;

			for (; i < count; i++) {
				if (elements[i].type == 'radio') {
					list.push(elements[i]);
				}
			}

			list[Math.floor(Math.random() * list.length)].checked = true;
		};

	return {
		fillAllInputs: function () {
			$('input:enabled:not([readonly])').each(function () {
				var elementName = (this.name + this.id + this.className).toLowerCase();
				if (isAnyMatch(elementName, options.ignore_fields)) {
					return true;
				}

				if (this.type == 'checkbox') {
					this.checked = (Math.random() > 0.5) ? 'checked' : '';
				}
				else if (this.type == 'date') {
					this.value = generateYear() + '-' + generateMonth() + '-' + generateDay();
				}
				else if (this.type == 'email') {
					this.value = generateEmail();
				}
				else if (this.type == 'month') {
					this.value = generateYear() + '-' + generateMonth();
				}
				else if (this.type == 'number') {
					this.value = generateNumber(1, 100);
				}
				else if (this.type == 'password') {
					if (isAnyMatch(this.name.toLowerCase(), options.field_types.confirm)) {
						this.value = previousValue;
					}
					else {
						previousValue = generatePassword();
						this.value = previousValue;
					}
				}
				else if (this.type == 'radio') {
					selectRandomRadio(this.name);
				}
				else if (this.type == 'tel') {
					this.value = generatePhoneNumber();
				}
				else if (this.type == 'text') {
					previousValue = generateValueByType(this);
					this.value = previousValue;
				}
				else if (this.type == 'url') {
					this.value = generateWebsite();
				}
			});
			$('textarea:enabled:not([readonly])').each(function () {
				this.value = generateParagraph(this.maxLength);
			});
			$('select:enabled:not([readonly])').each(function () {
				if (this.options) {
					//$(this).val(this.options[Math.floor(Math.random() * (this.options.length - 1)) + 1].val());
					this.selectedIndex = Math.floor(Math.random() * (this.options.length - 1)) + 1;
				}
			});
		}
	};
};

chrome.extension.sendRequest(null, 'getOptions', function (response) {
	if (!window.formFiller)
		window.formFiller = new FormFiller(jQuery, response.options);
});
