/// <reference path="../../index.d.ts" />

import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import {
  CsvToArray,
  FormFillerDefaultOptions,
  GetFormFillerOptions,
  GetKeyboardShortcuts,
  MultipleLinesToArray,
  SaveFormFillerOptions,
  SaveKeyboardShortcuts,
} from '../common/helpers';

export interface IFetchingOptionsAction {
  type: 'FETCHING_OPTIONS';
}

export interface IReceivedOptionsAction {
  type: 'RECEIVED_OPTIONS';
  options: IFormFillerOptions;
}

export interface IFetchingKeyboardShortcutsAction {
  type: 'FETCHING_KEYBOARD_SHORTCUTS';
}

export interface IReceivedKeyboardShortcutsAction {
  type: 'RECEIVED_KEYBOARD_SHORTCUTS';
  shortcuts: chrome.commands.Command[];
}

export interface ISavingKeyboardShortcutsAction {
  type: 'SAVING_KEYBOARD_SHORTCUTS';
}

export type MyActions =
  | IFetchingOptionsAction
  | IReceivedOptionsAction
  | IFetchingKeyboardShortcutsAction
  | IReceivedKeyboardShortcutsAction
  | ISavingKeyboardShortcutsAction;

type MyThunkResult<R> = ThunkAction<R, IAppState, {}, MyActions>;
type MyDefaultThunkResult = MyThunkResult<void>;
type MyThunkDispatch = ThunkDispatch<IAppState, {}, MyActions>;

export interface DispatchProps {
  dispatch: MyThunkDispatch;
}

export function getOptions(): MyDefaultThunkResult {
  return dispatch => {
    dispatch({ type: 'FETCHING_OPTIONS' });

    GetFormFillerOptions().then(options => {
      dispatch({ type: 'RECEIVED_OPTIONS', options });
    });
  };
}

export function resetOptions(): MyDefaultThunkResult {
  return dispatch => {
    const options = FormFillerDefaultOptions();
    SaveFormFillerOptions(options);
    dispatch({ type: 'RECEIVED_OPTIONS', options });
  };
}

export function saveOptions(options: IFormFillerOptions, formValues?: IFormFillerOptionsForm): MyDefaultThunkResult {
  return dispatch => {
    const newOptions = Object.assign({}, options, { fields: [...options.fields] });

    if (formValues) {
      newOptions.agreeTermsFields = CsvToArray(formValues.agreeTermsFields);
      newOptions.confirmFields = CsvToArray(formValues.confirmFields);
      newOptions.defaultMaxLength = parseInt(formValues.defaultMaxLength, 10);
      newOptions.enableContextMenu = formValues.enableContextMenu;
      newOptions.ignoreFieldsWithContent = formValues.ignoreFieldsWithContent;
      newOptions.ignoreHiddenFields = formValues.ignoreHiddenFields;
      newOptions.ignoredFields = CsvToArray(formValues.ignoredFields);
      newOptions.triggerClickEvents = formValues.triggerClickEvents;

      newOptions.passwordSettings = {
        mode: formValues.passwordSettingsMode,
        password: formValues.passwordSettingsPassword,
      };

      newOptions.fieldMatchSettings = {
        matchClass: formValues.fieldMatchClass,
        matchId: formValues.fieldMatchId,
        matchLabel: formValues.fieldMatchLabel,
        matchName: formValues.fieldMatchName,
        matchPlaceholder: formValues.fieldMatchPlaceholder,
      };

      newOptions.emailSettings = {
        hostname: formValues.emailSettingsHostnameType,
        hostnameList: CsvToArray(formValues.emailSettingsHostnameList),
        username: formValues.emailSettingsUsernameType,
        usernameList: CsvToArray(formValues.emailSettingsUsernameList),
        usernameRegEx: formValues.emailSettingsUsernameRegEx,
      };
    }

    SaveFormFillerOptions(newOptions);
    dispatch({ type: 'RECEIVED_OPTIONS', options: newOptions });
  };
}

export function deleteCustomField(options: IFormFillerOptions, index: number): MyDefaultThunkResult {
  return dispatch => {
    const newOptions = Object.assign({}, options);
    newOptions.fields = newOptions.fields.filter((item, itemIndex) => itemIndex !== index);
    SaveFormFillerOptions(newOptions);
    dispatch({ type: 'RECEIVED_OPTIONS', options: newOptions });
  };
}

export function saveSortedCustomFields(
  options: IFormFillerOptions,
  customFields: ICustomField[],
): MyDefaultThunkResult {
  return dispatch => {
    const newOptions = Object.assign({}, options);
    newOptions.fields = customFields;
    SaveFormFillerOptions(newOptions);
    dispatch({ type: 'RECEIVED_OPTIONS', options: newOptions });
  };
}

export function saveCustomField(
  options: IFormFillerOptions,
  customField: ICustomFieldForm,
  customFieldIndex: number,
): MyDefaultThunkResult {
  return dispatch => {
    const newOptions = Object.assign({}, options, { fields: [...options.fields] });

    const newCustomField: ICustomField = {
      match: CsvToArray(customField.match),
      name: customField.name,
      type: customField.type,
    };

    if (newCustomField.type === 'number') {
      newCustomField.min = parseInt(customField.numberMin, 10);
      newCustomField.max = parseInt(customField.numberMax, 10);
    }

    if (newCustomField.type === 'text') {
      newCustomField.min = parseInt(customField.textMin, 10);
      newCustomField.max = parseInt(customField.textMax, 10);
      newCustomField.maxLength = parseInt(customField.textMaxLength, 10);
    }

    if (newCustomField.type === 'telephone') {
      newCustomField.template = customField.telephoneTemplate;
    }

    if (newCustomField.type === 'date') {
      newCustomField.template = customField.dateTemplate;
    }

    if (newCustomField.type === 'alphanumeric') {
      newCustomField.template = customField.alphanumericTemplate;
    }

    if (newCustomField.type === 'regex') {
      newCustomField.template = customField.regexTemplate;
    }

    if (newCustomField.type === 'randomized-list') {
      newCustomField.list = customField.list ? MultipleLinesToArray(customField.list) : undefined;
    }

    if (customFieldIndex < 0) {
      newOptions.fields.push(newCustomField);
    } else {
      newOptions.fields[customFieldIndex] = newCustomField;
    }

    SaveFormFillerOptions(newOptions);
    dispatch({ type: 'RECEIVED_OPTIONS', options: newOptions });
  };
}

export function getKeyboardShortcuts(): MyDefaultThunkResult {
  return dispatch => {
    dispatch({ type: 'FETCHING_KEYBOARD_SHORTCUTS' });

    GetKeyboardShortcuts().then(shortcuts => {
      dispatch({ type: 'RECEIVED_KEYBOARD_SHORTCUTS', shortcuts });
    });
  };
}

export function saveKeyboardShortcuts(commands: IFormFillerBrowserCommand[]): MyDefaultThunkResult {
  return dispatch => {
    dispatch({ type: 'SAVING_KEYBOARD_SHORTCUTS' });

    SaveKeyboardShortcuts(commands).then(shortcuts => {
      dispatch({ type: 'RECEIVED_KEYBOARD_SHORTCUTS', shortcuts });
    });
  };
}
