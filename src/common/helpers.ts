import { saveOptionsToDb } from "src/common/firebase";
import { IFakeFillerOptions, ICustomField } from "src/types";

// spell-checker:disable

const DEFAULT_TELEPHONE_TEMPLATE = "+1 (XxX) XxX-XxxX";

export const CURRENT_SETTINGS_VERSION = 1;

export const DEFAULT_EMAIL_CUSTOM_FIELD: ICustomField = {
  type: "email",
  name: "Email Address",
  match: ["email"],
  emailPrefix: "",
  emailUsername: "random",
  emailUsernameList: ["jack", "jill"],
  emailUsernameRegEx: "",
  emailHostname: "list",
  emailHostnameList: ["mailinator.com"],
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
    name: "Username",
    match: ["userid", "username"],
  });

  options.fields.push({
    type: "first-name",
    name: "First Name",
    match: ["firstname"],
  });

  options.fields.push({
    type: "last-name",
    name: "Last Name",
    match: ["lastname", "surname", "secondname"],
  });

  options.fields.push(DEFAULT_EMAIL_CUSTOM_FIELD);

  options.fields.push({
    type: "organization",
    name: "Organization or Company Name",
    match: ["organization", "organisation", "company"],
  });

  options.fields.push({
    type: "full-name",
    name: "Full Name",
    match: ["fullname", "name"],
  });

  options.fields.push({
    type: "telephone",
    name: "Telephone Number",
    match: ["phone", "fax"],
    template: "+1 (XxX) XxX-XxxX",
  });

  options.fields.push({
    type: "number",
    name: "A Random Number between 1 and 1000",
    match: ["integer", "number", "numeric", "income", "price", "qty", "quantity"],
    min: 1,
    max: 1000,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Zip Code",
    match: ["zip"],
    min: 10000,
    max: 99999,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Day",
    match: ["day"],
    min: 1,
    max: 28,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Month",
    match: ["month"],
    min: 1,
    max: 12,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "number",
    name: "Year",
    match: ["year"],
    min: 1970,
    max: 2019,
    decimalPlaces: 0,
  });

  options.fields.push({
    type: "date",
    name: "Date",
    match: ["date"],
    minDate: "1970-01-01",
    max: 0,
    template: "DD-MMM-YYYY",
  });

  options.fields.push({
    type: "url",
    name: "Website Address",
    match: ["website"],
  });

  options.fields.push({
    type: "regex",
    name: "Address Line 1",
    match: ["address1", "addressline1"],
    template:
      // tslint:disable-next-line:max-line-length
      "([1-9][0-9][0-9]?) (North |East |West |South |||||)(Green |White |Rocky ||||||||)(Nobel|Fabien|Hague|Oak|Second|First|Cowley|Clarendon|New|Old|Milton) (Avenue|Boulevard|Court|Drive|Extension|Freeway|Lane|Parkway|Road|Street)",
  });

  options.fields.push({
    type: "regex",
    name: "P.O. Box",
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
      title: "Fill all inputs",
      contexts: ["page", "editable"],
    });

    chrome.contextMenus.create({
      id: "fake-filler-form",
      title: "Fill this form",
      contexts: ["editable"],
    });

    chrome.contextMenus.create({
      id: "fake-filler-input",
      title: "Fill this input",
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
