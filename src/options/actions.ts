/* eslint-disable no-param-reassign */

import { produce } from "immer";
import { ThunkAction, ThunkDispatch } from "redux-thunk";

import {
  CsvToArray,
  GetFakeFillerOptions,
  GetKeyboardShortcuts,
  MultipleLinesToArray,
  SaveFakeFillerOptions,
} from "src/common/helpers";
import {
  IFakeFillerOptions,
  IAppState,
  IFakeFillerOptionsForm,
  ICustomField,
  ICustomFieldForm,
  IProfile,
  FirebaseUser,
  FirebaseCustomClaims,
} from "src/types";

export interface IFetchingOptionsAction {
  type: "FETCHING_OPTIONS";
}

export interface IReceivedOptionsAction {
  type: "RECEIVED_OPTIONS";
  options: IFakeFillerOptions;
}

export interface IFetchingKeyboardShortcutsAction {
  type: "FETCHING_KEYBOARD_SHORTCUTS";
}

export interface IReceivedKeyboardShortcutsAction {
  type: "RECEIVED_KEYBOARD_SHORTCUTS";
  shortcuts: chrome.commands.Command[];
}

export interface IUpdateAuthStateAction {
  type: "UPDATE_AUTH_STATE";
  user: FirebaseUser;
  claims: FirebaseCustomClaims;
}

export type MyActions =
  | IFetchingOptionsAction
  | IReceivedOptionsAction
  | IFetchingKeyboardShortcutsAction
  | IReceivedKeyboardShortcutsAction
  | IUpdateAuthStateAction;

type MyThunkResult<R> = ThunkAction<Promise<R>, IAppState, unknown, MyActions>;
type MyDefaultThunkResult = MyThunkResult<void>;
export type MyThunkDispatch = ThunkDispatch<IAppState, unknown, MyActions>;

export function updateAuthState(user: FirebaseUser, claims: FirebaseCustomClaims): MyActions {
  return { type: "UPDATE_AUTH_STATE", user, claims };
}

export function getOptions(): MyDefaultThunkResult {
  return (dispatch) => {
    dispatch({ type: "FETCHING_OPTIONS" });

    return GetFakeFillerOptions().then((options) => {
      dispatch({ type: "RECEIVED_OPTIONS", options });
      return Promise.resolve();
    });
  };
}

// export function resetOptions(): MyDefaultThunkResult {
//   return (dispatch) => {
//     const options = FakeFillerDefaultOptions();
//     SaveFakeFillerOptions(options);
//     dispatch({ type: "RECEIVED_OPTIONS", options });
//     return Promise.resolve();
//   };
// }

export function saveOptions(options: IFakeFillerOptions, formValues?: IFakeFillerOptionsForm): MyDefaultThunkResult {
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
          matchAriaLabel: formValues.fieldMatchAriaLabel,
          matchAriaLabelledBy: formValues.fieldMatchAriaLabelledBy,
          matchName: formValues.fieldMatchName,
          matchPlaceholder: formValues.fieldMatchPlaceholder,
        };
      }

      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}

export function deleteCustomField(index: number, profileIndex: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      if (profileIndex < 0) {
        draft.fields.splice(index, 1);
      } else {
        draft.profiles[profileIndex].fields.splice(index, 1);
      }
      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}

export function saveSortedCustomFields(customFields: ICustomField[], profileIndex: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      if (profileIndex < 0) {
        draft.fields = customFields;
      } else {
        draft.profiles[profileIndex].fields = customFields;
      }
      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
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
    customField.template = formData.telephoneTemplate.trim();
  }

  if (customField.type === "date") {
    customField.template = formData.dateTemplate.trim();

    const min = parseInt(formData.dateMin, 10);
    const max = parseInt(formData.dateMax, 10);

    if (!Number.isNaN(min)) {
      customField.min = min;
    }

    if (!Number.isNaN(max)) {
      customField.max = max;
    }

    if (formData.dateMinDate) {
      customField.minDate = formData.dateMinDate.trim();
    }

    if (formData.dateMaxDate) {
      customField.maxDate = formData.dateMaxDate.trim();
    }
  }

  if (customField.type === "alphanumeric") {
    customField.template = formData.alphanumericTemplate.trim();
  }

  if (customField.type === "regex") {
    customField.template = formData.regexTemplate.trim();
  }

  if (customField.type === "randomized-list") {
    customField.list = formData.list ? MultipleLinesToArray(formData.list) : undefined;
  }

  if (customField.type === "email") {
    customField.emailPrefix = formData.emailPrefix.trim();
    customField.emailHostname = formData.emailHostname;
    customField.emailHostnameList = CsvToArray(formData.emailHostnameList);
    customField.emailUsername = formData.emailUsername;
    customField.emailUsernameList = CsvToArray(formData.emailUsernameList);
    customField.emailUsernameRegEx = formData.emailUsernameRegEx.trim();
  }

  return customField;
}

export function createCustomField(
  customField: ICustomFieldForm,
  customFieldIndex: number,
  profileIndex: number
): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      const newCustomField: ICustomField = createCustomFieldFromFormData(customField);

      if (profileIndex < 0) {
        draft.fields.splice(customFieldIndex, 0, newCustomField);
      } else {
        draft.profiles[profileIndex].fields.splice(customFieldIndex, 0, newCustomField);
      }

      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}

export function saveCustomField(
  customField: ICustomFieldForm,
  customFieldIndex: number,
  profileIndex: number
): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      const newCustomField: ICustomField = createCustomFieldFromFormData(customField);

      if (profileIndex < 0) {
        draft.fields[customFieldIndex] = newCustomField;
      } else {
        draft.profiles[profileIndex].fields[customFieldIndex] = newCustomField;
      }

      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}

export function getKeyboardShortcuts(): MyDefaultThunkResult {
  return (dispatch) => {
    dispatch({ type: "FETCHING_KEYBOARD_SHORTCUTS" });

    return GetKeyboardShortcuts().then((shortcuts) => {
      dispatch({ type: "RECEIVED_KEYBOARD_SHORTCUTS", shortcuts });
      return Promise.resolve();
    });
  };
}

export function deleteProfile(profileIndex: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      if (profileIndex >= 0) {
        draft.profiles.splice(profileIndex, 1);
      }
      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}

function createProfileFromFormData(formData: IProfile): IProfile {
  const profile: IProfile = {
    name: formData.name.trim(),
    urlMatch: formData.urlMatch,
    fields: [],
  };
  return profile;
}

export function createProfile(profile: IProfile): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      draft.profiles.push(createProfileFromFormData(profile));
      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}

export function saveProfile(profile: IProfile, profileIndex: number): MyDefaultThunkResult {
  return (dispatch, getState) => {
    const state = getState();
    const options = state.optionsData.options as IFakeFillerOptions;

    const updatedOptions = produce(options, (draft) => {
      draft.profiles[profileIndex].name = profile.name;
      draft.profiles[profileIndex].urlMatch = profile.urlMatch;
      return draft;
    });

    SaveFakeFillerOptions(updatedOptions);
    dispatch({ type: "RECEIVED_OPTIONS", options: updatedOptions });
    return Promise.resolve();
  };
}
