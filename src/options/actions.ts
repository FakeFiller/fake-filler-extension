/// <reference path="../../index.d.ts" />

import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import {
  CsvToArray,
  FormFillerDefaultOptions,
  GetFormFillerOptions,
  GetKeyboardShortcuts,
  MultipleLinesToArray,
  SaveFormFillerOptions,
} from 'src/common/helpers';

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

export type MyActions =
  | IFetchingOptionsAction
  | IReceivedOptionsAction
  | IFetchingKeyboardShortcutsAction
  | IReceivedKeyboardShortcutsAction;

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

function createCustomFieldFromFormData(formData: ICustomFieldForm): ICustomField {
  const customField: ICustomField = {
    match: CsvToArray(formData.match),
    name: formData.name,
    type: formData.type,
  };

  if (customField.type === 'number') {
    customField.min = parseInt(formData.numberMin, 10);
    customField.max = parseInt(formData.numberMax, 10);
    customField.decimalPlaces = parseInt(formData.numberDecimalPlaces, 10);
  }

  if (customField.type === 'text') {
    customField.min = parseInt(formData.textMin, 10);
    customField.max = parseInt(formData.textMax, 10);
    customField.maxLength = parseInt(formData.textMaxLength, 10);
  }

  if (customField.type === 'telephone') {
    customField.template = formData.telephoneTemplate;
  }

  if (customField.type === 'date') {
    customField.template = formData.dateTemplate;

    const min = parseInt(formData.dateMin, 10);
    const max = parseInt(formData.dateMax, 10);

    if (!isNaN(min)) {
      customField.min = min;
    }

    if (!isNaN(max)) {
      customField.max = max;
    }

    if (formData.dateMinDate) {
      customField.minDate = formData.dateMinDate;
    }

    if (formData.dateMaxDate) {
      customField.maxDate = formData.dateMaxDate;
    }
  }

  if (customField.type === 'alphanumeric') {
    customField.template = formData.alphanumericTemplate;
  }

  if (customField.type === 'regex') {
    customField.template = formData.regexTemplate;
  }

  if (customField.type === 'randomized-list') {
    customField.list = formData.list ? MultipleLinesToArray(formData.list) : undefined;
  }

  return customField;
}

export function createCustomField(
  options: IFormFillerOptions,
  customField: ICustomFieldForm,
  customFieldIndex: number,
): MyDefaultThunkResult {
  return dispatch => {
    const newOptions = Object.assign({}, options, { fields: [...options.fields] });
    const newCustomField: ICustomField = createCustomFieldFromFormData(customField);
    newOptions.fields.splice(customFieldIndex, 0, newCustomField);
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
    const newCustomField: ICustomField = createCustomFieldFromFormData(customField);
    newOptions.fields[customFieldIndex] = newCustomField;
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
