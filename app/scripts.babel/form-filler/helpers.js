function FormFillerDefaultOptions() {
  const options = {};
  options.enableContextMenu = true;
  options.ignoreFieldsWithContent = false;
  options.triggerClickEvents = true;
  options.ignoreHiddenFields = true;
  options.ignoredFields = ['captcha', 'hipinputtext'];
  options.confirmFields = ['confirm', 'reenter', 'retype', 'repeat'];
  options.agreeTermsFields = ['agree', 'terms', 'conditions'];

  options.passwordSettings = {
    mode: 'defined',
    password: 'Pa$$w0rd!',
  };

  options.emailSettings = {
    username: 'random',
    usernameList: ['jack', 'sparrow', 'frodo', 'baggins'],
    usernameRegEx: '',
    hostname: 'list',
    hostnameList: ['hotmail.com', 'gmail.com', 'yahoo.com'],
  };

  options.fieldMatchSettings = {
    matchLabel: true,
    matchId: true,
    matchName: true,
    matchClass: false,
  };

  options.fields = [];

  options.fields.push({
    type: 'username',
    name: 'Username',
    match: ['userid', 'username'],
  });

  options.fields.push({
    type: 'first-name',
    name: 'First Name',
    match: ['firstname'],
  });

  options.fields.push({
    type: 'last-name',
    name: 'Last Name',
    match: ['lastname', 'surname', 'secondname'],
  });

  options.fields.push({
    type: 'email',
    name: 'Email Address',
    match: ['email'],
  });

  options.fields.push({
    type: 'organization',
    name: 'Organization or Company Name',
    match: ['organization', 'organisation', 'company'],
  });

  options.fields.push({
    type: 'full-name',
    name: 'Full Name',
    match: ['fullname', 'name'],
  });

  options.fields.push({
    type: 'telephone',
    name: 'Telephone Number',
    match: ['phone', 'fax'],
    template: '+XXX-Xx-Xxxxxxx',
  });

  options.fields.push({
    type: 'number',
    name: 'A Random Number between 1 and 1000',
    match: ['integer', 'number', 'numeric', 'price', 'qty', 'quantity'],
    min: 1,
    max: 1000,
  });

  options.fields.push({
    type: 'number',
    name: 'Zip Code',
    match: ['zip'],
    min: 10000,
    max: 99999,
  });

  options.fields.push({
    type: 'number',
    name: 'Day',
    match: ['day'],
    min: 1,
    max: 28,
  });

  options.fields.push({
    type: 'number',
    name: 'Month',
    match: ['month'],
    min: 1,
    max: 12,
  });

  options.fields.push({
    type: 'number',
    name: 'Year',
    match: ['year'],
    min: 1970,
    max: 2013,
  });

  options.fields.push({
    type: 'date',
    name: 'Date',
    match: ['date'],
    template: 'DD-MMM-YYYY',
  });

  options.fields.push({
    type: 'url',
    name: 'Website Address',
    match: ['website'],
  });

  options.fields.push({
    type: 'regex',
    name: 'Address Line 1',
    match: ['address1', 'addressline1'],
    template: '([1-9][0-9][0-9]?) (North |East |West |South |||||)(Green |White |Rocky ||||||||)(Nobel|Fabien|Hague|Oak|Second|First|Cowley|Clarendon|New|Old|Milton) (Avenue|Boulevard|Court|Drive|Extension|Freeway|Lane|Parkway|Road|Street)', // eslint-disable-line max-len
  });

  options.fields.push({
    type: 'regex',
    name: 'P.O. Box',
    match: ['pobox', 'postbox'],
    template: '((P\\.O\\.)|(PO)) Box [1-9][0-9]{0,4}',
  });

  return options;
}

function GetFormFillerOptions() {
  const promise = new Promise((resolve) => {
    chrome.storage.local.get('options', (result) => {
      if (result && Object.keys(result).length > 0) {
        resolve(result.options);
      } else {
        resolve(FormFillerDefaultOptions());
      }
    });
  });

  return promise;
}

function CreateContextMenus(enableContextMenu) {
  chrome.contextMenus.removeAll();

  if (enableContextMenu) {
    chrome.contextMenus.create({
      id: 'form-filler-all',
      title: 'Fill all inputs',
      contexts: ['page', 'editable'],
    });

    chrome.contextMenus.create({
      id: 'form-filler-form',
      title: 'Fill this form',
      contexts: ['editable'],
    });

    chrome.contextMenus.create({
      id: 'form-filler-input',
      title: 'Fill this input',
      contexts: ['editable'],
    });
  }
}

function SaveFormFillerOptions(options) {
  chrome.storage.local.set({
    options,
  });

  CreateContextMenus(options.enableContextMenu);
}

function GetKeyboardShortcuts() {
  const promise = new Promise((resolve) => {
    chrome.commands.getAll((result) => {
      resolve(result);
    });
  });

  return promise;
}

function CsvToArray(csvString) {
  const splitValues = csvString && csvString.length > 0 ? csvString.split(',') : [];
  const arrayData = [];

  for (let i = 0; i < splitValues.length; i += 1) {
    splitValues[i] = splitValues[i].replace(/^\s*/, '').replace(/\s*$/, '');
    if (splitValues[i].length > 0) {
      arrayData.push(splitValues[i]);
    }
  }

  return arrayData;
}

function MultipleLinesToArray(text) {
  const splitValues = text && text.length > 0 ? text.split('\n') : [];
  const arrayData = [];

  for (let i = 0; i < splitValues.length; i += 1) {
    splitValues[i] = splitValues[i].replace(/^\s*/, '').replace(/\s*$/, '');
    if (splitValues[i].length > 0) {
      arrayData.push(splitValues[i]);
    }
  }

  return arrayData;
}

function GetBrowser() {
  const tempUrl = chrome.runtime.getURL('images/logo.svg');

  if (tempUrl.startsWith('moz')) {
    return 'Firefox';
  }

  return 'Chrome';
}

function GetMessage(key, parameters) {
  return chrome.i18n.getMessage(key, parameters);
}

export {
  FormFillerDefaultOptions,
  GetFormFillerOptions,
  CreateContextMenus,
  SaveFormFillerOptions,
  GetKeyboardShortcuts,
  CsvToArray,
  MultipleLinesToArray,
  GetBrowser,
  GetMessage,
};
