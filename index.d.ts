type SupportedBrowser = 'Chrome' | 'Firefox';

type BrowserCommandName = 'fill_this_form' | 'fill_this_input' | 'fill_all_inputs';

interface IFormFillerBrowserCommand {
  name: BrowserCommandName;
  shortcut: string;
}

type CustomFieldTypes =
  | 'alphanumeric'
  | 'date'
  | 'email'
  | 'first-name'
  | 'full-name'
  | 'last-name'
  | 'number'
  | 'organization'
  | 'randomized-list'
  | 'regex'
  | 'telephone'
  | 'text'
  | 'url'
  | 'username';

interface ICustomField {
  match: string[];
  max?: number;
  min?: number;
  decimalPlaces?: number;
  maxLength?: number;
  name: string;
  template?: string;
  list?: string[];
  type: CustomFieldTypes;
}

interface ICustomFieldForm {
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
  alphanumericTemplate: string;
  regexTemplate: string;
  list: string;
  type: CustomFieldTypes;
}

interface IEmailSettings {
  hostname: 'list' | 'random';
  hostnameList: string[];
  username: 'list' | 'name' | 'random' | 'username' | 'regex';
  usernameList: string[];
  usernameRegEx: string;
}

interface IFieldMatchSettings {
  matchClass: boolean;
  matchId: boolean;
  matchLabel: boolean;
  matchName: boolean;
  matchPlaceholder: boolean;
}

interface IPasswordSettings {
  mode: 'defined' | 'random';
  password: string;
}

interface IFormFillerOptions {
  agreeTermsFields: string[];
  confirmFields: string[];
  defaultMaxLength: number;
  emailSettings: IEmailSettings;
  enableContextMenu: boolean;
  fieldMatchSettings: IFieldMatchSettings;
  fields: ICustomField[];
  ignoreFieldsWithContent: boolean;
  ignoreHiddenFields: boolean;
  ignoredFields: string[];
  passwordSettings: IPasswordSettings;
  triggerClickEvents: boolean;
}

interface IFormFillerOptionsForm {
  agreeTermsFields: string;
  confirmFields: string;
  defaultMaxLength: string;
  emailSettingsUsernameType: 'list' | 'name' | 'random' | 'username' | 'regex';
  emailSettingsUsernameList: string;
  emailSettingsUsernameRegEx: string;
  emailSettingsHostnameType: 'list' | 'random';
  emailSettingsHostnameList: string;
  enableContextMenu: boolean;
  fieldMatchId: boolean;
  fieldMatchName: boolean;
  fieldMatchLabel: boolean;
  fieldMatchClass: boolean;
  fieldMatchPlaceholder: boolean;
  ignoreFieldsWithContent: boolean;
  ignoreHiddenFields: boolean;
  ignoredFields: string;
  passwordSettingsMode: 'defined' | 'random';
  passwordSettingsPassword: string;
  triggerClickEvents: boolean;
}

interface IOptionsState {
  isFetching: boolean;
  options: IFormFillerOptions | null;
}

interface IKeyboardShortcutsState {
  isFetching: boolean;
  shortcuts: chrome.commands.Command[];
}

interface IAppState {
  optionsData: IOptionsState;
  keyboardShortcutsData: IKeyboardShortcutsState;
}

type CustomFieldAddFunction = (itemIndex: number) => void;
type CustomFieldEditFunction = (customField: ICustomField, itemIndex: number) => void;
type CustomFieldDeleteFunction = (itemIndex: number) => void;
type CustomFieldSortFunction = (customFields: ICustomField[]) => void;
