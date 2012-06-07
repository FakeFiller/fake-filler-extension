var FormFiller = function ($, options) {
	var
		wordBank = ['lorem', 'ipsum', 'dolor', 'sit', 'amet,', 'consectetur', 'adipisicing', 'elit,', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua.', 'enim', 'ad', 'minim', 'veniam,', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat.', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla', 'pariatur.', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident,', 'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum.', 'sed', 'ut', 'perspiciatis,', 'unde', 'omnis', 'iste', 'natus', 'error', 'sit', 'voluptatem', 'accusantium', 'doloremque', 'laudantium,', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa,', 'quae', 'ab', 'illo', 'inventore', 'veritatis', 'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt,', 'explicabo.', 'nemo', 'enim', 'ipsam', 'voluptatem,', 'quia', 'voluptas', 'sit,', 'aspernatur', 'aut', 'odit', 'aut', 'fugit,', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'eos,', 'qui', 'ratione', 'voluptatem', 'sequi', 'nesciunt,', 'neque', 'porro', 'quisquam', 'est,', 'qui', 'dolorem', 'ipsum,', 'quia', 'dolor', 'sit,', 'amet,', 'consectetur,', 'adipisci', 'velit,', 'sed', 'quia', 'non', 'numquam', 'eius', 'modi', 'tempora', 'incidunt,', 'ut', 'labore', 'et', 'dolore', 'magnam', 'aliquam', 'quaerat', 'voluptatem.', 'ut', 'enim', 'ad', 'minima', 'veniam,', 'quis', 'nostrum', 'exercitationem', 'ullam', 'corporis', 'suscipit', 'laboriosam,', 'nisi', 'ut', 'aliquid', 'ex', 'ea', 'commodi', 'consequatur?', 'quis', 'autem', 'vel', 'eum', 'iure', 'reprehenderit,', 'qui', 'in', 'ea', 'voluptate', 'velit', 'esse,', 'quam', 'nihil', 'molestiae', 'consequatur,', 'vel', 'illum,', 'qui', 'dolorem', 'eum', 'fugiat,', 'quo', 'voluptas', 'nulla', 'pariatur?', 'at', 'vero', 'eos', 'et', 'accusamus', 'et', 'iusto', 'odio', 'dignissimos', 'ducimus,', 'qui', 'blanditiis', 'praesentium', 'voluptatum', 'deleniti', 'atque', 'corrupti,', 'quos', 'dolores', 'et', 'quas', 'molestias', 'excepturi', 'sint,', 'obcaecati', 'cupiditate', 'non', 'provident,', 'similique', 'sunt', 'in', 'culpa,', 'qui', 'officia', 'deserunt', 'mollitia', 'animi,', 'id', 'est', 'laborum', 'et', 'dolorum', 'fuga.', 'harum', 'quidem', 'rerum', 'facilis', 'est', 'et', 'expedita', 'distinctio.', 'Nam', 'libero', 'tempore,', 'cum', 'soluta', 'nobis', 'est', 'eligendi', 'optio,', 'cumque', 'nihil', 'impedit,', 'quo', 'minus', 'id,', 'quod', 'maxime', 'placeat,', 'facere', 'possimus,', 'omnis', 'voluptas', 'assumenda', 'est,', 'omnis', 'dolor', 'repellendus.', 'temporibus', 'autem', 'quibusdam', 'aut', 'officiis', 'debitis', 'aut', 'rerum', 'necessitatibus', 'saepe', 'eveniet,', 'ut', 'et', 'voluptates', 'repudiandae', 'sint', 'molestiae', 'non', 'recusandae.', 'itaque', 'earum', 'rerum', 'hic', 'tenetur', 'a', 'sapiente', 'delectus,', 'aut', 'reiciendis', 'voluptatibus', 'maiores', 'alias', 'consequatur', 'aut', 'perferendis', 'doloribus', 'asperiores', 'repellat'],
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
			var i = 0,
				resultPhrase = '',
				word = '',
				length = Math.floor(Math.random() * 24) + 5;

			for (; i < length; i++) {
				word = wordBank[Math.floor(Math.random() * (wordBank.length - 1))];
				var phraseLength = resultPhrase.length;
				
				if (phraseLength == 0 || resultPhrase.substring(phraseLength - 1, phraseLength) == '.' || resultPhrase.substring(phraseLength - 1, phraseLength) == '?') {
					word = word.substring(0, 1).toUpperCase() + word.substring(1, word.length);
				}
				
				resultPhrase += phraseLength > 0 ? ' ' + word : word;
			}

			if (maxLength && maxLength > 0) {
				resultPhrase = resultPhrase.substring(0, maxLength - 1);
			}
			
			return resultPhrase.replace(/[?.!,;]?$/, '.');
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
				else if (this.type == 'number' || this.type == 'range') {
					var min = 1,
						max = 100;
						
					if (this.min) { min = parseInt(this.min); }
					if (this.max) { max = parseInt(this.max); }
					this.value = generateNumber(min, max);
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
				if (this.options && this.options.length > 1) {
					var i = 0,
						optionsCount = this.options.length;

					if (this.multiple) {
						var count = generateNumber(1, optionsCount);

						for (; i < optionsCount; i++) {
							if (!this.options[i].disabled) {
								this.options[i].selected = false;
							}
						}

						for (i = 0; i < count; i++) {
							if (!this.options[i].disabled) {
								this.options[generateNumber(1, optionsCount - 1)].selected = true;
							}
						}
					}
					else {
						var iteration = 0;
						
						while (iteration < optionsCount) {
							var randomOption = Math.floor(Math.random() * (optionsCount - 1)) + 1;
							
							if (!this.options[randomOption].disabled) {
								this.options[randomOption].selected = true;
								break;
							}
							else {
								iteration++;
							}
						}
					}
				}
			});
		}
	};
};

chrome.extension.sendRequest(null, 'getOptions', function (response) {
	if (!window.formFiller)
		window.formFiller = new FormFiller(jQuery, response.options);
});
