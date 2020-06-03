/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import {
  CsvToArray,
  FormFillerDefaultOptions,
  GetFormFillerOptions,
  GetKeyboardShortcuts,
  MultipleLinesToArray,
  SaveFormFillerOptions,
} from "src/common/helpers";
import { IFormFillerOptions, IAppState, IFormFillerOptionsForm, ICustomField, ICustomFieldForm } from "src/types";

export interface IFetchingOptionsAction {
  type: "FETCHING_OPTIONS";
}

export interface IReceivedOptionsAction {
  type: "RECEIVED_OPTIONS";
  options: IFormFillerOptions;
}

export interface IFetchingKeyboardShortcutsAction {
  type: "FETCHING_KEYBOARD_SHORTCUTS";
}

export interface IReceivedKeyboardShortcutsAction {
  type: "RECEIVED_KEYBOARD_SHORTCUTS";
  shortcuts: chrome.commands.Command[];
}

export type MyActions =
  | IFetchingOptionsAction
  | IReceivedOptionsAction
  | IFetchingKeyboardShortcutsAction
  | IReceivedKeyboardShortcutsAction;

type MyThunkResult<R> = ThunkAction<R, IAppState, unknown, MyActions>;
type MyDefaultThunkResult = MyThunkResult<void>;
type MyThunkDispatch = ThunkDispatch<IAppState, unknown, MyActions>;

export type DispatchProps = {
  dispatch: MyThunkDispatch;
};

export function getOptions(): MyDefaultThunkResult {
  return (dispatch) => {
    dispatch({ type: "FETCHING_OPTIONS" });

    GetFormFillerOptions().then((options) => {
      dispatch({ type: "RECEIVED_OPTIONS", options });
    });
  };
}

export function resetOptions(): MyDefaultThunkResult {
  return (dispatch) => {
    const options = FormFillerDefaultOptions();
    SaveFormFillerOptions(options);
    dispatch({ type: "RECEIVED_OPTIONS", options });
  };
}

export function saveOptions(options: IFormFillerOptions, formValues?: IFormFillerOptionsForm): MyDefaultThunkResult {
  return (dispatch) => {
    const updatedOptions = produce(options, (draft) => {
      if (formValues) {
        draft.agreeTermsFields = CsvToArray(formValues.agreeTermsFields);
        draft.confirmFields = CsvToArray(formValues.confirmFields);
        draft.defaultMaxLength = parseInt(formValues.defaultMaxLength, 10);
        draft.enableContextMenu = formValues.enableContextMenu;
        draft.ignoreFieldsWithContent = formValues.ignoreFieldsWithContent;
        draft.ignoreHiddenFields = formValues.ignoreHiddenFields;
        draft.ignoredFields = CsvToArray(formValues.ignoredFields);
        draft.triggerClickEvents = formValues.triggerClickEvents;

        draft.passwordSettings = {
          mode: formValues.passwordSettingsMode,
          password: formValues.passwordSettingsPassword,
        };

        draft.fieldMatchSettings = {
          matchClass: formValues.fieldMatchClass,
          matchId: formValues.fieldMatchId,
          matchLabel: formValues.fieldMatchLabel,
          matchName: formValues.fieldMatchName,
          matchPlaceholder: formValues.fieldMatchPlaceholder,
        };

        draft.emailSettings = {
          hostname: formValues.emailSettingsHostnameType,
          hostnameList: CsvToArray(formValues.emailSettingsHostnameList),
          username: formValues.emailSettingsUsernameType,
          usernameList: CsvToArray(formValues.emailSettingsUsernameList),
          usernameRegEx: formValues.emailSettingsUsernameRegEx,
        };
      }

      return draft;
    });

    SaveFormFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
  };
}

export function deleteCustomField(index: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFormFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      draft.fields.splice(index, 1);
      return draft;
    });

    SaveFormFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
  };
}

export function saveSortedCustomFields(customFields: ICustomField[]): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFormFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      draft.fields = customFields;
      return draft;
    });
    SaveFormFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
  };
}

function createCustomFieldFromFormData(formData: ICustomFieldForm): ICustomField {
  const customField: ICustomField = {
    match: CsvToArray(formData.match),
    name: formData.name.trim(),
    type: formData.type,
  };

  if (customField.type === "number") {
    customField.min = parseInt(formData.numberMin, 10);
    customField.max = parseInt(formData.numberMax, 10);
    customField.decimalPlaces = parseInt(formData.numberDecimalPlaces, 10);
  }

  if (customField.type === "text") {
    customField.min = parseInt(formData.textMin, 10);
    customField.max = parseInt(formData.textMax, 10);
    customField.maxLength = parseInt(formData.textMaxLength, 10);
  }

  if (customField.type === "telephone") {
    customField.template = formData.telephoneTemplate;
  }

  if (customField.type === "date") {
    customField.template = formData.dateTemplate;

    const min = parseInt(formData.dateMin, 10);
    const max = parseInt(formData.dateMax, 10);

    if (!Number.isNaN(min)) {
      customField.min = min;
    }

    if (!Number.isNaN(max)) {
      customField.max = max;
    }

    if (formData.dateMinDate) {
      customField.minDate = formData.dateMinDate;
    }

    if (formData.dateMaxDate) {
      customField.maxDate = formData.dateMaxDate;
    }
  }

  if (customField.type === "alphanumeric") {
    customField.template = formData.alphanumericTemplate;
  }

  if (customField.type === "regex") {
    customField.template = formData.regexTemplate;
  }

  if (customField.type === "randomized-list") {
    customField.list = formData.list ? MultipleLinesToArray(formData.list) : undefined;
  }

  return customField;
}

export function createCustomField(customField: ICustomFieldForm, customFieldIndex: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFormFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      const newCustomField: ICustomField = createCustomFieldFromFormData(customField);
      draft.fields.splice(customFieldIndex, 0, newCustomField);
      return draft;
    });
    SaveFormFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
  };
}

export function saveCustomField(customField: ICustomFieldForm, customFieldIndex: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFormFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      const newCustomField: ICustomField = createCustomFieldFromFormData(customField);
      draft.fields[customFieldIndex] = newCustomField;
      return draft;
    });
    SaveFormFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
  };
}

export function getKeyboardShortcuts(): MyDefaultThunkResult {
  return (dispatch) => {
    dispatch({ type: "FETCHING_KEYBOARD_SHORTCUTS" });

    GetKeyboardShortcuts().then((shortcuts) => {
      dispatch({ type: "RECEIVED_KEYBOARD_SHORTCUTS", shortcuts });
    });
  };
}
