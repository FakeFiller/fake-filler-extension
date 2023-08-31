import { saveOptionsToDb } from "src/common/firebase";
import { IFakeFillerOptions, ICustomField } from "src/types";

// spell-checker:disable

const DEFAULT_TELEPHONE_TEMPLATE = "+1 (XxX) XxX-XxxX";

export const CURRENT_SETTINGS_VERSION = 1;

export const DEFAULT_EMAIL_CUSTOM_FIELD: ICustomField = {
  type: "email",
  name: "Email",
  match: ["email"],
  emailPrefix: "",
  emailUsername: "random",
  emailUsernameList: ["email", "firstname.lastname", "1234567890", "firstname-lastname", "firstname_lastname", "firstname+lastname", "x", "user-", "email@domain", ".email", "email.", "email..email"],
  emailUsernameRegEx: "",
  emailHostname: "list",
  emailHostnameList: ["domain.com", "subdomain.domain.com", "123.123.123.123", "domain-one.com", "domain.name", "domain.co.jp", "localhost", ".domain.com", "domain..com"],
};

const FakeFillerDefaultOptions = (): IFakeFillerOptions => {
  const options: IFakeFillerOptions = {
    version: CURRENT_SETTINGS_VERSION,
    agreeTermsFields: ["agree", "terms", "conditions"],
    confirmFields: ["confirm", "reenter", "retype", "repeat", "secondary"],
    defaultMaxLength: 20,
    enableContextMenu: true,
    fieldMatchSettings: {
      matchLabel: true,
      matchAriaLabel: true,
      matchAriaLabelledBy: true,
      matchId: true,
      matchName: true,
      matchClass: false,
      matchPlaceholder: false,
    },
    fields: [],
    ignoredFields: ["captcha", "hipinputtext"],
    ignoreFieldsWithContent: false,
    ignoreHiddenFields: true,
    passwordSettings: {
      mode: "defined",
      password: "Pa$$w0rd!",
    },
    profiles: [],
    triggerClickEvents: true,
  };

  options.fields.push({
    type: "username",
    name: "Юзернейм",
    match: ["userid", "username"],
  });

  options.fields.push({
    type: "first-name",
    name: "Имя",
    match: ["firstname"],
  });

  options.fields.push({
    type: "last-name",
    name: "Фамилия",
    match: ["lastname", "surname", "secondname"],
  });

  options.fields.push(DEFAULT_EMAIL_CUSTOM_FIELD);

  options.fields.push({
    type: "organization",
    name: "Компания/Организация",
    match: ["organization", "organisation", "company"],
  });

  options.fields.push({
    type: "full-name",
    name: "Full Name",
    match: ["fullname", "name"],
  });

  options.fields.push({
    type: "telephone",
    name: "Телефон",
    match: ["phone", "fax"],
    template: "+1 (XxX) XxX-XxxX",
  });

  options.fields.push({
    type: "number",
    name: "Рэндомное число от 1 до 1000",
    match: ["integer", "number", "numeric", "income", "price", "qty", "quantity"],
    min: 1,
    max: 1000,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Индекс",
    match: ["zip"],
    min: 101,
    max: 694,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "День",
    match: ["day"],
    min: 1,
    max: 31,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Месяц",
    match: ["month"],
    min: 1,
    max: 12,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Год",
    match: ["year"],
    min: 1970,
    max: 2025,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "date",
    name: "Дата",
    match: ["date"],
    minDate: "1970-01-01",
    max: 0,
    template: "DD.MM.YYYY",
  });

  options.fields.push({
    type: "url",
    name: "Адрес сайта",
    match: ["website"],
  });

  options.fields.push({
    type: "regex",
    name: "Адрес",
    match: ["address1", "addressline1", "address1"],
    template:
      // tslint:disable-next-line:max-line-length
      "(ул. Молодежная|ул. Центральная|ул. Советская|ул. Садовая|ул. Школьная|ул. Лесная|ул. Заречная|ул. Ленина|ул. Мира|пр. Ленина|пр. Гагарина|пр. Бакунина|пр. Большевиков|пр. Ветеранов|Владимирский пр.|Вознесенский пр.|Гражданский пр.|Агатов пер.|Альпийский пер.|Басков пер.) (д. )([1-9][0-9][0-9]?) (кв. )([1-9][0-9][0-9]?)",
  });

  options.fields.push({
    type: "regex",
    name: "Почтовый адрес",
    match: ["pobox", "postbox"],
    template: "((P\\.O\\.)|(PO)) Box [1-9][0-9]{0,4}",
  });

  return options;
};

const GetFakeFillerOptions = (): Promise<IFakeFillerOptions> => {
  const promise = new Promise<IFakeFillerOptions>((resolve) => {
    chrome.storage.local.get("options", (result) => {
      let options: IFakeFillerOptions;
      if (result && Object.keys(result).length > 0) {
        options = result.options;
      } else {
        options = FakeFillerDefaultOptions();
      }
      resolve(options);
    });
  });

  return promise;
};

const CreateContextMenus = (enableContextMenu: boolean): void => {
  chrome.contextMenus.removeAll();

  if (enableContextMenu) {
    chrome.contextMenus.create({
      id: "fake-filler-all",
      title: "Заполнить всё",
      contexts: ["page", "editable"],
    });

    chrome.contextMenus.create({
      id: "fake-filler-form",
      title: "Заполнить форму",
      contexts: ["editable"],
    });

    chrome.contextMenus.create({
      id: "fake-filler-input",
      title: "Заполнить поле",
      contexts: ["editable"],
    });
  }
};

const SaveFakeFillerOptions = (options: IFakeFillerOptions): void => {
  saveOptionsToDb(options).then((updatedAt) => {
    chrome.storage.local.set({ updatedAt });
  });

  chrome.storage.local.set({
    options,
  });

  chrome.runtime.sendMessage({ type: "optionsUpdated", data: options }, () => chrome.runtime.lastError);
  CreateContextMenus(options.enableContextMenu);
};

const CsvToArray = (csvString: string): string[] => {
  const splitValues = csvString && csvString.length > 0 ? csvString.split(",") : [];
  const arrayData: string[] = [];

  for (let i = 0; i < splitValues.length; i += 1) {
    splitValues[i] = splitValues[i].replace(/^\s*/, "").replace(/\s*$/, "");
    if (splitValues[i].length > 0) {
      arrayData.push(splitValues[i]);
    }
  }

  return arrayData;
};

const MultipleLinesToArray = (text: string): string[] => {
  const splitValues = text && text.length > 0 ? text.split("\n") : [];
  const arrayData: string[] = [];

  for (let i = 0; i < splitValues.length; i += 1) {
    splitValues[i] = splitValues[i].replace(/^\s*/, "").replace(/\s*$/, "");
    if (splitValues[i].length > 0) {
      arrayData.push(splitValues[i]);
    }
  }

  return arrayData;
};

const GetKeyboardShortcuts = (): Promise<chrome.commands.Command[]> => {
  const promise = new Promise<chrome.commands.Command[]>((resolve) => {
    chrome.commands.getAll((result) => {
      resolve(result);
    });
  });

  return promise;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GetMessage = (key: string, parameters?: any): string => {
  return chrome.i18n.getMessage(key, parameters);
};

const SanitizeText = (text: string): string => {
  return text.replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
};

export {
  DEFAULT_TELEPHONE_TEMPLATE,
  CreateContextMenus,
  CsvToArray,
  FakeFillerDefaultOptions,
  GetFakeFillerOptions,
  GetKeyboardShortcuts,
  GetMessage,
  MultipleLinesToArray,
  SanitizeText,
  SaveFakeFillerOptions,
};
