/* eslint-disable @typescript-eslint/no-explicit-any */

type BrowserCommandName = "fill_this_form" | "fill_this_input" | "fill_all_inputs";

export interface IFakeFillerBrowserCommand {
  name: BrowserCommandName;
  shortcut: string;
}

export type CustomFieldTypes =
  | "alphanumeric"
  | "date"
  | "email"
  | "first-name"
  | "full-name"
  | "last-name"
  | "number"
  | "organization"
  | "randomized-list"
  | "regex"
  | "telephone"
  | "text"
  | "url"
  | "username";

export type PasswordModeType = "defined" | "random";
export type EmailHostnameType = "list" | "random";
export type EmailUsernameType = "list" | "name" | "random" | "username" | "regex";

export interface ICustomField {
  type: CustomFieldTypes;
  name: string;
  match: string[];

  max?: number;
  min?: number;
  decimalPlaces?: number;
  maxLength?: number;
  template?: string;
  list?: string[];
  minDate?: string;
  maxDate?: string;
  emailHostname?: EmailHostnameType;
  emailHostnameList?: string[];
  emailUsername?: EmailUsernameType;
  emailUsernameList?: string[];
  emailUsernameRegEx?: string;
}

export interface ICustomFieldForm {
  match: string;
  name: string;
  numberMin: string;
  numberMax: string;
  numberDecimalPlaces: string;
  textMin: string;
  textMax: string;
  textMaxLength: string;
  telephoneTemplate: string;
  dateTemplate: string;
  dateMin: string;
  dateMax: string;
  dateMinDate: string;
  dateMaxDate: string;
  alphanumericTemplate: string;
  regexTemplate: string;
  list: string;
  type: CustomFieldTypes;
  emailHostname: EmailHostnameType;
  emailHostnameList: string;
  emailUsername: EmailUsernameType;
  emailUsernameList: string;
  emailUsernameRegEx: string;
}

export interface IFieldMatchSettings {
  matchClass: boolean;
  matchId: boolean;
  matchLabel: boolean;
  matchName: boolean;
  matchPlaceholder: boolean;
  matchAriaLabel: boolean;
}

export interface IPasswordSettings {
  mode: PasswordModeType;
  password: string;
}

export interface IProfile {
  name: string;
  urlMatch: string;
  fields: ICustomField[];
}

export interface IFakeFillerOptions {
  version: number;

  agreeTermsFields: string[];
  confirmFields: string[];
  defaultMaxLength: number;
  enableContextMenu: boolean;
  fieldMatchSettings: IFieldMatchSettings;
  fields: ICustomField[];
  ignoredFields: string[];
  ignoreFieldsWithContent: boolean;
  ignoreHiddenFields: boolean;
  passwordSettings: IPasswordSettings;
  profiles: IProfile[];
  triggerClickEvents: boolean;
}

export interface IFakeFillerOptionsForm {
  version: number;

  agreeTermsFields: string;
  confirmFields: string;
  defaultMaxLength: string;
  enableContextMenu: boolean;
  fieldMatchId: boolean;
  fieldMatchName: boolean;
  fieldMatchLabel: boolean;
  fieldMatchAriaLabel: boolean;
  fieldMatchClass: boolean;
  fieldMatchPlaceholder: boolean;
  ignoreFieldsWithContent: boolean;
  ignoreHiddenFields: boolean;
  ignoredFields: string;
  passwordSettingsMode: PasswordModeType;
  passwordSettingsPassword: string;
  triggerClickEvents: boolean;
}

export interface IOptionsState {
  isFetching: boolean;
  options: IFakeFillerOptions | null;
}

export interface IKeyboardShortcutsState {
  isFetching: boolean;
  shortcuts: chrome.commands.Command[];
}

export interface IAppState {
  optionsData: IOptionsState;
  keyboardShortcutsData: IKeyboardShortcutsState;
}

export type CustomFieldAddFunction = (itemIndex: number) => void;
export type CustomFieldEditFunction = (customField: ICustomField, itemIndex: number) => void;
export type CustomFieldDeleteFunction = (itemIndex: number) => void;
export type CustomFieldSortFunction = (customFields: ICustomField[]) => void;

export type MessageRequest = {
  type: string;
  data?: any;
};
